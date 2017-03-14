// Random AI
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

// Intelligent AI
function UnbeatableRobot(piece) {
  this.piece = piece;
}

UnbeatableRobot.prototype.makeMove = function(board) {
  var ind = [];
  var indices = [3,2,3,2,4,2,3,2,3];
  var toChange = [];
  var wins = [];
  var blocks = [];
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
      } else {
        return b.length === 1 ? a + "1" : a;
      }
    }.bind(this),"");
    changed = false;
    if (status.length === 2) {
      if (status.includes("1") && !status.includes("0")) {
        blocks.push(combos[i][set.indexOf("")]);
      } else if (status.includes("0") && !status.includes("1")) {
        wins.push(combos[i][set.indexOf("")]);
      }
    }
  }
  toChange.forEach(function(element) {
    indices[element] --;
  });
  if (wins.length + blocks.length === 0) {
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
    ind = wins.length > 0 ? wins : blocks;
  }
  return ind[getRandomInt(0,ind.length)];
};


// VARIABLE DECLARATIONS
var winner = '';
var counter = [0,0,0];
var cpuThinking = false;
var p1 = new SampleRobot('X');
var p2 = new UnbeatableRobot('O');
var players = [p1,p2];
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
var simulation;

// HELPER FUNCTIONS
function indexToID(ind) {
  switch (ind) {
    case 0:
      return "one";
    case 1:
      return "two";
    case 2:
      return "three";
    case 3:
      return "four";
    case 4:
      return "five";
    case 5:
      return "six";
    case 6:
      return "seven";
    case 7:
      return "eight";
    case 8:
      return "nine";
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// GAME LOGIC
function reset() {
  winner = '';
  $(".cell").empty();
}

function displayWinner() {
  updateCounter(winner);
}

function updateCounter(winner) {
  if (winner === 'X') {
    counter[0] += 1;
  } else if (winner === 'O') {
    counter[1] += 1;
  } else if (winner === 'd') {
    counter[2] += 1;
  }
  $(".p1").text(counter[0].toString());
  $(".p2").text(counter[1].toString());
  $(".p3").text(counter[2].toString());
}

function getGrid() {
  var arr = $(".cell").map(function() {
    return $(this).text();
  });
  return $.makeArray(arr);
}

function winCheck(grid,player) {
  return combos.some(function(c) {
    return c.every(function(i) {
      return grid[i] === player;
    });
  });
}

function checkBoard(player, grid) {
  // Check Wins
  win = winCheck(grid,player.piece);
  if (win) {
    winner = player.piece;
    return true;
  }
  // Check Draw
  var draw = grid.reduce(function(a,b) {
    return a + b;
  },"");
  if (draw.length === 9) {
    winner = 'd';
    return true;
  }
  return false;
}

function playAGame(player1, player2, firstplayer) {
  // WAIT BEFORE EACH MOVE
  // Can only use this for 1 game simulation
  setTimeout(function() {
    if (firstplayer === undefined) {
      firstplayer = true;
    }
    if (firstplayer) {
      player = player1;
    } else {
      player = player2;
    }
    var grid = getGrid();
    if (!checkBoard(player, grid)) {
      var index = indexToID(player.makeMove(grid));
      $("#"+index).text(player.piece);
      firstplayer = !firstplayer;
      playAGame(player1,player2,firstplayer);
    } else {
      displayWinner();
    }
  },500);

  // QUICK SIMULATION
  // if (firstplayer === undefined) {
  //   firstplayer = true;
  // }
  // if (firstplayer) {
  //   player = player1;
  // } else {
  //   player = player2;
  // }
  // var grid = getGrid();
  // if (!checkBoard(player, grid)) {
  //   var index = indexToID(player.makeMove(grid));
  //   $("#"+index).text(player.piece);
  //   firstplayer = !firstplayer;
  //   playAGame(player1,player2,firstplayer);
  // } else {
  //   displayWinner();
  // }
}

function displaySimOptions() {
  $(".winner").empty();
  var playButton = "<div class='play-again' id='simulate'>Run Simulation</div>";
  var numGames = "<div class='play-again'><span># of Games<br>(MAX = 10000)</span><input type='text' value='1'></div>";
  $(".winner").append(numGames);
  $(".winner").append(playButton);
}

$(function () {
  reset();
  updateCounter();
  displaySimOptions();
  $(".game").on('click','#simulate', function() {
    var games = $(".play-again input").val();
    if ($(".play-again input").val() > 10000) {
      games = 10000;
    }
    $(".winner").empty();
    $('.winner').append("<div class='play-again' id='start'>Start Simulation</div>");
    simulation = function runSimulation() {
      $(".winner").empty();
      $(".winner").append("<div class='play-again'>Currently simulating...</div>");
      for (var i = 0; i < games; i++) {
        reset();
        playAGame(p1,p2);
      }
      displaySimOptions();
    };
  });
  $(".game").on('click','#start', function() {
    simulation();
  });
});
