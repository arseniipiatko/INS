function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatCurrency(value) {
  return "$" + Math.round(value).toLocaleString(); // Round the value and format with commas
}

const deathProbabilities = [
  0.000489649846773466, 0.0000350067393084519, 0.0000226694929356119,
  0.0000187519338717967, 0.0000153346265964194, 0.0000130842748826687,
  0.0000116674153447516, 0.0000106672924956586, 0.0000101672351970894,
  0.0000102505778891704, 0.0000107506356461506, 0.0000115007274391621,
  0.0000136676940520886, 0.0000183351822042876, 0.0000258370045466139,
  0.0000371742663183294, 0.0000530988377650532, 0.0000723621259127727,
  0.0000917129144495377, 0.000105894987183719, 0.00011448873134412,
  0.000124084648483347, 0.000133848490852517, 0.00014294566384665,
  0.000153045426933396, 0.000163730695466935, 0.000173665782935428,
  0.000183685458335914, 0.000194374329680724, 0.000204980936687083,
  0.000214753473308793, 0.000223858747834704, 0.000232547199665811,
  0.0002404009381195, 0.000248171794086649, 0.000256528294567349,
  0.000264969140027715, 0.000274998886429234, 0.000287454028825906,
  0.000301165018241734, 0.000315547059099419, 0.000330433195915081,
  0.000345990978248722, 0.000362137084666481, 0.000379122872988913,
  0.000398706490146949, 0.00042298264263374, 0.000451033859690697,
  0.000484287860952115, 0.000519314047646158, 0.000557623684793951,
  0.000599220922143373, 0.000646963801199218, 0.000698594615347603,
  0.000756052642777338, 0.000817835357218133, 0.000884877198158662,
  0.000954831778455456, 0.00103006570364639, 0.00110873620234986,
  0.00119676265147028, 0.00128850896492083, 0.00138415557647908,
  0.00148007246905646, 0.0015768539491734, 0.00167484222257464,
  0.0017759106131271, 0.00188806684229981, 0.00200930718083336,
  0.00213804685483965, 0.00228260634781396, 0.00244682789001416,
  0.00263690892868307, 0.00285731165946113, 0.00311506982257936,
  0.00344477185302694, 0.00376951028926842, 0.00413422133859842,
  0.00454779658758686, 0.00503530082156489,
];

const monthlyFees = [
  50.11, 35.72, 23.13, 19.13, 15.65, 13.35, 11.91, 10.89, 10.38, 10.46, 10.97,
  11.74, 13.95, 18.71, 26.36, 37.93, 54.18, 73.85, 69.65, 79.12, 84.15, 89.69,
  95.11, 99.83, 105.01, 110.35, 114.92, 119.31, 123.88, 128.13, 131.62, 134.46,
  136.84, 138.52, 139.96, 141.54, 142.95, 145.0, 148.06, 151.44, 154.81, 158.08,
  161.29, 164.4, 167.47, 171.25, 176.52, 182.72, 190.29, 197.72, 205.51, 213.54,
  222.67, 231.93, 241.8, 251.6, 261.45, 270.49, 279.25, 287.06, 295.26, 302.19,
  307.72, 310.96, 312.0, 310.88, 307.87, 304.15, 299.02, 291.91, 283.59, 273.88,
  262.69, 249.43, 233.48, 215.62, 189.16, 155.97, 114.7, 63.7,
];

const insurancePayouts = [
  100000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000,
  1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000,
  1000000, 1000000, 744000, 732000, 720000, 708000, 696000, 684000, 672000,
  660000, 648000, 636000, 624000, 612000, 600000, 588000, 576000, 564000,
  552000, 540000, 528000, 516000, 504000, 492000, 480000, 468000, 456000,
  444000, 432000, 420000, 408000, 396000, 384000, 372000, 360000, 348000,
  336000, 324000, 312000, 300000, 288000, 276000, 264000, 252000, 240000,
  228000, 216000, 204000, 192000, 180000, 168000, 156000, 144000, 132000,
  120000, 108000, 96000, 84000, 72000, 60000, 48000, 36000, 24000, 12000,
];

// Get references to buttons, status, and playing info
const startButton = document.getElementById("start");
const statusText = document.querySelector("#status p");
const playingInfoDiv = document.getElementById("playing-info");
const totaIncomeElement = document.getElementById("total-income");
const totaPayoutElement = document.getElementById("total-payout");
const totaProfitElement = document.getElementById("total-profit");
const averageProfitElement = document.getElementById("average-profit");
const totalClientsElement = document.getElementById("total-clients");
const userInput = document.getElementById("user-input");
const inputSection = document.getElementById("input-section");
const playerGrid = document.querySelector(".player-grid");
const popup = document.getElementById("popup");

// Create array of 80 zeros for quantity tracking
let quantity = new Array(80).fill(0);
// Create array of 80 zeros for new clients tracking
let newClients = new Array(80).fill(0);
// Create array of 80 zeros for dead tracking
let dead = new Array(80).fill(0);
// Create array of 80 zeros for grow up tracking
let growUpCounter = new Array(80).fill(0);
// Initialize user input value
let userInputValue = 0;

// Function to populate the grid with 80 rows
function populateGrid() {
  // Clear existing grid items (except headers)
  const existingItems = playerGrid.querySelectorAll(".grid-item");
  existingItems.forEach((item) => item.remove());

  // Create 80 rows of data
  for (let i = 0; i < 80; i++) {
    // Age column (0-79)
    const ageCell = document.createElement("div");
    ageCell.className = "grid-item";
    ageCell.textContent = i;
    playerGrid.appendChild(ageCell);

    // Qty column (0)
    const qtyCell = document.createElement("div");
    qtyCell.className = "grid-item";
    qtyCell.textContent = quantity[i].toLocaleString(); // Use quantity array
    playerGrid.appendChild(qtyCell);

    // New column (0)
    const newCell = document.createElement("div");
    newCell.className = "grid-item";
    newCell.textContent = newClients[i].toLocaleString(); // Use newClients array
    playerGrid.appendChild(newCell);

    // Dead column (0)
    const deadCell = document.createElement("div");
    deadCell.className = "grid-item";
    deadCell.textContent = dead[i].toLocaleString(); // Use dead array
    playerGrid.appendChild(deadCell);
  }
}

//Input number format validation
function validateAndFormatInput(event) {
  const input = event.target; // Get the input element
  const value = input.value.replace(/,/g, ""); // Remove any commas from the input

  // Check if the value is a valid integer and within range
  const parsedValue = parseInt(value, 10);
  if (
    !Number.isInteger(parsedValue) ||
    parsedValue < 0 ||
    parsedValue > 1000000000
  ) {
    input.value = ""; // Clear the input if it's invalid
    alert("Please enter a valid integer between 0 and 1,000,000,000.");
    return;
  }

  // Format the value with thousand separators
  input.value = parsedValue.toLocaleString();
}

//Add event listener to format and assert userInput
userInput.addEventListener("change", validateAndFormatInput);

// Function to handle the start button click
startButton.addEventListener("click", () => {
  // Get the user input value and parse it as an integer
  userInputValue = parseInt(userInput.value.replace(/,/g, ""), 10);
  if (!isNaN(userInputValue)) {
    updateNew(userInputValue); // Update the new clients array with the user input value
    growUp(); // Call the grow up function
    calculateDeath(); // Calculate the number of deaths
    sumQuantity(); // Update the quantity array

    calculateTotals(); // Calculate totals for income, payout, and profit
    populateGrid(); // Update the grid with the new values

    playingInfoDiv.classList.remove("hidden"); // Show the playing info section
    statusText.classList.add("hidden"); // Update status text
    userInput.value = ""; // Clear the user input field
  }
});

// Function to update the new clients array based on user input
function updateNew(value) {
  // Reset the new clients array to zeros
  newClients = new Array(80).fill(0);
  // Update the new clients array with the user input value
  for (let i = 0; i < value; i++) {
    const newClientAge = randBetween(0, 79); // Randomly assign age between 0 and 79
    newClients[newClientAge] = newClients[newClientAge] + 1; // Increment the count for that age
  }
}

// Function to handle the grow up process
function growUp() {
  growUpCounter = new Array(80).fill(0); // Reset grow up counter
  for (let i = 0; i < 80; i++) {
    for (let j = 0; j < quantity[i]; j++) {
      if (randBetween(1, 12) == 1) {
        growUpCounter[i] += 1; // Increment the grow up counter for this age
      }
    }
  }
}

// Function to calculate the number of deaths based on probabilities
function calculateDeath() {
  dead = new Array(80).fill(0); // Reset dead array
  for (let i = 0; i < 80; i++) {
    for (let j = 0; j < quantity[i]; j++) {
      if (Math.random() <= deathProbabilities[i]) {
        dead[i] += 1; // Increment the dead count for this age
      }
    }
  }
}

// Function to sum up the quantities, new clients, dead clients, and grown-up clients
function sumQuantity() {
  for (let i = 0; i < 80; i++) {
    quantity[i] += newClients[i]; // Add new clients to the quantity
    quantity[i] -= dead[i]; // Subtract dead clients from the quantity
    quantity[i] -= growUpCounter[i]; // Subtract grown-up clients from the quantity
    if (i > 0) {
      // Ensure we don't access negative index
      quantity[i] += growUpCounter[i - 1]; // Add grown-up clients back to the quantity
    }
  }
}

function calculateTotals() {
  let totalIncome = 0;
  let totalPayout = 0;
  let totalProfit = 0;

  for (let i = 0; i < 80; i++) {
    const monthlyFee = monthlyFees[i];
    const insurancePayout = insurancePayouts[i];

    // Calculate income and payout for this age group
    totalIncome += quantity[i] * monthlyFee;
    totalPayout += dead[i] * insurancePayout;
  }

  totalProfit = totalIncome - totalPayout;
  totalClientsElement.textContent = quantity
    .reduce((a, b) => a + b, 0)
    .toLocaleString(); // Total clients

  // Update the totals in the UI
  totaIncomeElement.textContent = formatCurrency(totalIncome);
  totaPayoutElement.textContent = formatCurrency(totalPayout);
  totaProfitElement.textContent = formatCurrency(totalProfit);
  averageProfitElement.textContent = formatCurrency(totalIncome / 51); // Average profit per month
}

function showPopUp() {
  popup.classList.add("visible");
  setTimeout(() => {
    popup.classList.remove("visible");
  }, 1000);
}

// Add click event listener to copy profit value to clipboard
playingInfoDiv.addEventListener("click", () => {
  // Get the profit text and extract raw number
  const profitText = totaProfitElement.textContent;
  // Remove dollar sign and commas to get raw number
  const rawProfit = profitText.replace(/[$,]/g, "");

  // Copy to clipboard
  navigator.clipboard
    .writeText(rawProfit)
    .then(() => {
      showPopUp(); // Show the popup to indicate value was copied
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
});

// Populate the grid when the page loads
populateGrid();
