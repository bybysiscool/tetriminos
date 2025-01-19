document.addEventListener('DOMContentLoaded', () => {
  const peer = new Peer();
  let conn = null;
  let player1Game = new Tetris('player1');
  let player2Game = new Tetris('player2');
  let gameStarted = false;
  let secondPlayerJoined = false;

  // Initialize the PeerJS connection when the peer ID is ready
  peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
  });

  // Wait for connection from another player
  peer.on('connection', (connection) => {
    console.log('Second player connected');
    conn = connection;
    secondPlayerJoined = true;
    connection.on('data', (data) => {
      console.log('Received data:', data);
      if (data.type === 'move') {
        player1Game.handleMove(data);
      } else if (data.type === 'garbage') {
        player2Game.addGarbage(data.lines);
      }
    });
    checkStartGame();
  });

  // Wait for the second player to join before starting the game
  function checkStartGame() {
    if (secondPlayerJoined && !gameStarted) {
      startGame();
    }
  }

  // Start the game when the second player joins
  function startGame() {
    gameStarted = true;
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    gameLoop();
  }

  function gameLoop() {
    if (!gameStarted) return;
    player1Game.update();
    player2Game.update();
    requestAnimationFrame(gameLoop);
  }

  // Start game button
  document.getElementById('start-game').addEventListener('click', () => {
    // Create a new connection with the second player
    const peerId = prompt('Enter peer ID to connect:');
    connectToPeer(peerId);
    startGame();
  });

  // Join game button (for second player)
  document.getElementById('join-game').addEventListener('click', () => {
    const peerId = prompt('Enter peer ID to join the game:');
    connectToPeer(peerId);
  });

  function connectToPeer(peerId) {
    conn = peer.connect(peerId);
    conn.on('open', () => {
      console.log('Connected to peer');
      secondPlayerJoined = true;
      checkStartGame();
    });
    conn.on('data', (data) => {
      console.log('Received data:', data);
      if (data.type === 'move') {
        player2Game.handleMove(data);
      } else if (data.type === 'garbage') {
        player1Game.addGarbage(data.lines);
      }
    });
  }

  // Tetris game class
  class Tetris {
    constructor(player) {
      this.player = player;
      this.board = this.createBoard();
      this.currentTetrimino = this.randomTetrimino();
    }

    createBoard() {
      return Array.from({ length: 20 }, () => Array(10).fill(0));
    }

    randomTetrimino() {
      const tetriminos = [
        [[1, 1, 1, 1]],  // I piece
        [[1, 1], [1, 1]], // O piece
        [[0, 1, 0], [1, 1, 1]], // T piece
        [[1, 1, 0], [0, 1, 1]], // S piece
        [[0, 1, 1], [1, 1, 0]], // Z piece
        [[1, 0, 0], [1, 1, 1]], // L piece
        [[0, 0, 1], [1, 1, 1]], // J piece
      ];
      return tetriminos[Math.floor(Math.random() * tetriminos.length)];
    }

    draw(boardId) {
      const boardElement = document.getElementById(boardId);
      boardElement.innerHTML = '';
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          if (this.board[y][x] > 0) {
            cell.style.backgroundColor = 'blue';
          }
          boardElement.appendChild(cell);
        }
      }
    }

    update() {
      // Move tetrimino down and check for collisions
      this.draw(this.player === 'player1' ? 'player1-box' : 'player2-box');
    }

    handleMove(data) {
      // Handle move from other player
    }

    addGarbage(lines) {
      // Add garbage lines to the opponent's board
    }
  }
});
