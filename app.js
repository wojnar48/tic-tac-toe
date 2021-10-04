const WINNING_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

class Player {
  constructor(name='Player') {
    this.name = name;
  }
}

class HumanPlayer extends Player {
  constructor(name) {
    super(name);
    this.symbol = 'X';
  }
  isHuman() {
    return true;
  }
}

class ComputerPlayer extends Player {
  constructor() {
    super('Computer');
    this.symbol = 'O';
  }
  isHuman() {
    return false;
  }
}

let isGameActive = false;
let player1 = null;
let player2 = null;
let currentPlayer = null;
let gameState = ["", "", "", "", "", "", "", "", ""];

const statusDisplay = document.querySelector(".gameStatus");

function showWhoIsPlaying() {
  const players = document.getElementById('active-players');
  players.innerHTML = `<span id="active-player-1">${player1.name}</span> vs <span id="active-player-2">${player2.name}</span>`;
  players.classList.remove('hidden');
}
  
const winningMessage = () => `Player ${currentPlayer.name} has won!`;
const drawMessage = () => "Game ended in a draw!";
const currentPlayerTurn = () => `It's ${currentPlayer.name}'s turn${currentPlayer.isHuman() ? '' : '...'}`;

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer.symbol;
  clickedCell.innerHTML = currentPlayer.symbol;
  // Check if there is a winner or a draw
  handleResultValidation()
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = WINNING_CONDITIONS[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }
  if (roundWon) {
    statusDisplay.innerHTML = winningMessage();
    isGameActive = false;
    document.getElementById('restart-button').classList.remove('hidden');
    return;
  }
  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    isGameActive = false;
    document.getElementById('restart-button').classList.remove('hidden');
    return;
  }
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === player1 ? player2 : player1;

  // If current player is not human, complete move automatically
  if (!currentPlayer.isHuman()) {
    setTimeout(() => {
      let index = gameState.indexOf("");
      let cell = document.querySelector(`[data-cell-index="${index}"]`);
      handleCellPlayed(cell, index);

      // Give turn to other player if game is still active
      if (isGameActive) {
        currentPlayer = player1;
        statusDisplay.innerHTML = currentPlayerTurn();
      }
      return;
    }, 2000);
  }
  statusDisplay.innerHTML = currentPlayerTurn();
}

function handleCellClick(clickedCellEvent) {
  // If currentPlayer is not human, then we must wait for our turn
  if (!currentPlayer.isHuman()) {
    return;
  }

  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );
  if (gameState[clickedCellIndex] !== "" || !isGameActive) {
    return;
  }
  handleCellPlayed(clickedCell, clickedCellIndex);
  handlePlayerChange();
}

function handleRestartGame() {
  currentPlayer = player1;
  gameState = ["", "", "", "", "", "", "", "", ""];
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
  document.getElementById('restart-button').classList.add('hidden');
  handleStartGame()
}

function handleResetGame() {
  isGameActive = false;
  currentPlayer = null;

  document.getElementById('player1').value = '';
  document.getElementById('player2').value = '';
  gameState = ["", "", "", "", "", "", "", "", ""];
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));

  const button = document.getElementById('start-game-button')
  button.removeEventListener('click', handleResetGame);
  button.addEventListener('click', handleStartGame);
  button.innerText = 'Start game';


  // Hide active players
  document.getElementById('active-players').classList.add('hidden');
  // Hide board
  document.getElementById('board').classList.add('hidden');
  // Hide current player turn info
  document.getElementById('info').classList.add('hidden');
}

function handleStartGame() {
  isGameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
  
  player1 = document.getElementById("player1").value === '' ? new HumanPlayer(): new HumanPlayer(player1Name);
  player2 = document.getElementById("player2").value === '' ? new ComputerPlayer(): new HumanPlayer(player2Name);
  currentPlayer = player1;
  
  showWhoIsPlaying()

  // Show the board
  document.getElementById('board').classList.remove('hidden');
  // Show current player turn
  document.getElementById('info').classList.remove('hidden');
  // Hide play again button
  document.getElementById('restart-button').classList.add('hidden');
  
  
  // Change handler function on button and innter text
  const button = document.getElementById('start-game-button')
  button.removeEventListener('click', handleStartGame);
  button.addEventListener('click', handleResetGame);
  button.innerText = 'Change players'

  statusDisplay.innerHTML = currentPlayerTurn();
}

function ready() {
  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.addEventListener("click", handleCellClick));
  document.getElementById("restart-button").addEventListener("click", handleRestartGame);
  document.getElementById("start-game-button").addEventListener("click", handleStartGame);
}

document.addEventListener('DOMContentLoaded', ready)