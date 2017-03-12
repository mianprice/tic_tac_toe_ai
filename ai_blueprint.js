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

function winCheck(grid,player) {
  return combos.some(function(c) {
    return c.every(function(i) {
      return grid[i] === player;
    });
  });
}

var cpu1 = new SampleRobot("X");
var cpu2 = new SampleRobot("O");

var board = ["","","","","","","","",""];
var combos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

var firstPlayer = true;
var cpu;
while (drawCheck()) {
  if (firstPlayer) {
    cpu = cpu1;
  } else {
    cpu = cpu2;
  }
  board[cpu.makeMove(board)] = cpu.piece;
  if (winCheck(board,cpu.piece)) {
    outputBoard();
    console.log(cpu.piece + " WINS!");
    board[0] = "";
    break;
  }
  firstPlayer = !firstPlayer;
  outputBoard();
}
if (!drawCheck()) {
  console.log("It's a DRAW.");
}
