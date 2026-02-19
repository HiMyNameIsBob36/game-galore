const wordList = [
    "apple","tiger","rabbit","table","elephant",
    "night","tree","engine","eagle","earth",
    "hat","top","pen","notebook","kangaroo",
    "orange","grape","egg","guitar","robot"
];

let currentWord = "";
let usedWords = [];
let gameStarted = false;
let isPaused = false;
let popupOpen = false;

let baseTime = 10;
let currentRoundTime = baseTime;
let startTimestamp = 0;
let animationFrame;

const currentWordEl = document.getElementById("currentWord");
const requiredLetterEl = document.getElementById("requiredLetter");
const inputEl = document.getElementById("wordInput");
const timeEl = document.getElementById("time");
const historyEl = document.getElementById("history");
const toggleBtn = document.getElementById("toggleBtn");

function startGame() {
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("gameArea").classList.remove("hidden");
    gameStarted = true;
    newRound(true);
}

function newRound(first = false) {
    if (first) {
        currentRoundTime = baseTime;
    } else {
        currentRoundTime = Math.max(3, currentRoundTime - 0.4);
    }

    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    usedWords = [currentWord];
    updateDisplay();
    startTimer();
}

function updateDisplay() {
    currentWordEl.textContent = currentWord;
    requiredLetterEl.textContent = currentWord.slice(-1).toUpperCase();
    historyEl.innerHTML = usedWords.join(" ➜ ");
}

function startTimer() {
    cancelAnimationFrame(animationFrame);
    startTimestamp = performance.now();
    updateTimer();
}

function updateTimer() {
    if (isPaused || popupOpen || !gameStarted) {
        animationFrame = requestAnimationFrame(updateTimer);
        return;
    }

    const elapsed = (performance.now() - startTimestamp) / 1000;
    const remaining = currentRoundTime - elapsed;

    if (remaining <= 0) {
        timeEl.textContent = "0.00";
        showPopup("⛔ Time’s up! Game Over.");
        return;
    }

    timeEl.textContent = remaining.toFixed(2);

    animationFrame = requestAnimationFrame(updateTimer);
}

toggleBtn.onclick = () => {
    if (!gameStarted) return;

    isPaused = !isPaused;
    toggleBtn.textContent = isPaused ? "Play" : "Pause";

    if (!isPaused) {
        startTimestamp = performance.now() - 
            ((currentRoundTime - parseFloat(timeEl.textContent)) * 1000);
    }
};

function restartGame() {
    cancelAnimationFrame(animationFrame);
    isPaused = false;
    toggleBtn.textContent = "Pause";
    currentRoundTime = baseTime;
    newRound(true);
}

inputEl.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !isPaused && !popupOpen && gameStarted) {
        const newWord = inputEl.value.trim().toLowerCase();
        if (!newWord) return;

        const requiredLetter = currentWord.slice(-1).toLowerCase();

        if (newWord[0] !== requiredLetter) {
            showPopup("❌ Word must start with " + requiredLetter.toUpperCase());
            return;
        }

        if (usedWords.includes(newWord)) {
            showPopup("⚠️ Word already used!");
            return;
        }

        usedWords.push(newWord);
        currentWord = newWord;
        inputEl.value = "";
        updateDisplay();

        startTimestamp = performance.now();
        currentRoundTime = Math.max(3, currentRoundTime - 0.4);
    }
});

function showPopup(message) {
    popupOpen = true;
    document.getElementById("popupMessage").innerHTML = message;
    document.getElementById("customPopup").classList.remove("hidden");
}

function closePopup() {
    popupOpen = false;
    document.getElementById("customPopup").classList.add("hidden");
}
