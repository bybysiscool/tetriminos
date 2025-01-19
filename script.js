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

function createGrid() {
    grid.innerHTML = '';
    gridArray = Array.from({ length: rows }, () => Array(cols).fill(0));
    gridArray.forEach(row => row.forEach(() => {
        const div = document.createElement('div');
        grid.appendChild(div);
    }));
}

function drawTetromino() {
    currentTetromino.shape.forEach((row, r) => row.forEach((cell, c) => {
        if (cell) gridArray[currentPos.y + r][currentPos.x + c] = 1;
    }));
    renderGrid();
}

function renderGrid() {
    Array.from(grid.children).forEach((div, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        div.style.backgroundColor = gridArray[row][col] ? '#00ff00' : '#333';
    });
}

function spawnTetromino() {
    const keys = Object.keys(tetrominos);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    currentTetromino = { shape: tetrominos[randomKey] };
    currentPos = { x: Math.floor(cols / 2) - 1, y: 0 };
    drawTetromino();
}

function moveLeft() {
    currentPos.x = Math.max(0, currentPos.x - 1);
    drawTetromino();
}

function moveRight() {
    currentPos.x = Math.min(cols - currentTetromino.shape[0].length, currentPos.x + 1);
    drawTetromino();
}

function rotate() {
    currentTetromino.shape = currentTetromino.shape[0].map((_, i) =>
        currentTetromino.shape.map(row => row[i]).reverse()
    );
    drawTetromino();
}

function drop() {
    currentPos.y = Math.min(rows - currentTetromino.shape.length, currentPos.y + 1);
    drawTetromino();
    // Check for collision or landing logic here.
}

function startGame() {
    createGrid();
    spawnTetromino();
}

startGame();
