const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const tetrominos = [
  [[1, 1, 1, 1]],  // I
  [[1, 1], [1, 1]],  // O
  [[1, 1, 0], [0, 1, 1]],  // S
  [[0, 1, 1], [1, 1, 0]],  // Z
  [[1, 0, 0], [1, 1, 1]],  // L
  [[0, 0, 1], [1, 1, 1]],  // J
  [[0, 1, 0], [1, 1, 1]]   // T
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentTetromino = generateTetromino();
const ws = new WebSocket('wss://retrotube.info/ws'); // Connect to your WebSocket server

ws.onopen = () => {
  // Join the game room when connected
  ws.send(JSON.stringify({ type: 'joinRoom', roomId: 'room1' }));
};

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.type === 'move') {
    // Handle received moves
    applyMove(data.move);
  }
};

function generateTetromino() {
  const shape = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return { shape, x: Math.floor(COLS / 2) - 1, y: 0 };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
  drawTetromino();
}

function drawTetromino() {
  const { shape, x, y } = currentTetromino;
  shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (cell) {
        ctx.fillStyle = 'red';
        ctx.fillRect((x + dx) * BLOCK_SIZE, (y + dy) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    });
  });
}

function moveTetromino(dx, dy) {
  currentTetromino.x += dx;
  currentTetromino.y += dy;
  sendMove({ type: 'move', move: { x: currentTetromino.x, y: currentTetromino.y } });
  draw();
}

function rotateTetromino() {
  const shape = currentTetromino.shape;
  const newShape = shape[0].map((_, index) => shape.map(row => row[index]));
  currentTetromino.shape = newShape;
  sendMove({ type: 'move', move: { shape: currentTetromino.shape } });
  draw();
}

function applyMove(move) {
  if (move.x !== undefined && move.y !== undefined) {
    currentTetromino.x = move.x;
    currentTetromino.y = move.y;
  }
  if (move.shape) {
    currentTetromino.shape = move.shape;
  }
  draw();
}

function sendMove(move) {
  ws.send(JSON.stringify({ type: 'move', roomId: 'room1', move }));
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') moveTetromino(-1, 0);
  if (event.key === 'ArrowRight') moveTetromino(1, 0);
  if (event.key === 'ArrowDown') moveTetromino(0, 1);
  if (event.key === 'ArrowUp') rotateTetromino();
});

draw();
