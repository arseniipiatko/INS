function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genetrateRandomPair(players, currentPair) {
  const playersPool = [];
  currentPair.splice(0, 2);
  for (let key in players) {
    if (players[key].position === "") {
      playersPool.push(players[key].id);
    }
  }
  const player1 = randBetween(0, playersPool.length - 1);
  currentPair.push(playersPool[player1]);
  playersPool.splice(player1, 1);
  const player2 = randBetween(0, playersPool.length - 1);
  currentPair.push(playersPool[player2]);
}

function readyToStartUpdate(
  players,
  currentPosition,
  currentPayout,
  payoutsAmounts
) {
  for (let i = 1; i <= 100; i++) {
    players[i] = { id: i, kills: 0, position: "", payout: "" };
  }
  currentPosition["current"] = 100;
  currentPayout["current"] = payoutsAmounts[currentPosition["current"]];
}

function nextStatus(currentPair, players) {
  genetrateRandomPair(players, currentPair);
  if (currentPair.includes(1)) {
    return GameState.ENCOUTERED;
  }
  return GameState.PASSED;
}

function fight(
  currentPosition,
  currentPair,
  players,
  currentSkill,
  currentPayout,
  payoutsAmounts
) {
  const randomFactor = Math.random();
  if (currentPair.includes(1)) {
    let opponentID;
    if (currentPair[0] === 1) {
      opponentID = currentPair[1];
    } else {
      opponentID = currentPair[0];
    }

    if (randomFactor < currentSkill) {
      players[opponentID].position = currentPosition["current"];
      players[opponentID].payout = currentPayout["current"];
      players[1].kills += 1;
    } else {
      players[1].position = currentPosition["current"];
      players[1].payout = currentPayout["current"];
      players[opponentID].kills += 1;
    }
  } else {
    if (randomFactor < 0.5) {
      players[currentPair[0]].position = currentPosition["current"];
      players[currentPair[0]].payout = currentPayout["current"];
      players[currentPair[1]].kills += 1;
    } else {
      players[currentPair[1]].position = currentPosition["current"];
      players[currentPair[1]].payout = currentPayout["current"];
      players[currentPair[0]].kills += 1;
    }
  }

  currentPosition["current"] -= 1;
  currentPayout["current"] = payoutsAmounts[currentPosition["current"]];
}

function endTheGame(
  currentPosition,
  currentPair,
  players,
  currentSkill,
  currentPayout,
  payoutsAmounts
) {
  for (let i = currentPosition["current"]; i > 1; i--) {
    genetrateRandomPair(players, currentPair);
    fight(
      currentPosition,
      currentPair,
      players,
      currentSkill,
      currentPayout,
      payoutsAmounts
    );
  }
}

function declareWinner(players, payoutsAmounts) {
  if (players[1].position === "") {
    players[1].position = 1;
    players[1].payout = payoutsAmounts[1];
    return "You won the game!";
  }
  for (let key in players) {
    if (players[key].position === "") {
      players[key].position = 1;
      players[key].payout = payoutsAmounts[1];
      return `The winner is Player ${players[key].id}`;
    }
  }
}

// Define the game states using an enum-like object
const GameState = Object.freeze({
  READY_TO_START: "READY_TO_START",
  PASSED: "PASSED",
  ENCOUTERED: "ENCOUTERED",
  LOST: "LOST",
  WON: "WON",
  END_OF_GAME: "END_OF_GAME",
});

const payoutsAmounts = { 1: 1000000000 };

for (let i = 2; i <= 100; i++) {
  payoutsAmounts[i] = payoutsAmounts[i - 1] / (1 + 0.6 / Math.sqrt(i - 1));
}

function formatCurrency(value) {
  return "$" + Math.round(value).toLocaleString(); // Round the value and format with commas
}

for (let i = 1; i <= 100; i++) {
  payoutsAmounts[i] = formatCurrency(payoutsAmounts[i]);
}

// Initialize the game state to READY_TO_START
let currentState = GameState.READY_TO_START;

// Initialize game variables
let players = {};
let currentPosition = {};
let currentPayout = {};
let currentPair = [undefined, undefined];
let currentSkill = 0.5;

// Get references to buttons, status, and playing info
const restartButton = document.getElementById("restart");
const startButton = document.getElementById("start");
const statusText = document.querySelector("#status p");
const playingInfoDiv = document.getElementById("playing-info");
const currentPositionElement = document.getElementById("current-position");
const currentPayoutElement = document.getElementById("current-payout");
const userInput = document.getElementById("user-input");
const inputSection = document.getElementById("input-section");
const playerGrid = document.querySelector(".player-grid");

function updateGrid() {
  const existingItems = playerGrid.querySelectorAll(".grid-item");
  existingItems.forEach((item) => item.remove());
  const playerIDs = Object.keys(players).sort((a, b) => {
    if (players[a].position === "" && players[b].position === "") {
      return players[a].id - players[b].id;
    }
    return players[a].position - players[b].position;
  });

  // Add data rows
  playerIDs.forEach((player) => {
    const playerCell = document.createElement("div");
    playerCell.className = "grid-item";
    playerCell.textContent = `Player ${players[player].id}`;

    const killsCell = document.createElement("div");
    killsCell.className = "grid-item";
    killsCell.textContent = players[player].kills;

    const positionCell = document.createElement("div");
    positionCell.className = "grid-item";
    positionCell.textContent = players[player].position;

    const payoutCell = document.createElement("div");
    payoutCell.className = "grid-item";
    payoutCell.textContent = players[player].payout;

    // Append cells to the grid
    playerGrid.appendChild(playerCell);
    playerGrid.appendChild(killsCell);
    playerGrid.appendChild(positionCell);
    playerGrid.appendChild(payoutCell);
  });
}

// Update the game status and button text based on the current state
function updateGameStatus() {
  switch (currentState) {
    case GameState.READY_TO_START:
      statusText.textContent = "Press start to begin";
      restartButton.disabled = true; // Disable restart button initially
      startButton.disabled = false; // Enable start button
      startButton.textContent = "Start"; // Change text to "Start"
      playingInfoDiv.classList.add("hidden"); // Hide the playing info
      statusText.classList.remove("p-no-border"); // Remove larger font and border
      inputSection.classList.remove("hidden");
      playerGrid.classList.add("hidden");
      readyToStartUpdate(
        players,
        currentPosition,
        currentPayout,
        payoutsAmounts,
        currentPair
      );
      break;
    case GameState.PASSED:
      statusText.textContent = `Player ${currentPair[0]} have encoutered Player ${currentPair[1]}`;
      restartButton.disabled = false; // Enable restart button
      startButton.disabled = false; // Enable start button
      startButton.textContent = "Continue"; // Change text to "Next"
      playingInfoDiv.classList.remove("hidden"); // Show the playing info
      statusText.classList.add("p-no-border"); // Apply larger font and remove border
      inputSection.classList.add("hidden");
      playerGrid.classList.remove("hidden");
      updatePositionAndPayout(); // Update position and payout
      break;
    case GameState.ENCOUTERED:
      statusText.textContent = `You have encoutered Player ${
        currentPair[0] + currentPair[1] - 1
      }`;
      restartButton.disabled = false; // Enable restart button
      startButton.disabled = false; // Enable start button
      startButton.textContent = "Fight"; // Change text to "Next"
      playingInfoDiv.classList.remove("hidden"); // Show the playing info
      statusText.classList.add("p-no-border"); // Apply larger font and remove border
      inputSection.classList.add("hidden");
      playerGrid.classList.remove("hidden");
      startButton.style.backgroundColor = "red";
      updatePositionAndPayout(); // Update position and payout
      break;
    case GameState.LOST:
      statusText.textContent = "You lost the game!";
      startButton.textContent = "Results"; // Change text to "Next"
      startButton.style.backgroundColor = "white";
      playingInfoDiv.classList.add("hidden"); // Hide the playing info
      updatePositionAndPayout(); // Update position and payout
      break;
    case GameState.WON:
      statusText.textContent = "You won the battle!";
      startButton.textContent = "Continue";
      startButton.style.backgroundColor = "white";
      updatePositionAndPayout();
      break;
    case GameState.END_OF_GAME:
      statusText.textContent = declareWinner(players, payoutsAmounts);
      startButton.disabled = true; // Disable start button
      startButton.removeAttribute("style");
      playingInfoDiv.classList.add("hidden");
      updatePositionAndPayout(); // Update position and payout
      break;
  }
}

// Function to update position and payout
function updatePositionAndPayout() {
  currentPositionElement.textContent = currentPosition["current"];
  currentPayoutElement.textContent = currentPayout["current"];
  updateGrid();
}

// Start button functionality (Now also handles "Next" behavior)
startButton.addEventListener("click", () => {
  if (currentState === GameState.READY_TO_START) {
    try {
      updateCurrentSkill();
      currentState = nextStatus(currentPair, players);
      updateGameStatus();
    } catch (e) {
      alert(e.message);
    }
  } else if (currentState === GameState.ENCOUTERED) {
    fight(
      currentPosition,
      currentPair,
      players,
      currentSkill,
      currentPayout,
      payoutsAmounts
    );
    if (players[1].position === "") {
      currentState = GameState.WON;
    } else {
      currentState = GameState.LOST;
    }
    updateGameStatus();
  } else if (currentState === GameState.PASSED) {
    fight(
      currentPosition,
      currentPair,
      players,
      currentSkill,
      currentPayout,
      payoutsAmounts
    );
    currentState = nextStatus(currentPair, players);
    updateGameStatus();
  } else if (currentState === GameState.LOST) {
    endTheGame(
      currentPosition,
      currentPair,
      players,
      currentSkill,
      currentPayout,
      payoutsAmounts
    );
    currentState = GameState.END_OF_GAME;
    updateGameStatus();
  } else if (currentState === GameState.WON) {
    if (currentPosition["current"] === 1) {
      currentState = GameState.END_OF_GAME;
    } else {
      currentState = nextStatus(currentPair, players);
    }
    updateGameStatus();
  }
});

// Restart button functionality
restartButton.addEventListener("click", () => {
  currentState = GameState.READY_TO_START;
  updateGameStatus();
});

function updateCurrentSkill() {
  if (
    userInput.value <= 1 &&
    userInput.value >= 0 &&
    !isNaN(userInput.value) &&
    userInput.value !== ""
  ) {
    currentSkill = Number(userInput.value);
  } else {
    throw new Error("Factor must be an number between 0 and 1");
  }
}

// Initial state update
updateGameStatus();
