// Define the game states using an enum-like object
const GameState = Object.freeze({
  READY_TO_START: "READY_TO_START",
  PLAYING: "PLAYING",
  LOST: "LOST",
  WON: "WON",
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

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize the game state to READY_TO_START
let currentState = GameState.READY_TO_START;

// Initialize game variables
let currentPosition = 100;
let currentPayout = payoutsAmounts[currentPosition];
let currentLeave = randBetween(1, 100);

// Get references to buttons, status, and playing info
const restartButton = document.getElementById("restart");
const startButton = document.getElementById("start");
const statusText = document.querySelector("#status p");
const playingInfoDiv = document.getElementById("playing-info");
const currentPositionElement = document.getElementById("current-position");
const currentPayoutElement = document.getElementById("current-payout");
const skillFactor = document.getElementById("skill-factor");
const inexpFactor = document.getElementById("inexperience-factor");
const userInput = document.getElementById("user-input");
const inputSection = document.getElementById("input-section");

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
      break;
    case GameState.PLAYING:
      statusText.textContent = "Game is in progress...";
      restartButton.disabled = false; // Enable restart button
      startButton.disabled = false; // Enable start button
      startButton.textContent = "Next"; // Change text to "Next"
      playingInfoDiv.classList.remove("hidden"); // Show the playing info
      statusText.classList.add("p-no-border"); // Apply larger font and remove border
      inputSection.classList.add("hidden");
      updatePositionAndPayout(); // Update position and payout
      break;
    case GameState.LOST:
      statusText.textContent = "You lost the game!";
      restartButton.disabled = false; // Enable restart button
      startButton.disabled = true; // Disable start button
      startButton.textContent = "Next"; // Change text to "Next"
      playingInfoDiv.classList.remove("hidden"); // Show the playing info
      statusText.classList.add("p-no-border"); // Apply larger font and remove border
      inputSection.classList.add("hidden");
      updatePositionAndPayout(); // Update position and payout
      break;
    case GameState.WON:
      statusText.textContent = "You won the game!";
      startButton.disabled = true; // Disable start button
      updatePositionAndPayout();
      break;
  }
}

// Function to update position and payout
function updatePositionAndPayout() {
  currentPositionElement.textContent = currentPosition;
  currentPayoutElement.textContent = currentPayout;
}

// Start button functionality (Now also handles "Next" behavior)
startButton.addEventListener("click", () => {
  if (currentState === GameState.READY_TO_START) {
    try {
      updateCurrentLeave();
      if (currentLeave !== currentPosition) {
        currentState = GameState.PLAYING;
      } else {
        currentState = GameState.LOST;
      }
      updateGameStatus();
    } catch (e) {
      alert(e.message);
    }
  } else if (currentState === GameState.PLAYING) {
    // Add behavior for "Next" action, like progressing the game or handling win/loss states
    currentPosition -= 1;
    currentPayout = payoutsAmounts[currentPosition];
    if (currentLeave !== currentPosition) {
      updatePositionAndPayout();
    } else if (currentPosition === 1) {
      currentState = GameState.WON;
      updateGameStatus();
    } else {
      currentState = GameState.LOST;
      updateGameStatus();
    }
  }
});

// Restart button functionality
restartButton.addEventListener("click", () => {
  currentState = GameState.READY_TO_START;
  updateGameStatus();
  currentPosition = 100;
  currentPayout = payoutsAmounts[currentPosition];
  currentLeave = randBetween(1, 100);
});

function updateCurrentLeave() {
  if (
    userInput.value <= 100 &&
    userInput.value > 0 &&
    Number.isInteger(Number(userInput.value))
  ) {
    if (skillFactor.checked) {
      let minValue = 100;
      for (let i = 1; i <= userInput.value; i++) {
        minValue = Math.min(minValue, randBetween(1, 100));
      }
      currentLeave = minValue;
    } else {
      let maxValue = 1;
      for (let i = 1; i <= userInput.value; i++) {
        maxValue = Math.max(maxValue, randBetween(1, 100));
      }
      currentLeave = maxValue;
    }
  } else {
    throw new Error("Factor must be an integer between 1 and 100");
  }
}

// Initial state update
updateGameStatus();
