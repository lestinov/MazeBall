var canvas = document.getElementById("renderCanvas");

// ─── Timer UI ─────────────────────────────────────────────────
var timerDisplay = document.createElement("div");
timerDisplay.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: rgba(0,0,0,0.7); color: #FFE325;
    font-family: 'Courier New', monospace;
    font-size: 30px; font-weight: bold;
    padding: 10px 30px; border-radius: 12px;
    z-index: 100; letter-spacing: 3px;
    border: 2px solid rgba(255,227,37,0.5);
    box-shadow: 0 0 20px rgba(255,227,37,0.2);
    text-shadow: 0 0 10px rgba(255,227,37,0.8);
`;
timerDisplay.innerText = "00:00.0";
document.body.appendChild(timerDisplay);

// ─── Steuerung-Hinweis ────────────────────────────────────────
var hint = document.createElement("div");
hint.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: rgba(0,0,0,0.6); color: rgba(255,255,255,0.4);
    font-family: 'Courier New', monospace; font-size: 13px;
    padding: 8px 20px; border-radius: 8px; z-index: 100; letter-spacing: 1px;
`;
hint.innerText = "W A S D — Bewegen   |   SPACE — Springen";
document.body.appendChild(hint);

// ─── Ziel-Screen ──────────────────────────────────────────────
var finishScreen = document.createElement("div");
finishScreen.style.cssText = `
    display: none; position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85);
    z-index: 200; justify-content: center; align-items: center;
    flex-direction: column;
`;
finishScreen.innerHTML = `
    <div style="
        background: linear-gradient(135deg,#0d1f0d,#0a1a10);
        border: 2px solid #4FAF73; border-radius: 20px;
        padding: 55px 80px; text-align: center;
        box-shadow: 0 0 60px rgba(79,175,115,0.4);
    ">
        <div style="font-size:56px;margin-bottom:12px">🏆</div>
        <div style="color:#4FAF73;font-family:'Courier New',monospace;font-size:28px;
            font-weight:bold;letter-spacing:4px;
            text-shadow:0 0 15px rgba(79,175,115,0.8);margin-bottom:6px">ZIEL ERREICHT!</div>
        <div style="color:#555;font-family:'Courier New',monospace;font-size:14px;
            margin-bottom:18px;letter-spacing:2px">DEINE ZEIT</div>
        <div id="finalTime" style="color:#FFE325;font-family:'Courier New',monospace;
            font-size:52px;font-weight:bold;letter-spacing:4px;
            text-shadow:0 0 20px rgba(255,227,37,0.7);margin-bottom:36px">00:00.0</div>
        <button id="restartBtn" style="
            background:transparent; border:2px solid #4FAF73; color:#4FAF73;
            font-size:16px;font-family:'Courier New',monospace;font-weight:bold;
            padding:14px 40px;border-radius:10px;cursor:pointer;letter-spacing:2px;
            box-shadow:0 0 15px rgba(79,175,115,0.2);"
            onmouseover="this.style.background='rgba(79,175,115,0.15)'"
            onmouseout="this.style.background='transparent'">
            ↺ NOCHMAL
        </button>
    </div>
`;
document.body.appendChild(finishScreen);

// ─── Zustand ──────────────────────────────────────────────────
var gameStartTime = null;
var gameRunning   = false;
var gameFinished  = false;

function formatTime(ms) {
    var totalSec = Math.floor(ms / 1000);
    var min   = Math.floor(totalSec / 60);
    var sec   = totalSec % 60;
    var tenth = Math.floor((ms % 1000) / 100);
    return (min < 10 ? "0" : "") + min + ":" +
           (sec < 10 ? "0" : "") + sec + "." + tenth;
}

function startTimer()      { gameStartTime = performance.now(); gameRunning = true; gameFinished = false; }
function showFinish(t)     { gameRunning = false; gameFinished = true; document.getElementById("finalTime").innerText = t; finishScreen.style.display = "flex"; }

document.getElementById("restartBtn").addEventListener("click", function () {
    finishScreen.style.display = "none";
    timerDisplay.innerText = "00:00.0";
    gameFinished = false; gameRunning = false; gameStartTime = null;
    if (window.playerRef) {
        window.playerRef.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
        window.playerRef.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
        window.playerRef.position = new BABYLON.Vector3(24, 1, -24);
    }
});

// ─── Engine & Render Loop ─────────────────────────────────────
var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
            if (window.playerRef) {
                var p = window.playerRef.position;
                if (!gameRunning && !gameFinished) {
                    var d = Math.sqrt(Math.pow(p.x-24,2)+Math.pow(p.z-(-24),2));
                    if (d > 1.5) startTimer();
                }
                if (gameRunning && gameStartTime !== null)
                    timerDisplay.innerText = formatTime(performance.now() - gameStartTime);
                if (gameRunning && !gameFinished) {
                    var df = Math.sqrt(Math.pow(p.x-(-24),2)+Math.pow(p.z-24,2));
                    if (df < 2.0) showFinish(formatTime(performance.now() - gameStartTime));
                }
            }
        }
    });
};

var engine = null, scene = null, sceneToRender = null;
var createDefaultEngine = function () {
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
};

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.04, 0.05, 0.07, 1);
    scene.fogMode    = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogColor   = new BABYLON.Color3(0.04, 0.05, 0.07);
    scene.fogDensity = 0.004;

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 80, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.inputs.clear();
    camera.attachControl(canvas, false);

    scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.OimoJSPlugin());

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity   = 0.25;
    light.diffuse     = new BABYLON.Color3(0.6, 0.7, 0.9);
    light.groundColor = new BABYLON.Color3(0.05, 0.05, 0.1);

    var dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), scene);
    dirLight.intensity = 0.15;
    dirLight.diffuse   = new BABYLON.Color3(0.5, 0.6, 0.8);

    makeGround(scene);
    setLimits(scene);
    createParcour(scene);

    var color    = BABYLON.Color3.FromHexString("#FFE325");
    var player_1 = createPlayer(18, -18, scene, color);
    window.playerRef = player_1;
    movePlayer_1(player_1);

    return scene;
};

window.initFunction = async function () {
    var asyncEngineCreation = async function () {
        try { return createDefaultEngine(); } catch(e) { return createDefaultEngine(); }
    };
    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};

initFunction().then(() => { sceneToRender = scene; });
window.addEventListener("resize", function () { engine.resize(); });
