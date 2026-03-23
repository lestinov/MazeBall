# 🟡 Maze Ball

A top-down 3D maze game built with [Babylon.js](https://www.babylonjs.com/) and Oimo.js physics.  
Roll a glowing ball through a labyrinth from the red start tile to the pulsing green finish — as fast as you can.

---

## 🎮 Gameplay

- Navigate through a maze of walls using physics-based movement
- The timer starts automatically when you move
- Reach the green tile to finish and see your time
- Try to beat your personal best!

---

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `W` | Move forward |
| `S` | Move backward |
| `A` | Move left |
| `D` | Move right |
| `Space` | Jump |

---

## ✨ Features

- Real physics with momentum, gravity and bouncing (Oimo.js)
- Live timer accurate to tenths of a second
- Finish screen with your final time
- Restart without reloading the page
- Atmospheric dark theme with dynamic lighting
- The ball emits light that illuminates the ground around it
- Start tile glows red, finish tile pulses green

---

## 🛠️ Technologies

- [Babylon.js](https://www.babylonjs.com/) — 3D rendering engine
- [Oimo.js](https://github.com/lo-th/Oimo.js/) — physics simulation
- Vanilla JavaScript, HTML5 Canvas

---

## 🚀 How to Run

1. Clone or download this repository
2. Make sure all files are in the same folder:
   ```
   index_2.html
   Objekte.js
   SpielKamera.js
   babylon.max.js
   oimo.js
   ```
3. Open `index_2.html` in a browser  
   *(use a local server like VS Code Live Server for best results)*

---

## 📁 Project Structure

```
├── index_2.html       — Main HTML file
├── SpielKamera.js     — Camera, engine, timer, finish logic
├── Objekte.js         — All game objects: ground, walls, player, maze
├── babylon.max.js     — Babylon.js library
└── oimo.js            — Physics library
```

---

## 👤 Author

**Nikita Korytko**  
Zürich, Switzerland  
Built as a personal project to learn 3D web development and game logic.
