// creating a countdown timer that can be started, stopped, paused,
// resumed and allow users to enter their own countdwon timer.

let countdown = null;

let timeleft = 0; // time in seconds

let isPaused = false;

let startSeconds = 10; // default time in seconds

// DOM elements

const timerDisplay = document.querySelector('#countdown');

const startBtn = document.querySelector('#startButton');

const stopBtn = document.querySelector('#stopButton');

const resetBtn = document.querySelector('#resetButton');

const pauseBtn = document.querySelector('#pauseButton');

const resumeBtn = document.querySelector('#resumeButton');