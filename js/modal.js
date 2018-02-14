// Get the modal
var modal = document.getElementById('modal');


function showModal() {
  modal.style.display = "block";
}


function closeModal() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
   /* modal.style.display = "none";*/
    endGame();
  }
}

function restartGame() {
  modal.style.display = "none";
  clearBoard();
  document.getElementById("startButton").style.visibility = "visible";

  obstacles = [];
  for (i = 0; i < ((maxXIndex + 1) * (maxYIndex + 1)); i++) {
    obstacles.push(0);
  }
  startGame();
}

function endGame() {
  closeModal();
  audioClip = document.getElementById("myAudio");
  audioClip.pause();
  document.getElementById("canvasArea").style.visibility = "hidden";
  document.getElementById("actionArea").style.visibility = "hidden";
  document.getElementById("appArea").style.visibility = "hidden";
}