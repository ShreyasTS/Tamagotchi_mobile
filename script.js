let playerStats = {
  petName: "hehe",
  petEmoji: "🐹",
  happiness: 5,
  bored: 5,
  sleep: 5,
  hunger: 5,
  isSleeping: false,
  isPlaying: false,
  isEating: false,
  lastSlept: 0,
  lastAte: 0,
  lastPlayed: 0,
  currentState: "",
};

//Btns elements
let feedBtn = document.getElementById("feedBtn");
let playBtn = document.getElementById("playBtn");
let sleepBtn = document.getElementById("sleepBtn");
let fullscreenBtn = document.getElementById("fullscreenBtn");
let closeGameAreaBtn = document.getElementById("closeGameAreaBtn");

//Elements
let sleepHolder = document.getElementById("sleepHolder");
let gameholder = document.getElementById("gameholder");
let lightON = document.getElementById("lightON");
let gameAreaModal = document.getElementById("gameAreaModal");
let petName = document.getElementById("petName");
let petIcon = document.getElementById("petIcon");
let canvasHolder = document.getElementById("gameAreaModal");

const canvas = document.getElementById("gameAreaCanvas");
const ctx = canvas.getContext("2d");

//Stats Divs
let happinessStatsHolder = document.getElementById("happinessStatsHolder");
let boredStatsHolder = document.getElementById("boredStatsHolder");
let sleepStatsHolder = document.getElementById("sleepStatsHolder");
let hungerStatsHolder = document.getElementById("hungerStatsHolder");

let sleepStartTimer = 0;
let sleepEndTimer = 0;
let statsChecker;

let happinessStatTemplate = `<div class="statsValues">⭐</div>`;
let boredStatTemplate = `<div class="statsValues">🎮</div>`;
let sleepStatTemplate = `<div class="statsValues">💤</div>`;
let hungerStatTemplate = `<div class="statsValues">🥄</div>`;
let emptyStateTemplate = `<div class="statsValues">-</div>`;

const generateRandomID = (length) =>
  Array.from(
    { length },
    () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 62)]
  ).join("");

document.addEventListener("DOMContentLoaded", () => {
  ctx.color = "black";
  ctx.fillRect(10, 10, 50, 50);
  playerStats = JSON.parse(window.localStorage.getItem("gameState"));
  if (playerStats == null) {
    playerStats = {
      petName: "mousie",
      petEmoji: "🐹",
      happiness: 5,
      bored: 5,
      sleep: 3,
      hunger: 5,
      isSleeping: false,
      isPlaying: false,
      isEating: false,
      lastSlept: 0,
      lastAte: 0,
      lastPlayed: 0,
      currentState: "",
    };
  }
  petName.innerText = playerStats.petName;
  petIcon.innerText = playerStats.petEmoji;
  updateStatView(happinessStatsHolder, happinessStatTemplate, playerStats.happiness);
  updateStatView(hungerStatsHolder, hungerStatTemplate, playerStats.hunger);
  updateStatView(boredStatsHolder, boredStatTemplate, playerStats.bored);
  updateStatView(sleepStatsHolder, sleepStatTemplate, playerStats.sleep);
  if (playerStats.isSleeping || playerStats.currentState == "sleep") {
    setSleepState();
  }
  checkStatsAndUpdate();
});

function updateStatView(element, template, count) {
  if (element && count <= 5) {
    element.innerHTML = String(template).repeat(count);
  }
}

// updateStatView(happinessStatsHolder, happinessStatTemplate, 1);
// updateStatView(hungerStatsHolder, hungerStatTemplate, 3);
// updateStatView(boredStatsHolder, boredStatTemplate, 5);
// updateStatView(sleepStatsHolder, sleepStatTemplate, 1);

feedBtn.addEventListener("mouseup", (e) => {
  console.log("FEED");
  loadFeedContent();
  fedPet();
  // canvas.width = canvasHolder.style.width;
  // canvas.height = canvasHolder.style.height;
  gameAreaModal.style.display = "block";
});
playBtn.addEventListener("mouseup", (e) => {
  console.log("play");
  loadGameContent();
  gameAreaModal.style.display = "flex";
});
sleepBtn.addEventListener("mouseup", (e) => {
  if (playerStats.currentState != "sleep" || !playerStats.isSleeping) {
    sleepHolder.style.display = "flex";
    playerStats.isSleeping = true;
    playerStats.currentState = "sleep";
    petSlept();
    setSleepState();
    saveGameStats();
  }
});

fullscreenBtn.addEventListener("click", () => {
  gameholder.requestFullscreen();
});

closeGameAreaBtn.addEventListener("click", () => {
  gameAreaModal.style.display = "none";
});

lightON.addEventListener("mouseup", (e) => {
  updateGameStats();
  sleepStartTimer = playerStats.lastSlept;
  if (playerStats.currentState == "sleep" || playerStats.isSleeping) {
    sleepHolder.style.display = "none";
    playerStats.currentState = "idle";
    playerStats.isSleeping = false;
    sleepEndTimer = Date.now();
    playerStats.lastSlept = sleepEndTimer;
    let sleepTime = parseInt((sleepEndTimer - sleepStartTimer) / 1000);
    console.log("SLEPT FOR: ", sleepTime);
    playerStats.currentState = "idle";
    saveGameStats();
    if (sleepTime > 60) {
      let sleepRating = parseInt(sleepTime / 60);
      console.log("WOKE UP RATING: ", sleepRating);
      if (playerStats.sleep > 0 && playerStats.sleep - sleepRating > 0) {
        playerStats.sleep -= sleepRating;
        saveGameStats();
        updateStatView(sleepStatsHolder, sleepStatTemplate, playerStats.sleep);
      } else console.log(sleepRating);
    }
  }
});

function saveGameStats() {
  window.localStorage.setItem("gameState", JSON.stringify(playerStats));
}

function updateGameStats() {
  playerStats = JSON.parse(window.localStorage.getItem("gameState"));
}

function setSleepState() {
  sleepHolder.style.display = "flex";
  playerStats.isSleeping = true;
  playerStats.currentState = "sleep";
}

function loadFeedContent() {
  // gameAreaModal.innerHTML = "";
  for (let index = 0; index < 5; index++) {
    let food1 = document.createElement("button");
    food1.id = generateRandomID(4);
    food1.addEventListener("click", () => {
      console.log("ate", food1.id);
      gameAreaModal.removeChild(food1);
      setTimeout(() => {
        gameAreaModal.style.display = "none";
        gameAreaModal.classList.add("closeInteractiveArea");
      }, 1000);
    });
    food1.classList.add("foodGameItem");
    food1.style.top = `${Math.floor(Math.random() * (360 - 0 + 1)) + 0}px`;
    food1.style.right = `${Math.floor(Math.random() * (360 - 0 + 1)) + 0}px`;
    gameAreaModal.appendChild(food1);
  }
}

function loadGameContent() {}

function fedPet() {
  let lastFed = Date.now();
  playerStats.lastAte = lastFed;
}

function petSlept() {
  let lastSlept = Date.now();
  sleepStartTimer = lastSlept;
  playerStats.lastSlept = lastSlept;
}

statsChecker = setInterval(checkStatsAndUpdate, 60000);

// playerStats.sleep = 0;
// saveGameStats();

let prevSleepRating = 0;
let lastKnowSleepValue = 0;
let lastSleepCounter = 0;
function checkStatsAndUpdate() {
  if (!playerStats.isSleeping && playerStats.sleep < 5) {
    let awakeTime = parseInt((Date.now() - playerStats.lastSlept) / 1000);
    console.log("AT: ", awakeTime);
    let sleepRating = parseInt(awakeTime / 60);
    console.log("SR: ", sleepRating);
    if (sleepRating <= 5) {
      playerStats.sleep = sleepRating;
      if (sleepRating != prevSleepRating) {
        prevSleepRating = sleepRating;
        saveGameStats();
        updateStatView(sleepStatsHolder, sleepStatTemplate, playerStats.sleep);
      }
    }
  }

  // if (lastKnowSleepValue == playerStats.sleep) {
  // } else {
  //   lastSleepCounter += 1;
  //   if (lastSleepCounter > 3) {
  //     playerStats.happiness -= 1;
  //   }
  //   lastKnowSleepValue = playerStats.sleep;
  // }
}
