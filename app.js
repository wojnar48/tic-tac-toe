const statusDisplay = document.querySelector(".gameStatus");
let gameActive = true;
let player1 = null;
let player2 = "computer";
let currentPlayer = player1;
let gameState = ["", "", "", "", "", "", "", "", ""];
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => "Game ended in a draw!";
const currentPlayerTurn = () => {
  if (player1 === null) {
    return "";
  }
  return `It's ${currentPlayer}'s turn${
    currentPlayer === "computer" ? "..." : ""
  }`;
};
statusDisplay.innerHTML = currentPlayerTurn();
function handleCellPlayed(clickedCell, clickedCellIndex) {
  if (currentPlayer === null) {
    currentPlayer = player1;
  }
  let playerSymbol = currentPlayer === player1 ? "X" : "O";
  if (currentPlayer === player1) {
    gameState[clickedCellIndex] = "X";
  } else {
    gameState[clickedCellIndex] = "O";
  }
  clickedCell.innerHTML = playerSymbol;
}
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
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
    gameActive = false;
    return;
  }
  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }
  handlePlayerChange();
}
function makeComputerMove() {
  if (emptyCell) {
    gameState[emptyCell] = "O";
  }
}
function handlePlayerChange() {
  currentPlayer = currentPlayer === player1 ? player2 : player1;

  if (currentPlayer === "computer") {
    setTimeout(() => {
      let index = gameState.indexOf("");
      let cell = document.querySelector(`[data-cell-index="${index}"]`);
      handleCellPlayed(cell, index);

      currentPlayer = player1;
      statusDisplay.innerHTML = currentPlayerTurn();
      return;
    }, 4000);
  }
  statusDisplay.innerHTML = currentPlayerTurn();
}

function handleCellClick(clickedCellEvent) {
  if (currentPlayer === "computer") {
    return;
  }
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );
  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }
  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}
function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
}
function handlePlayer1(event) {
  const player1Name = document.getElementById("player1").value;
  player1 = player1Name;
  statusDisplay.innerHTML = currentPlayerTurn();
}
function handlePlayer2(event) {
  const player2Name = document.getElementById("player2").value;
  player2 = player2Name;
  statusDisplay.innerHTML = currentPlayerTurn();
}
document
  .querySelectorAll(".cell")
  .forEach((cell) => cell.addEventListener("click", handleCellClick));
document.querySelector(".restart").addEventListener("click", handleRestartGame);

document
  .querySelector("#buttonPlayer1")
  .addEventListener("click", handlePlayer1);
document
  .querySelector("#buttonPlayer2")
  .addEventListener("click", handlePlayer2);
