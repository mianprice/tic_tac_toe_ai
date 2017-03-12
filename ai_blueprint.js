function SampleRobot(piece) {
  this.piece = piece;
}

// input - board (array of 9 elements), piece
// return - index(number) location it wants to place piece
// assumes has open space
SampleRobot.prototype.makeMove = function(board) {
  var ind = getRandomInt(0,9);
  var unchanged = true;
  var loop_count = 0;
  while (unchanged) {
    if (board[ind].length === 0) {
      return ind;
    } else {
      ind = getRandomInt(0,9);
    }
    loop_count++;
    if (loop_count === 500) {
      unchanged = false;
    }
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function outputBoard() {
  var out = JSON.parse(JSON.stringify(board));
  while (out.length > 0) {
    console.log(out.splice(0,3));
  }
  console.log("\n");
}

function drawCheck() {
  var str = board.reduce(function(a,b) {
    return a + b;
  },"");
  return str.length < 9;
}

var cpu1 = new SampleRobot("X");
var cpu2 = new SampleRobot("O");

var board = ["","","","","","","","",""];

var firstPlayer = true;
while (drawCheck()) {
  if (firstPlayer) {
    board[cpu1.makeMove(board)] = cpu1.piece;
  } else {
    board[cpu2.makeMove(board)] = cpu2.piece;
  }
  firstPlayer = !firstPlayer;
  outputBoard();
}
outputBoard();
