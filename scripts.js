const timerDisplay = document.getElementById('timer-display');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const skipButton = document.getElementById('skip');
const titleDisplay = document.getElementById('title-display');

const WORK_TIME = 30 * 60;
const BREAK_TIME = 30 * 60;

let timer = WORK_TIME;
let isWork = true;
let isPaused = true;
let worker = null;
let accumulatedPauseTime = 0;
let accumulatedFocusTime = 0;

function updateDisplay() {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  document.title = `seradoro - ${minutes}:${seconds < 10 ? '0' : ''}${seconds} left`;
}

function startTimer() {
    console.log("startTimer called");
    if (isPaused) {
        isPaused = false;
        pauseButton.textContent = 'Pause';
        lastTick = performance.now();
        interval = requestAnimationFrame(tick);
    } else {
        isPaused = true;
        pauseButton.textContent = 'Resume';
        accumulatedPauseTime += performance.now() - lastTick;
        cancelAnimationFrame(interval);
    }
}

function tick() {
  timer--;
  if (timer < 0.1) {
    isWork = !isWork;
    timer = isWork ? WORK_TIME : BREAK_TIME;
    updateTitle();
    if (isWork) {
      document.getElementById('work-audio').play();
    } else {
      document.getElementById('break-audio').play();
    }
  }
  updateDisplay();
}

function resetTimer() {
  isPaused = true;
  pauseButton.textContent = 'Start';
  worker.postMessage({ type: 'reset' });
  accumulatedPauseTime = 0;
  accumulatedFocusTime = 0;
  timer = WORK_TIME;
  updateTitle();
  updateDisplay();
}

function skipTimer() {
  isWork = !isWork;
  timer = isWork ? WORK_TIME : BREAK_TIME;
  updateTitle();
  updateDisplay();
}

function updateTitle() {
  if (isWork) {
    titleDisplay.textContent = "Get to work you lazy bum!";
  } else {
    titleDisplay.textContent = "Alright, you can rest a bit...";
  }
}

pauseButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
skipButton.addEventListener('click', skipTimer);

updateTitle(); // set initial title

if (window.Worker) {
  worker = new Worker('worker.js');
  worker.onmessage = function(e) {
    switch(e.data.type) {
      case 'tick':
        if (!isPaused) {
          tick();
        }
        break;
      case 'reset':
        isWork = true;
        timer = WORK_TIME;
        updateTitle();
        updateDisplay();
        break;
    }
  };
} else {
  console.log('Web workers are not supported in this environment.');
}

       
