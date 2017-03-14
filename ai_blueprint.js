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
  var ind = [];
  var indices = [3,2,3,2,4,2,3,2,3];
  var toChange = [];
  var wins = [];
  var blocks = [];
  var immediateBlocks = [];
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
        immediateBlocks.push(combos[i][set.indexOf("")]);
      }
      blocks.push(combos[i][set.indexOf("")]);
      blocks.push(combos[i][set.lastIndexOf("")]);
    } else if (status.includes("0") && !status.includes("1") && status.length === 2) {
      wins.push(combos[i][set.indexOf("")]);
    }
  }
  if (wins.length === 0) {

    toChange.forEach(function(element) {
      indices[element] --;
    });
    immediateBlocks.forEach(function(element) {
      indices[element] *= 10;
    });
    blocks.forEach(function(element) {
      indices[element] *= 2;
    });

    var max = 0;
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
  } else {
    ind = wins;
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
  var currentString = "";
  var count = 0;
  while (out.length > 0) {
    count++;
    var x = out.shift ();
    x = x === "" ? "_" : x;
    currentString += "|";
    currentString += x;
    currentString += "|";
    if (count % 3 === 0) {
      currentString += "\n";
    }
  }
  currentString += "____________";
  return currentString;
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
  while (drawCheck() && !winCheck(board,cpu1.piece) && !winCheck(board,cpu2.piece)) {
    if (firstPlayer) {
      cpu = cpu1;
    } else {
      cpu = cpu2;
    }
    board[cpu.makeMove(board)] = cpu.piece;
    currentGame.push(outputBoard());
    if (winCheck(board,cpu.piece)) {
      if (cpu.piece === "O") {
        currentGame.forEach(function(element) {
          console.log(element);
        });
        throw new Error("Random player won");
      }
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
var cpu2 = new SampleRobot("O");
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
var currentGame = [];

var firstPlayer = true;
var cpu;
var gamecount = 0;

while (gamecount < 10000) {
  gamecount ++;
  currentGame = [];
  playAGame();
  // if (winCheck(board,cpu2.piece)) {
  //   outputBoard();
  // }
  var board = ["","","","","","","","",""];
}

console.log(scoreboard);
