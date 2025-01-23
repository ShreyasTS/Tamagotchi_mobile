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

document.addEventListener("DOMContentLoaded", () => {
  playerStats = JSON.parse(window.localStorage.getItem("gameState"));
  if (playerStats == null) {
    playerStats = {
      petName: "mousie",
      petEmoji: "🐶",
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
  gameAreaModal.style.display = "flex";
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

function loadFeedContent() {}

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
}
