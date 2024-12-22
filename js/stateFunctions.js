import { GameState } from "./script.js";

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

export function readyToStartUpdate(
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

export function nextStatus(currentPair, players) {
  genetrateRandomPair(players, currentPair);
  if (currentPair.includes(1)) {
    return GameState.ENCOUTERED;
  }
  return GameState.PASSED;
}

export function fight(
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

export function endTheGame(
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

export function declareWinner(players, payoutsAmounts) {
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
