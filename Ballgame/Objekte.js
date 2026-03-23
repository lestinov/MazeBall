function makeGround(scene) {
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50, subdivisions: 20 }, scene);
    ground.position.y = 0;
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseColor  = new BABYLON.Color3(0.08, 0.09, 0.12);
    groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.15);
    groundMaterial.emissiveColor = new BABYLON.Color3(0.02, 0.03, 0.05);
    ground.material = groundMaterial;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 0 }, scene
    );
    return ground;
}

function createWall(name, position, rotation, size, scene, color) {
    var wall = BABYLON.MeshBuilder.CreatePlane(name, { size: 2, width: size.width, height: size.height }, scene);
    wall.position.copyFrom(position);
    wall.rotation.y = rotation.y;
    wall.physicsImpostor = new BABYLON.PhysicsImpostor(
        wall, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 0.5 }, scene
    );
    var wallMaterial = new BABYLON.StandardMaterial(name + "Material", scene);
    wallMaterial.diffuseColor  = new BABYLON.Color3(0.12, 0.15, 0.2);
    wallMaterial.emissiveColor = new BABYLON.Color3(0.03, 0.05, 0.08);
    wallMaterial.backFaceCulling = false;
    wall.material = wallMaterial;
    return wall;
}

function setLimits(scene) {
    var wallSize = { width: 50, height: 110 };
    createWall("northWall", new BABYLON.Vector3(0, 1, -25), new BABYLON.Vector3(0, 0, 0), wallSize, scene);
    createWall("SuedWall",  new BABYLON.Vector3(0, 1,  25), new BABYLON.Vector3(0, 0, 0), wallSize, scene);
    createWall("WestWall",  new BABYLON.Vector3( 25, 1, 0), new BABYLON.Vector3(0, Math.PI / 2, 0), wallSize, scene);
    createWall("OstWall",   new BABYLON.Vector3(-25, 1, 0), new BABYLON.Vector3(0, Math.PI / 2, 0), wallSize, scene);
}

function createPlayer(x, z, scene, mycolor) {
    const player = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    const playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
    playerMaterial.diffuseColor  = mycolor;
    playerMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.35, 0.0);
    playerMaterial.specularColor = new BABYLON.Color3(1, 1, 0.5);
    playerMaterial.specularPower = 64;
    player.position = new BABYLON.Vector3(24, 1, -24);
    player.physicsImpostor = new BABYLON.PhysicsImpostor(
        player, BABYLON.PhysicsImpostor.SphereImpostor, { restitution: 0.2, mass: 1, friction: 0 }, scene
    );
    player.material = playerMaterial;
    player.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    player.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());

    // Lichtpunkt der dem Spieler folgt
    var playerLight = new BABYLON.PointLight("playerLight", player.position.clone(), scene);
    playerLight.diffuse  = new BABYLON.Color3(1, 0.9, 0.3);
    playerLight.specular = new BABYLON.Color3(1, 0.8, 0.2);
    playerLight.intensity = 1.2;
    playerLight.range = 12;

    scene.registerBeforeRender(function () {
        playerLight.position.copyFrom(player.position);
        playerLight.position.y += 1;
    });

    return player;
}

// ─── Hilfsfunktion: Maze-Wand mit schönem Material ───────────
function makeMazeWall(opts, scene) {
    var mesh = BABYLON.MeshBuilder.CreateBox(opts.name || "wall", opts.size, scene);
    mesh.position.x = opts.x;
    mesh.position.y = opts.y !== undefined ? opts.y : 1;
    mesh.position.z = opts.z;

    var mat = new BABYLON.StandardMaterial((opts.name || "wall") + "Mat", scene);
    mat.diffuseColor  = new BABYLON.Color3(0.25, 0.32, 0.38);
    mat.emissiveColor = new BABYLON.Color3(0.03, 0.06, 0.09);
    mat.specularColor = new BABYLON.Color3(0.4, 0.5, 0.6);
    mat.specularPower = 32;
    mesh.material = mat;
    mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
        mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5 }, scene
    );
    mesh.isVisible = true;
    return mesh;
}

var keysStatePlayer1 = {};
var isPlayer1ListenerAdded = false;

function movePlayer_1(player_1) {
    if (!isPlayer1ListenerAdded) {
        var keysStatePlayer1 = {};

        function handleKeyDown() {
            var diff = 0.2;
            var impulse = BABYLON.Vector3.Zero();
            if (keysStatePlayer1[87]) impulse.z -= diff;
            if (keysStatePlayer1[83]) impulse.z += diff;
            if (keysStatePlayer1[68]) impulse.x -= diff;
            if (keysStatePlayer1[65]) impulse.x += diff;
            if (keysStatePlayer1[32]) impulse.y += diff;
            player_1.applyImpulse(impulse, player_1.getAbsolutePosition());
            requestAnimationFrame(handleKeyDown);
        }

        window.addEventListener("keydown", function (event) {
            keysStatePlayer1[event.keyCode] = true;
            if (!isPlayer1ListenerAdded) {
                isPlayer1ListenerAdded = true;
                requestAnimationFrame(handleKeyDown);
            }
        });
        window.addEventListener("keyup", function (event) {
            keysStatePlayer1[event.keyCode] = false;
        });
    }
}

function createParcour(scene) {
    var walls = [
        { size: { width: 20, height: 2, depth: 1  }, x:  10, z: -20 },
        { size: { width:  1, height: 2, depth: 20 }, x:  10, z: -15 },
        { size: { width: 10, height: 2, depth:  1 }, x:  20, z: -15 },
        { size: { width: 10, height: 2, depth:  1 }, x:  20, z: -10 },
        { size: { width: 20, height: 2, depth:  1 }, x:  15, z:   0 },
        { size: { width: 10, height: 2, depth:  1 }, x:  15, z:  -5.5 },
        { size: { width:  1, height: 2, depth: 15 }, x:   5, z: -12.5 },
        { size: { width:  1, height: 2, depth: 15 }, x:   5, z:   7  },
        { size: { width: 10, height: 2, depth:  1 }, x:  10, z:  14  },
        { size: { width:  1, height: 2, depth: 10 }, x:  20, z:  20  },
        { size: { width:  1, height: 2, depth: 10 }, x:  15, z:  15  },
        { size: { width: 10, height: 2, depth:  1 }, x:  15, z:  10  },
        { size: { width:  1, height: 2, depth:  5 }, x:  20, z:   8  },
        { size: { width: 10, height: 2, depth:  1 }, x:  15.5, z: 6  },
        { size: { width:  1, height: 2, depth: 14 }, x: -20, z:  18  },
        { size: { width: 10, height: 2, depth:  1 }, x: -15, z:  16  },
        { size: { width: 10, height: 2, depth:  1 }, x: -20, z:   6  },
        { size: { width:  1, height: 2, depth: 10 }, x: -10, z:  15  },
        { size: { width: 10, height: 2, depth:  1 }, x: -10, z:  20  },
        { size: { width:  1, height: 2, depth: 10 }, x:  -5.5, z: 15 },
        { size: { width:  1, height: 2, depth: 10 }, x: -15.5, z:  1 },
        { size: { width: 10, height: 2, depth:  1 }, x:  10.5, z: 20 },
        { size: { width:  5, height: 2, depth:  1 }, x:  -3, z:  15  },
        { size: { width: 10, height: 2, depth:  1 }, x: -15, z:  -4  },
        { size: { width: 10, height: 2, depth:  1 }, x: -10, z:   6  },
        { size: { width:  1, height: 2, depth: 12 }, x: -10, z:  -4  },
        { size: { width: 11, height: 2, depth:  1 }, x:   0, z:   2  },
        { size: { width:  8, height: 2, depth:  1 }, x:   1, z:  10  },
        { size: { width:  8, height: 2, depth:  1 }, x:   1, z:  -5.5},
        { size: { width:  1, height: 2, depth:  6 }, x:   1, z:  22  },
        { size: { width:  1, height: 2, depth:  6 }, x: -14, z:   9  },
        { size: { width:  1, height: 2, depth:  6 }, x:   0, z:   2  },
        { size: { width: 20, height: 2, depth:  1 }, x:  -5, z: -15  },
        { size: { width: 10, height: 2, depth:  1 }, x:   0, z: -10  },
        { size: { width:  1, height: 2, depth:  5 }, x:  -6, z: -17  },
        { size: { width: 10, height: 2, depth:  1 }, x: -20, z: -20  },
        { size: { width: 10, height: 2, depth:  1 }, x: -20, z: -10  },
    ];

    walls.forEach(function(w, i) {
        makeMazeWall({ name: "w" + i, size: w.size, x: w.x, y: 1, z: w.z }, scene);
    });

    // ─── Startplatte (ROT) ────────────────────────────────────
    var startTile = BABYLON.MeshBuilder.CreateBox("startTile", { width: 2, height: 0.1, depth: 2 }, scene);
    startTile.position = new BABYLON.Vector3(24, 0, -24);
    var startMat = new BABYLON.StandardMaterial("startMat", scene);
    startMat.diffuseColor  = new BABYLON.Color3(0.73, 0.24, 0.24);
    startMat.emissiveColor = new BABYLON.Color3(0.5, 0.05, 0.05);
    startMat.specularColor = new BABYLON.Color3(1, 0.3, 0.3);
    startTile.material = startMat;
    startTile.physicsImpostor = new BABYLON.PhysicsImpostor(
        startTile, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5 }, scene
    );

    // Rotes Licht auf Startplatte
    var startLight = new BABYLON.PointLight("startLight", new BABYLON.Vector3(24, 2, -24), scene);
    startLight.diffuse    = new BABYLON.Color3(1, 0.2, 0.2);
    startLight.intensity  = 1.5;
    startLight.range      = 6;

    // ─── Zielplatte (GRÜN) ────────────────────────────────────
    var finishTile = BABYLON.MeshBuilder.CreateBox("finishTile", { width: 2, height: 0.1, depth: 2 }, scene);
    finishTile.position = new BABYLON.Vector3(-24, 0, 24);
    var finishMat = new BABYLON.StandardMaterial("finishMat", scene);
    finishMat.diffuseColor  = new BABYLON.Color3(0.31, 0.69, 0.45);
    finishMat.emissiveColor = new BABYLON.Color3(0.1, 0.5, 0.15);
    finishMat.specularColor = new BABYLON.Color3(0.4, 1, 0.5);
    finishTile.material = finishMat;
    finishTile.physicsImpostor = new BABYLON.PhysicsImpostor(
        finishTile, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5 }, scene
    );

    // Grünes Licht auf Zielplatte — pulsierend
    var finishLight = new BABYLON.PointLight("finishLight", new BABYLON.Vector3(-24, 2, 24), scene);
    finishLight.diffuse   = new BABYLON.Color3(0.2, 1, 0.3);
    finishLight.intensity = 1.5;
    finishLight.range     = 6;

    // Pulsieren der Zielplatte
    var t = 0;
    scene.registerBeforeRender(function () {
        t += 0.05;
        var pulse = 0.1 + Math.abs(Math.sin(t)) * 0.45;
        finishMat.emissiveColor = new BABYLON.Color3(0.05, pulse, 0.1);
        finishLight.intensity   = 0.8 + Math.abs(Math.sin(t)) * 1.2;

        var startPulse = 0.05 + Math.abs(Math.sin(t + 1)) * 0.3;
        startMat.emissiveColor  = new BABYLON.Color3(startPulse, 0.02, 0.02);
        startLight.intensity    = 0.8 + Math.abs(Math.sin(t + 1)) * 0.8;
    });
}
