function SampleRobot(piece) {
  this.piece = piece;
}

// input - board (array of 9 elements), piece
// return - index(number) location it wants to place piece
// assumes has open space (Open space is an empty string)
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

function UnbeatableRobot(piece) {
  this.piece = piece;
}

UnbeatableRobot.prototype.makeMove = function(board) {
  var ind = -1;
  var indices = [3,2,3,2,4,2,3,2,3];
  var toChange = [];
  var changed = false;
  for (var i = 0; i < combos.length; i++) {
    var set = [board[combos[i][0]],board[combos[i][1]],board[combos[i][2]]];
    var status = set.reduce(function(a,b) {
      if (b === this.piece) {
        if (changed) {
          toChange.push(combos[i][set.lastIndexOf(b)]);
        } else {
          toChange.push(combos[i][set.indexOf(b)]);
          changed = true;
        }
        return a + "0";
      } else if (b.length === 1) {
        return a + "1";
      } else {
        return a;
      }
    }.bind(this),"");
    changed = false;
    if (status.includes("1") && !status.includes("0")) {
      if (status.length === 2) {
        return combos[i][set.indexOf("")];
      }
    }
  }
  toChange.forEach(function(element) {
    indices[element] --;
  });
  if (ind === -1) {
    var max = 0;
    ind = [];
    for (var i = 0; i < indices.length; i++) {
      if (board[i] === "") {
        if (indices[i] > max) {
          max = indices[i];
          ind = [];
          ind.push(i);
        } else if (indices[i] === max) {
          ind.push(i);
        }
      }
    }
  }
  return ind[getRandomInt(0,ind.length)];
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

function playAGame() {
  while (drawCheck()) {
    if (firstPlayer) {
      cpu = cpu1;
    } else {
      cpu = cpu2;
    }
    board[cpu.makeMove(board)] = cpu.piece;
    if (winCheck(board,cpu.piece)) {
      board[0] = "";
      scoreboard[cpu.piece] += 1;
      break;
    }
    firstPlayer = !firstPlayer;
  }
  if (!drawCheck()) {
    scoreboard.draw += 1;
  }
}

var cpu1 = new UnbeatableRobot("X");
var cpu2 = new UnbeatableRobot("O");
var scoreboard = {
  "X":0,
  "O":0,
  draw:0
};

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
var gamecount = 0;

while (gamecount < 100000) {
  playAGame();
  console.log(gamecount);
  outputBoard();
  var board = ["","","","","","","","",""];
  gamecount ++;
}

console.log(scoreboard);
