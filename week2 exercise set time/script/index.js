// creating a countdown timer that can be started, stopped, paused,
// resumed and allow users to enter their own countdwon timer.

let countdown = null;

let timeleft = 0; // time in seconds

let isPaused = false;

let originalDuration = 0; // to store the original duration for reset functionality

// DOM elements

const timerDisplay = document.querySelector('#countdown');

const startBtn = document.querySelector('#startButton');

const stopBtn = document.querySelector('#stopButton');

const resetBtn = document.querySelector('#resetButton');

const pauseBtn = document.querySelector('#pauseButton');

const resumeBtn = document.querySelector('#resumeButton');

//format seconds into HH:MM:SS

function formatTime(seconds) {

    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

}

//start the countdown

function startTimer(durationInSeconds) {

    if (countdown) clearInterval(countdown);

    timeleft = durationInSeconds;

    originalDuration = durationInSeconds; // store the original duration

    isPaused = false;

    timerDisplay.textContent = formatTime(timeleft);

    countdown = setInterval(() => {

        timeleft--;

        if (timeleft <= 0) {

            clearInterval(countdown);

            countdown = null;

            timerDisplay.textContent = "Time's up!";

            return;
        }

        timerDisplay.textContent = formatTime(timeleft);

    }, 1000);
}

// Parse flexible user input (examples: 1h30m, 48h, 90m, 3600, 2h45m30s)
function parseTimeInput(input) {
    input = input.toLowerCase().trim();

    // Plain number = seconds
    if (/^\d+$/.test(input)) {
        return parseInt(input, 10);
    }

    let totalSeconds = 0;

    const hMatch = input.match(/(\d+)h/);
    const mMatch = input.match(/(\d+)m/);
    const sMatch = input.match(/(\d+)s/);

    if (hMatch) totalSeconds += parseInt(hMatch[1]) * 3600;
    if (mMatch) totalSeconds += parseInt(mMatch[1]) * 60;
    if (sMatch) totalSeconds += parseInt(sMatch[1]);

    // If nothing matched but it's a number, treat as seconds
    if (totalSeconds === 0 && !isNaN(parseInt(input))) {
        totalSeconds = parseInt(input);
    }

    return totalSeconds;
}

// Start button
startBtn.addEventListener('click', () => {
    if (countdown && !isPaused) return; // already running

    const userInput = prompt(
        "Enter countdown time (e.g. 1h30m, 48h, 90m, 2h45m30s, or just seconds):",
        "1h30m"
    );

    if (!userInput) return;

    const totalSeconds = parseTimeInput(userInput);

    if (totalSeconds <= 0 || isNaN(totalSeconds)) {
        alert("Please enter a valid time! (examples: 2h, 90m, 3600, 1h30m45s)");
        return;
    }

    startTimer(totalSeconds);
});

// Pause
pauseBtn.addEventListener('click', () => {
    if (countdown) {
        clearInterval(countdown);
        countdownInterval = null;
        isPaused = true;
    }
});

// Resume from remaining time
resumeBtn.addEventListener('click', () => {
    if (isPaused && timeLeft > 0) {
        startTimer(timeLeft);
        isPaused = false;
    }
});

// Stop (just pause without saving state for resume)
stopBtn.addEventListener('click', () => {
    if (countdown) {
        clearInterval(countdown);
        countdownInterval = null;
    }
    isPaused = false;
});

// Reset
resetBtn.addEventListener('click', () => {
    if (countdown) clearInterval(countdown);
    countdown = null;
    timeLeft = 0;
    isPaused = false;
    timerDisplay.textContent = "00:00:00";
});