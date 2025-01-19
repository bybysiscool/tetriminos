const grid = document.getElementById('gameGrid');
const scoreDisplay = document.getElementById('score');
const rows = 20, cols = 10;
let gridArray = [];
let currentTetromino, currentPos, score = 0;

const tetrominos = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]],
};

// Create a blank grid
function createGrid() {
    grid.innerHTML = '';
    gridArray = Array.from({ length: rows }, () => Array(cols).fill(0));
    gridArray.forEach(() => {
        for (let i = 0; i < cols; i++) {
            const div = document.createElement('div');
            grid.appendChild(div);
        }
    });
}

// Draw the tetromino on the grid
function drawTetromino() {
    clearGrid();
    currentTetromino.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                const x = currentPos.x + c;
                const y = currentPos.y + r;
                if (y >= 0 && y < rows && x >= 0 && x < cols) {
                    const index = y * cols + x;
                    grid.children[index].classList.add('active');
                }
            }
        });
    });
}

// Clear grid visual (remove active class)
function clearGrid() {
    Array.from(grid.children).forEach(div => div.classList.remove('active'));
}

// Spawn a random tetromino
function spawnTetromino() {
    const keys = Object.keys(tetrominos);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    currentTetromino = { shape: tetrominos[randomKey] };
    currentPos = { x: Math.floor(cols / 2) - 1, y: 0 };
    drawTetromino();
}

// Move tetromino left
function moveLeft() {
    currentPos.x = Math.max(0, currentPos.x - 1);
    drawTetromino();
}

// Move tetromino right
function moveRight() {
    currentPos.x = Math.min(cols - currentTetromino.shape[0].length, currentPos.x + 1);
    drawTetromino();
}

// Rotate the tetromino
function rotate() {
    currentTetromino.shape = currentTetromino.shape[0].map((_, i) =>
        currentTetromino.shape.map(row => row[i]).reverse()
    );
    drawTetromino();
}

// Drop the tetromino
function drop() {
    currentPos.y = Math.min(rows - currentTetromino.shape.length, currentPos.y + 1);
    drawTetromino();
}

// Start the game
function startGame() {
    createGrid();
    spawnTetromino();
}

startGame();
