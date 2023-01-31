/* 
Game states are init, waiting, clicked, end
*/

/** INIT  *******************************************/

// grab DOM elements
const body = document.querySelector("body");
const container = document.querySelector(".container");
const gamebox = document.querySelector(".game-box");
const highScoreDisplay = document.querySelector(".highScore");
const timerDisplay = document.querySelector(".timer");
const boxMadeDisplay = document.querySelector(".box-count");
const currentScoreDisplay = document.querySelector(".current-score");
const rulesDisplay = document.querySelector(".rules-container");
const resultDisplay = document.querySelector(".result");
const gameOverDisplay = document.querySelector(".gameOverDisplay");
const crosshairs = document.querySelector(".user-crosshairs");
const deadCenter = document.querySelector(".dead-center");
let rulesPara = document.querySelector(".rules-para");
// buttons
const nextBoxButton = document.querySelector(".next-box");
const playButton = document.querySelector(".play");
const playAgain = document.querySelector(".play-again");
const resetHighScoreButton = document.querySelector(".resetHighScoreButton");

// declare variables
let containerInfo = container.getBoundingClientRect();
let gameMaxHeight = Math.round(container.offsetHeight);
let gameMaxWidth = Math.round(container.offsetWidth);
let boxesMade = 0;
let currentScore = 0;
let timer = 0;
let xMiddle,
  yMiddle,
  gameboxHeight,
  gameboxWidth,
  xCloseToMiddle,
  yCloseToMiddle,
  totalMiss,
  clickX,
  clickY,
  xAxis,
  yAxis,
  highScore,
  counter;
let gameState = "init";

/** SET EVENTLISTENERS  ********************************/

// clickevents/spacebar initializer
resetHighScoreButton.addEventListener("click", resetLocalStorage);
playButton.addEventListener("click", playGame);
playAgain.addEventListener("click", playGame);
nextBoxButton.addEventListener("click", playGame);
// set spacebar to trigger playgame function (same as clicking 'play/play again')
window.addEventListener("keydown", function (e) {
  if (e.key == " " || e.code == "Space") {
    playGame();
  }
});

// window resize listener
// recalculate height and width of window
window.addEventListener("resize", function () {
  containerInfo = container.getBoundingClientRect();
  gameMaxWidth = Math.round(containerInfo.width);
  gameMaxHeight = Math.round(containerInfo.height);
  return gameMaxHeight, gameMaxWidth;
});

/** RANDOM/INITIAL RESETS  *********************************/

// grab localStorage on init
highScore = localStorage.getItem("highScore");
if (highScore == null || highScore == "undefined") {
  highScoreDisplay.innerHTML = "HighScore: N/A";
} else {
  highScoreDisplay.innerHTML = `HighScore: ${highScore}`;
}

// setting different rule display for mobile devices
if (gameMaxWidth < 500) {
  rulesPara.innerHTML =
    "You have 10 seconds to click as close to the middle of 5 boxes as you can...<br/><br/>Press PLAY to start<br/><br/>Good Luck!";
}

/** FUNCTIONS  *******************************************/

// playGame()
function playGame() {
  // if gameState === init or end, reset things and start a game
  if (gameState === "init" || gameState === "end") {
    gameState = "waiting";
    makeBox(gameMaxHeight, gameMaxWidth);
    // hide rules, container, results display, game over display
    rulesDisplay.style.display = "none";
    container.style.border = "none";
    container.style.backgroundColor = "#fff2d3";
    resultDisplay.style.display = "none";
    gameOverDisplay.style.display = "none";
    // reset timer, currentScore, boxesMade
    timer = 0;
    currentScore = 0;
    boxesMade = 0;
    timerDisplay.innerHTML = `00:0${timer}`;
    currentScoreDisplay.innerHTML = `Score: ${currentScore}`;
    boxMadeDisplay.innerHTML = `Box: ${boxesMade}`;
    // button to 'next box'
    nextBoxButton.style.display = "unset";
    // start timer
    runTimer();
    // change buttons
    playButton.style.display = "none";
    playAgain.style.display = "none";
    nextBoxButton.style.display = "unset";

    // if gamestate is clicked, middle of a game, make a box
  } else if (gameState === "clicked") {
    gameState = "waiting";
    makeBox(gameMaxHeight, gameMaxWidth);
    // hide result display, crosshairs, deadCenter
    resultDisplay.style.display = "none";
    crosshairs.style.display = "none";
    deadCenter.style.display = "none";
    // change buttons
    // nextBoxButton.style.display = "unset";
  }
}

// makeBox()
function makeBox(maxHeight, maxWidth) {
  // only works when gameState === 'waiting'
  if (gameState === "waiting") {
    // MAKE A BOX
    // random number between 0 and max height and width of container
    gameboxHeight = Math.round(Math.floor(Math.random() * maxHeight));
    gameboxWidth = Math.round(Math.floor(Math.random() * maxWidth));

    // set minimum size of gamebox and make sure it stays inside the container
    // x axis (width)
    if (maxWidth < 400 && gameboxWidth < 200) {
      gameboxWidth = 200;
    } else if (maxWidth > 400 && gameboxWidth < 300) {
      gameboxWidth = 300;
    }
    // same as above but with y axis (height)
    if (maxHeight < 700 && gameboxHeight < 300) {
      gameboxHeight = 300;
    } else if (maxHeight > 700 && gameboxHeight < 300) {
      gameboxHeight = 300;
    }

    // random number to select where along the x/y axis the box will display
    // within the conatiner, not overflowing
    // this point is the top left corner of the gamebox
    let x = Math.floor(Math.random() * (maxWidth - gameboxWidth));
    let y = Math.floor(Math.random() * (maxHeight - gameboxHeight));

    // display randomly generated gamebox
    deadCenter.style.display = "none";
    crosshairs.style.display = "none";
    gamebox.style.width = gameboxWidth + "px";
    gamebox.style.height = gameboxHeight + "px";
    gamebox.style.top = y + "px";
    gamebox.style.left = x + "px";
    gamebox.style.border = "solid 1px black";
    gamebox.style.borderRadius = "5px";

    //LOOK - calling middle click but it needs event passed in?
    // i think maybe it doesn't even need to be called, just a listener event on the gamebox which is done below
    // middleClick();
  }
  // adding event listener on gamebox after creating it
  gamebox.addEventListener("click", middleClick);
}

function middleClick(e) {
  // only works when gameState === waiting
  if (gameState === "waiting") {
    gameState = "clicked";
    boxesMade++;
    boxMadeDisplay.innerHTML = `Box: ${boxesMade}`;

    // find middle of box
    xMiddle = Math.round(gamebox.getBoundingClientRect().width / 2);
    yMiddle = Math.round(gamebox.getBoundingClientRect().height / 2);
    // grab x and y of user click
    let clickX = e.offsetX;
    let clickY = e.offsetY;
    // find how many pixels away from the middle of the gamebox the user's click was
    // calculate user score
    xCloseToMiddle = Math.abs(clickX - xMiddle);
    yCloseToMiddle = Math.abs(clickY - yMiddle);
    totalMiss = yCloseToMiddle + xCloseToMiddle;
    currentScore = currentScore + totalMiss;
    currentScoreDisplay.innerHTML = `Score: ${currentScore}`;
    // WINNER-SWITCH (to test win screen)
    // totalMiss = 0;

    // display crosshair, deadcenter where user clicked (crosshair image is 20px by 20px)
    let crossY = clickY - 10;
    let crossX = clickX - 10;
    crosshairs.style.display = "unset";
    crosshairs.style.top = crossY + "px";
    crosshairs.style.left = crossX + "px";
    deadCenter.style.display = "unset";
    deadCenter.style.top = yMiddle - 2 + "px";
    deadCenter.style.left = xMiddle - 2 + "px";
    // display results
    // show confetti if user score is 0px
    resultDisplay.style.display = "unset";
    if (totalMiss === 0) {
      resultDisplay.innerHTML = "YOU WIN!!! 🎯";
      confetti();
    } else {
      resultDisplay.innerHTML = `X Axis: ${xCloseToMiddle} pixels away<br>Y Axis: ${yCloseToMiddle} pixels away<br>TOTAL: ${totalMiss}`;
    }
    if (boxesMade === 5) {
      endGame();
    }
  }
}

function endGame() {
  gameState = "end";
  clearInterval(counter);
  // button display
  nextBoxButton.style.display = "none";
  playAgain.style.display = "unset";
  // if boxesMade === 5 -> highScoreSetter()
  if (boxesMade === 5) {
    highScoreSetter();
    gameOverDisplay.style.display = "unset";
    gameOverDisplay.style.bottom = yMiddle + "px";
    gameOverDisplay.innerHTML =
      "Game Over!</br>" + "Your Score was</br>" + `${currentScore}`;
  } else if (timer === 10) {
    // time's up display
    gameOverDisplay.style.display = "unset";
    gameOverDisplay.style.bottom = yMiddle + "px";
    gameOverDisplay.innerHTML = "Time's Up!</br>" + "Try Again";
  }
}

// TIMER
function runTimer() {
  counter = setInterval(countup, 1000);
  function countup() {
    timer++;
    if (timer === 10) {
      timerDisplay.innerHTML = `00:${timer}`;
      endGame();
    } else {
      timerDisplay.innerHTML = `00:0${timer}`;
    }
  }
}

function highScoreSetter() {
  // set highscore when boxesMade = 5
  if (highScore === null || highScore > currentScore) {
    highScore = currentScore;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.innerHTML = `HighScore: ${highScore}`;
  }
}

// resetHighScore()
function resetLocalStorage() {
  localStorage.clear();
  highScore = null;
  highScoreDisplay.innerHTML = `HighScore: N/A`;
}
