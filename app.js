const highScoreDisplay = document.querySelector(".highScore");
const resetHighScore = document.querySelector(".resetHighScoreButton");
const deadCenter = document.querySelector(".dead-center");
const timerDisplay = document.querySelector(".timer");
const gameOverDisplay = document.querySelector(".gameOverDisplay");
const boxCount = document.querySelector(".box-count");
const currentScoreDisplay = document.querySelector(".current-score");
const nextBoxButton = document.querySelector(".next-box");
const playButton = document.querySelector(".play");
const playAgain = document.querySelector(".play-again");
const container = document.querySelector(".container");
const gamebox = document.querySelector(".game-box");
const rules = document.querySelector(".rules-container");
const result = document.querySelector(".result");
const crosshairs = document.querySelector(".user-crosshairs");
let rulesPara = document.querySelector(".rules-para");
const body = document.querySelector("body");

let containerInfo = container.getBoundingClientRect();
let gameMaxHeight = Math.round(container.offsetHeight);
let gameMaxWidth = Math.round(container.offsetWidth);
let boxNumber = 0;
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

// HELP
// these 2 might do the same thing
// let gameState = 0;
// let wasClicked = 0;

// HIGHSCORE localStorage and reset
highScore = localStorage.getItem("highScore");
highScoreDisplay.innerHTML = `HighScore: ${highScore}`;
resetHighScore.addEventListener("click", resetLocal);
function resetLocal() {
  localStorage.clear();
  highScore = null;
  highScoreDisplay.innerHTML = `HighScore: N/A`;
  result.style.display = "none";
}

// setting highscore display on load
if (highScore == null || highScore == "undefined") {
  highScoreDisplay.innerHTML = "HighScore: N/A";
}

// recalculate height and width of window
window.addEventListener("resize", function () {
  containerInfo = container.getBoundingClientRect();
  gameMaxWidth = Math.round(containerInfo.width);
  gameMaxHeight = Math.round(containerInfo.height);
  return gameMaxHeight, gameMaxWidth;
});

// setting different rule display for mobile devices
if (gameMaxWidth < 500) {
  rulesPara.innerHTML =
    '1. Click the "Play" button and a box will appear.<br><br><br>2. Click as close to the middle of the box as you can.<br><br><br>3. You will get a score that indicates how many pixels away from the middle you clicked.<br><br><br>4. Lowest score wins.<br><br><br>That\'s it!';
}

// set spacebar to trigger playgame function (same as clicking 'play/play again')
window.addEventListener("keydown", function (e) {
  if (e.key == " " || e.code == "Space") {
    playGame();
  }
});

// event listeners on play and play again, next box  buttons
playButton.addEventListener("click", playGame);
playAgain.addEventListener("click", playGame);
nextBoxButton.addEventListener("click", makebox);

// take height and width of window and use those numbers to randomly make size of gamebox
function makebox(maxHeight, maxWidth) {
  // hide results
  rules.style.display = "none";
  // rulesPara.style.display = "none";

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

  // triggered when user clicks gamebox
  function middleClick(event) {
    if (timer < 10) {
      // find middle of box
      xMiddle = Math.round(gamebox.getBoundingClientRect().width / 2);
      yMiddle = Math.round(gamebox.getBoundingClientRect().height / 2);
      // increment box number
      boxNumber++;
      boxCount.innerHTML = `Box: ${boxNumber}`;

      // grab x and y of user click
      let clickX = event.offsetX;
      let clickY = event.offsetY;

      // find how many pixels away from the middle of the gamebox the user's click was
      // calculate user score
      xCloseToMiddle = Math.abs(clickX - xMiddle);
      yCloseToMiddle = Math.abs(clickY - yMiddle);
      totalMiss = yCloseToMiddle + xCloseToMiddle;
      currentScore = currentScore + totalMiss;
      currentScoreDisplay.innerHTML = `Score: ${currentScore}`;
      // WINNER-SWITCH (to test win screen)
      // totalMiss = 0;

      // display crosshair where user clicked (crosshair image is 20px by 20px)
      let crossY = clickY - 10;
      let crossX = clickX - 10;

      crosshairs.style.display = "unset";
      crosshairs.style.top = crossY + "px";
      crosshairs.style.left = crossX + "px";
      deadCenter.style.display = "unset";
      deadCenter.style.top = yMiddle - 2 + "px";
      deadCenter.style.left = xMiddle - 2 + "px";
      // change play button to play again button
      // display results
      // show confetti if user score is 0px
      playButton.style.display = "none";
      result.style.display = "unset";
      if (totalMiss === 0) {
        result.innerHTML = "YOU WIN!!! 🎯";
        confetti();
      } else {
        result.innerHTML = `X Axis: ${xCloseToMiddle} pixels away<br>Y Axis: ${yCloseToMiddle} pixels away<br>TOTAL: ${totalMiss}`;
      }

      if (boxNumber < 5) {
        nextBoxButton.style.display = "unset";
      }
      if (boxNumber === 5) {
        endGame();
      }
    }

    // remove lisener on gamebox after first click (have to start again to hide display box and get lisener back after new box is made)
    gamebox.removeEventListener("click", middleClick);
  }
  wasClicked = 2;
  // event listener triggered when user clicks on the gamebox
  gamebox.addEventListener("click", middleClick);
}

// end game function
function endGame() {
  clearInterval(counter);
  gameState = 0;
  nextBoxButton.style.display = "none";
  playAgain.style.display = "unset";
  if (timer === 10) {
    // LOOK
    // middleClick is not a global variable (it's nested in makeBox)
    // i think it needs to be global for this function to be able to remove it's event listener
    // gamebox.removeEventListener("click", middleClick);

    gameOverDisplay.style.display = "unset";
    gameOverDisplay.style.bottom = yMiddle + "px";
    gameOverDisplay.innerHTML = "Time's Up!</br>" + "Try Again";
  } else if (boxNumber === 5) {
    highScoreSetter();
    gameOverDisplay.style.display = "unset";
    gameOverDisplay.style.bottom = yMiddle + "px";
    gameOverDisplay.innerHTML =
      "Game Over!</br>" + "Your Score was</br>" + `${currentScore}`;
  }
}

// function to get highscore
function highScoreSetter() {
  if (highScore === null) {
    // set highscore to current score
    highScore = currentScore;
    localStorage.setItem("highScore", currentScore);
    highScoreDisplay.innerHTML = `HighScore: ${currentScore}`;
  } else if (highScore > currentScore) {
    // set highscore to current score
    highScore = currentScore;
    localStorage.setItem("highScore", currentScore);
    highScoreDisplay.innerHTML = `HighScore: ${currentScore}`;
  } else {
    // highscore doesn't change
  }
}

// timer function
function runTimer() {
  counter = setInterval(countup, 1000);

  function countup() {
    timer++;
    if (timer > 9) {
      timerDisplay.innerHTML = `00:${timer}`;
      gameState = 2;
      endGame();
    } else {
      timerDisplay.innerHTML = `00:0${timer}`;
    }
  }
}

// LOOK
// main game button
function playGame() {
  if (wasClicked === 0 || wasClicked === 2) {
    wasClicked = 1;
    gameOverDisplay.style.display = "none";
    // runs when game starts
    if (gameState === 0) {
      // restart timer
      timer = 0;
      if (timer < 10) {
        timerDisplay.innerHTML = `00:0${timer}`;
      } else if (timer >= 10) {
        timerDisplay.innerHTML = `00:${timer}`;
      }

      // start timer
      runTimer();
      //change button to 'next box'
      playButton.style.display = "none";
      playAgain.style.display = "none";
      nextBoxButton.style.display = "unset";
      // change score to 0
      currentScore = 0;
      currentScoreDisplay.innerHTML = `Score: ${currentScore}`;
      // reset boxCounter to 0
      boxNumber = 0;
      boxCount.innerHTML = `Box: ${boxNumber}`;
      //hide container and results
      container.style.border = "none";
      container.style.backgroundColor = "#fff2d3";
      result.style.display = "none";
      // makebox
      makebox(gameMaxHeight, gameMaxWidth);
      gameState++;

      // runs when boxCount is > 0 and <= 10
    } else if (gameState === 1) {
      if (boxCount === 5) {
        endGame();
      } else if (timer === 10) {
        // nextBoxButton.removeEventListener('click', middleClick);
      }
      // makebox
      makebox(gameMaxHeight, gameMaxWidth);
      result.style.display = "none";
    }
  } else if (wasClicked === 1) {
    return;
  }
}

// MAYBE-SOMEDAY
// settings and let user choose if auto reload or takes time into account...
// have levels where box/click area changes, or timer gets shorter and shorter
// can select difficulty
