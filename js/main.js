function handleKeyboardEvent(event) {
  var info = document.getElementById("info");
  var xDelta = 0;
  var yDelta = 0;
  var isCloser = 0;

  info.value = " What would you like to do, " + playerName + "? > ";

  switch (event.key) {
    case "w":
      outputText = "You moved west. "
      xDelta = -1;
      break;
    case "n":
      outputText = "You moved north. "
      yDelta = -1;
      break;
    case "e":
      outputText = "You moved east. "
      xDelta = 1;
      break;
    case "s":
      outputText = "You moved south. "
      yDelta = 1;
      break;
    case "q":
      endGame();
    default:
      outputText = "Sorry, I didn't quite understand that. "
  }


  /* Check to see if the next move will take the Player outside of the game Area */

  if (((xIndex + xDelta) <= maxXIndex && (xIndex + xDelta) >= 0) && ((yIndex + yDelta) <= maxYIndex) && (yIndex + yDelta) >= 0) {

    xRow = xIndex + xDelta;
    yCol = yIndex + yDelta;
    obstacleIndex = findArrayIndex(xRow, yCol);
    obstacleType = obstacles[obstacleIndex];

    switch (obstacleType) {
      case 0: // clear path
        /* updateBoard(xPos, yPos, xIndex, yIndex,xDelta,yDelta);*/
        clearObject(xPos, yPos);
        xIndex = xIndex + xDelta;
        yIndex = yIndex + yDelta;

        xPos = ((xIndex * tileSize) + (tileOffset * xIndex));
        yPos = ((yIndex * tileSize) + (tileOffset * yIndex));

        drawPath(xPos, yPos, obstacleType);
        drawObject(xPos, yPos);
        break;
      case 1: // trap
        modalImage.setAttribute("src", "images/skull-crossbones2.svg");
        modalImage.setAttribute("alt", "skullAndCrossbones");
        modalHeading = document.getElementById("modalHeading");
        modalHeading.innerHTML = "It's a trap!";
        modalText = document.getElementById("modalText");
        modalText.innerHTML = "Something unexpected has befallen you...";
        showModal();
        break;
      case 2: // treasure
        modalImage.setAttribute("src", "images/treasure-chest-01-25px.svg");
        modalImage.setAttribute("alt", "treasureChest");
        modalHeading = document.getElementById("modalHeading");
        modalHeading.innerHTML = "Your Quest is Complete!";
        modalText = document.getElementById("modalText");
        modalText.innerHTML = "Congratulations! You found the treasure, " + playerName + "!";
        showModal();
        outputText = "Huzzah!";
        break;
      case 3: // blocked path
        /* show blocked tile but don't let them move into that area */
        xRow = (((xIndex + xDelta) * tileSize) + (tileOffset * (xIndex + xDelta)));
        yCol = (((yIndex + yDelta) * tileSize) + (tileOffset * (yIndex + yDelta)));
        drawPath(xRow, yCol, obstacleType);
        outputText = "OOF! Sorry, there seems to be something blocking your path in that direction.";
        break;
    }

  } else {
    outputText = "OOF! Sorry, you can't go any further in that direction."
  }

  updateActionWindow(outputText);
  checkGettingClose(outputText);

}

function checkGettingClose(outputText) {
  var sensitivity = 1; // define how large of an areas to search
  var xIndexLower = xIndex - sensitivity;
  var xIndexUpper = xIndex + sensitivity;
  var yIndexLower = yIndex - sensitivity;
  var yIndexUpper = yIndex + sensitivity;

  var obstacleFound = 0;
  var trapFound = 0;

  if (xIndexLower < 1) {
    xIndexLower = 0;
  } else if (xIndexUpper > maxXIndex) {
    xIndexUpper = maxXIndex;
  }

  if (yIndexLower < 1) {
    yIndexLower = 0;
  } else if (yIndexUpper > maxYIndex) {
    yIndexUpper = maxYIndex;
  }

  /*Loop through the surrounding cells of the game board 
  to see whats there*/

  for (i = xIndexLower; i <= xIndexUpper; i++) {
    for (j = yIndexLower; j <= yIndexUpper; j++) {
      obstacleIndex = findArrayIndex(i, j);
      obstacleType = obstacles[obstacleIndex];
      if (obstacleType == 2) {
        obstacleFound = 1;
      } else if (obstacleType == 1) {
        trapFound = 1
      }
    }
  }

  /*Depending on what was found in the search area, respond
  with appropriate messages for the player*/

  if (obstacleFound == 1 && trapFound == 0) {
    outputText = "You sense TREASURE is near! "
    updateActionWindow(outputText);
  } else if (obstacleFound == 1 && trapFound == 1) {
    outputText = "Unsure of which way to turn, you sense both TREASURE and DANGER!"
    updateActionWindow(outputText);
  } else if (obstacleFound == 0 && trapFound == 1) {
    outputText = "You sense DANGER is near! "
    updateActionWindow(outputText);
  }

  trapFound = 0;
  obstacleFound = 0;

}

function clearBoard() {
  layer1 = document.getElementById("layer1");
  ctx1 = layer1.getContext("2d");
  layer2 = document.getElementById("layer2");
  ctx2 = layer2.getContext("2d");
  layer3 = document.getElementById("layer3");
  ctx3 = layer3.getContext("2d");

  ctx1.clearRect(0, 0, 500, 500);
  ctx2.clearRect(0, 0, 500, 500);
  ctx3.clearRect(0, 0, 500, 500);
}

function updateActionWindow(outputText) {
  var actionLast = document.getElementById("dispActionLast");
  var actionCurrent = document.getElementById("dispActionCurrent");

  /*Keeping a short, folling list of responses so Player has a better
  sense of what's going on*/

  outputTextList[0] = outputTextList[1];
  outputTextList[1] = outputText;

  actionCurrent.innerHTML = outputTextList[1];
  actionLast.innerHTML = outputTextList[0];
}

function init(xPos, yPos) {
  /*Initialize the layers and respective contexts for the Canvases*/

  layer1 = document.getElementById("layer1");
  ctx1 = layer1.getContext("2d");
  layer2 = document.getElementById("layer2");
  ctx2 = layer2.getContext("2d");
  layer3 = document.getElementById("layer3");
  ctx3 = layer3.getContext("2d");
  drawAll(xPos, yPos);
}


function drawPath(xPos, yPos, obstacleType) {
  layer2 = document.getElementById("layer2");
  ctx2 = layer2.getContext("2d");

  switch (obstacleType) {
    case 0: // clear path
      tileObstacle[0].src = "images/path-clear-PH-35px.svg";
      tileObstacle[0].onload = function () {
        ctx2.drawImage(tileObstacle[0], xPos, yPos);
      };
      break;
    case 2: // treasure
      tileObstacle[0].src = "images/path-clear-PH-35px.svg";
      tileObstacle[0].onload = function () {
        ctx2.drawImage(tileObstacle[0], xPos, yPos);
      };
      break;
    case 3: // obstacle
      /*Maybe add a bit of code here where
      the image is randomly chosen from a list of 
      different images*/
      tileObstacle[3].src = "images/path-blocked-PH-35px.svg";
      tileObstacle[3].onload = function () {
        ctx2.drawImage(tileObstacle[3], xPos, yPos);
      };
      break;
  }

}

function updateBoard(xPos, yPos, xIndex, yIndex, xDelta, yDelta) {
  clearObject(xPos, yPos);
  xIndex = xIndex + xDelta;
  yIndex = yIndex + yDelta;

  xPos = ((xIndex * tileSize) + (tileOffset * xIndex));
  yPos = ((yIndex * tileSize) + (tileOffset * yIndex));

  drawPath(xPos, yPos);
  drawObject(xPos, yPos);
}

function drawObject(xPos, yPos) {
  layer3 = document.getElementById("layer3");
  ctx3 = layer3.getContext("2d");
  spritePlayer.src = "images/walking-25px.svg";
  spriteTreasure.src = "images/treasure-chest-01-25px.svg";
  spritePlayer.onload = function () {
    ctx3.drawImage(spritePlayer, xPos + 4, yPos + 4, 25, 25);
  }

}

function clearObject(xPos, yPos) {
  layer3 = document.getElementById("layer3");
  ctx3 = layer3.getContext("2d");
  spritePlayer.src = "images/walking-25px.svg";
  spriteTreasure.src = "images/treasure-chest-01-25px.svg"
  ctx3.clearRect(xPos, yPos, 35, 35);
}

function dispSplashImage() {
  layer3 = document.getElementById("layer3");
  ctx3 = layer3.getContext("2d");
  splashImage.src = "images/NothinVenture.svg";
  splashImage.onload = function () {
    ctx3.drawImage(splashImage, 10, 10, 400, 400);
  }
}

function clearSplashImage() {
  layer3 = document.getElementById("layer3");
  ctx3 = layer3.getContext("2d");
  splashImage.src = "images/NothinVenture.svg";
  splashImage.onload = function () {
    ctx3.clearRect(10, 10, 400, 400);
  }
}



function getInfo() {
  clearSplashImage();
  document.getElementById("startButton").style.visibility = "hidden";
  playerName = prompt("How would you like to be known in the annals of history, brave Adventurer?")
  document.getElementById("actionArea").style.visibility = "visible";
  var info = document.getElementById("info");
  if (playerName.length == 0) {
    playerName = "Adventurer";
  }
  info.value = " What would you like to do, " + playerName + "? > ";
}


function findArrayIndex(xRow, yCol) {
  arrayIndex = (xRow * (maxXIndex - 1)) + yCol + 1;
  return arrayIndex;
}



function ventureGame() {

  getInfo();

  xPos = ((xIndex * tileSize) + (tileOffset * xIndex));
  yPos = ((yIndex * tileSize) + (tileOffset * yIndex));

  /* draw start position*/
  drawPath(xPos, yPos, 0);
  drawObject(xPos, yPos);

  document.addEventListener("keydown", handleKeyboardEvent);
}

function createObstacles() {
  var xChosen = [];
  var yChosen = [];

  var testVal;
  var xVal;
  var yVal;

  var xOK;
  var yOK;

  for (i = 0; i < numObstacles; i++) {
    /* create random Obstacle Object
     Add Obstacle Object to flattened board Array*/
    /* Use indexOf to find if a position has been previously chosen*/

    testVal = -2;

    while (testVal == -2) {
      xVal = Math.floor(Math.random() * maxXIndex) + 1;
      xOK = xChosen.indexOf(xVal);
      if (xOK > -1) {
        xOK = 0;
      }
      yVal = Math.floor(Math.random() * maxYIndex) + 1;
      yOK = xChosen.indexOf(yVal);
      if (yOK > -1) {
        yOK = 0;
      }
      if (xOK + yOK < 0) {
        if (xOK == -1) {
          xChosen.push(xVal); // add new value to xArray
        }
        if (yOK == -1) {
          yChosen.push(yVal); // add new value to yArray
        }

        testVal = 0; // valid location found, so end loop
      }
    }
    obstacleIndex = findArrayIndex(xVal, yVal);
    obstacles[obstacleIndex] = 3;
  }

}

function createTraps() {
  var xChosen = [];
  var yChosen = [];

  var testVal;
  var xVal;
  var yVal;

  var xOK;
  var yOK;

  for (i = 0; i < numTraps; i++) {
    /* create random Trap Object
     Add Obstacle Object to flattened board Array*/
    /* Use indexOf to find if a position has been previously chosen*/

    testVal = -2;

    while (testVal == -2) {
      xVal = Math.floor(Math.random() * maxXIndex) + 1;
      xOK = xChosen.indexOf(xVal);
      if (xOK > -1) {
        xOK = 0;
      }
      yVal = Math.floor(Math.random() * maxYIndex) + 1;
      yOK = xChosen.indexOf(yVal);
      if (yOK > -1) {
        yOK = 0;
      }
      if (xOK + yOK < 0) {
        if (xOK == -1) {
          xChosen.push(xVal); // add new value to xArray
        }
        if (yOK == -1) {
          yChosen.push(yVal); // add new value to yArray
        }

        testVal = 0; // valid location found, so end loop
      }
    }
    obstacleIndex = findArrayIndex(xVal, yVal);
    obstacles[obstacleIndex] = 1;
  }

}


function createTreasure() {
  var xChosen = [];
  var yChosen = [];

  /* var obj = {};*/

  var testVal;
  var xVal;
  var yVal;

  var xOK;
  var yOK;

  for (i = 0; i < numTreasures; i++) {
    /* create random Treasure Object
     Add Obstacle Object to flattened board Array*/
    /* Use indexOf to find if a position has been previously chosen*/

    testVal = -2;

    while (testVal == -2) {
      xVal = Math.floor(Math.random() * maxXIndex) + 1;
      xOK = xChosen.indexOf(xVal);
      if (xOK > -1) {
        xOK = 0;
      }
      yVal = Math.floor(Math.random() * maxYIndex) + 1;
      yOK = xChosen.indexOf(yVal);
      if (yOK > -1) {
        yOK = 0;
      }
      if (xOK + yOK < 0) {
        if (xOK == -1) {
          xChosen.push(xVal); // add new value to xArray
        }
        if (yOK == -1) {
          yChosen.push(yVal); // add new value to yArray
        }

        testVal = 0; // valid location found, so end loop
      }
    }
    obstacleIndex = findArrayIndex(xVal, yVal);
    obstacles[obstacleIndex] = 2;
  }

}

function startGame() {
  numTreasures = 1;
  maxObstacles = 4;
  numTraps = 2;
  xStart = 0;
  yStart = 0;

  xStart = Math.floor(Math.random() * 2) * maxXIndex;
  yStart = Math.floor(Math.random() * 2) * maxYIndex;


  xPos = 0;
  yPos = 0;

  xPos = ((xStart * tileSize) + (tileOffset * xStart));
  yPos = ((yStart * tileSize) + (tileOffset * yStart));

  xIndex = xStart;
  yIndex = yStart;


  outputText = "";
  outputTextList = ["", ""];
  updateActionWindow(outputText);

  modalImage = document.querySelector("img#modalImage");

  document.getElementById("actionArea").style.visibility = "hidden";

  numObstacles = Math.floor(Math.random() * maxObstacles) + 1;


  /*Start off the background audio clip playing softly*/

  audioClip = document.getElementById("myAudio");
  audioClip.volume = 0.3;

  createObstacles();
  createTraps();
  createTreasure();

  dispSplashImage();

}


var layer1;
var layer2;
var layer3;

var ctx1;
var ctx2;
var ctx3;

var tileClear = new Image();
var tileObstacle = [];
tileObstacle[0] = new Image();
tileObstacle[1] = new Image();
tileObstacle[2] = new Image();
tileObstacle[3] = new Image();

var spritePlayer = new Image();
var spriteTreasure = new Image();
var splashImage = new Image();


var tileSize = 35; // size of tile in pixels
var tileOffset = 2 // spacing between tiles


var maxXIndex = 9;
var maxYIndex = 9;

var playerName;

var outputText;

var outputTextList = [];

var xRow;
var yCol;
var arrayIndex;
var obstacleIndex;
var obstacleType;


var numObstacles;

var obstacles = [];
for (i = 0; i < ((maxXIndex + 1) * (maxYIndex + 1)); i++) {
  obstacles.push(0);
}

var numTreasures;
var maxObstacles;
var numTraps;
var xStart;
var yStart;

var xPos;
var yPos;
var xIndex;
var yIndex;

var modalImage;
var modalText;
var modalHeading;
var audioClip;

startGame();