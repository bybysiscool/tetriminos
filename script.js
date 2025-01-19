document.addEventListener('DOMContentLoaded', () => {
  let ws;
  let roomCode;
  let gameStarted = false;
  let secondPlayerJoined = false;
  let thirdPlayerJoined = false;

  // Establish WebSocket connection
  function connectToServer() {
    ws = new WebSocket('wss://retrotube.info/ws');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'roomCreated':
          roomCode = data.roomCode;
          document.getElementById('room-id').textContent = roomCode;
          document.getElementById('peer-id-display').classList.remove('hidden');
          break;

        case 'roomJoined':
          if (data.playerCount === 2) secondPlayerJoined = true;
          if (data.playerCount === 3) thirdPlayerJoined = true;
          checkStartGame();
          break;

        case 'gameStarted':
          gameStarted = true;
          document.getElementById('main-menu').style.display = 'none';
          document.getElementById('game-container').style.display = 'flex';
          startGame();
          break;

        case 'newPlayerJoined':
          // Show "Waiting for players" until all players are connected
          if (!secondPlayerJoined || !thirdPlayerJoined) {
            document.getElementById('waiting-screen').classList.remove('hidden');
          }
          break;

        case 'gameData':
          // Handle game data from the other players (e.g., move)
          break;

        case 'garbageLines':
          // Handle receiving garbage lines
          break;

        case 'playerLeft':
          alert('A player left the room.');
          break;

        case 'roomFull':
          alert('The room is already full.');
          break;
      }
    };
  }

  // Handle "Start Game" for the first player
  document.getElementById('start-game').addEventListener('click', () => {
    connectToServer();
    ws.send(JSON.stringify({ type: 'createRoom' }));
    document.getElementById('waiting-screen').classList.remove('hidden');
  });

  // Handle "Join Game" for the second or third player
  document.getElementById('join-game').addEventListener('click', () => {
    const enteredRoomCode = prompt('Enter room code:');
    connectToServer();
    ws.send(JSON.stringify({ type: 'joinRoom', roomCode: enteredRoomCode }));
  });

  // Check if enough players are connected and start the game
  function checkStartGame() {
    if (secondPlayerJoined && thirdPlayerJoined && !gameStarted) {
      ws.send(JSON.stringify({ type: 'startGame' }));
    }
  }

  // Start the game logic (placeholders)
  function startGame() {
    console.log('Game started!');
    gameLoop();
  }

  function gameLoop() {
    if (gameStarted) {
      // Add your game logic here
      requestAnimationFrame(gameLoop);
    }
  }

  // Prevent closing the tab while the game is running
  window.addEventListener('beforeunload', (event) => {
    if (gameStarted) {
      const message = 'Are you sure you want to leave? Your game progress may be lost.';
      event.returnValue = message;
      return message;
    }
  });
});
