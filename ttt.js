var winner = '';
var counter = [0,0,0];
var possible = ["one","two","three","four","five","six","seven","eight","nine"];
var cpuThinking = false;
var p1 = 'X';
var p2 = 'O';
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

// function makeNextMove(board, piece) {
//
// }

function checkBestMove() {
  var grid = getGrid();
  var second = [0,2,6,8];
  if (grid[4].length === 0) {
    return [true,4];
  } else {
    for (var x = 0; x < second.length; x++) {
      if (grid[second[x]].length === 0) {
        return [true,second[x]];
      }
    }
  }
  return [false];
}

function cpuMove() {
  cpuThinking = true;
  var status = $(".status").text();
  $(".status").text("CPU is thinking...");
  setTimeout(function() {
    var changed = false;
    var move = "";
    var ran = true;
    var win_must, block_must, win_move, block_move;
    var arr = getGrid();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].length === 0) {
        var win_arr = JSON.parse(JSON.stringify(getGrid()));
        win_arr[i] = "O";
        win_must = checkBoard(win_arr);
        console.log(win_must);
        if (win_must) {
          win_move = indexToID(i);
          console.log(win_move);
          ran = false;
          break;
        }
      }
    }
    for (var j = 0; j < arr.length; j++) {
      if (arr[j].length === 0) {
        var block_arr = JSON.parse(JSON.stringify(getGrid()));
        block_arr[j] = "X";
        block_must = checkBoard(block_arr);
        console.log(block_must);
        if (block_must) {
          block_move = indexToID(j);
          console.log(block_move);
          ran = false;
          break;
        }
      }
    }
    if (!ran) {
      if (win_must) {
        move = win_move;
      } else {
        move = block_move;
      }
      $("#"+move).text("O");
      if (checkBoard()) {
        displayWinner();
      }
    } else {
      bestMove = checkBestMove();
      if (bestMove[0]) {
        move = indexToID(bestMove[1]);
        $("#"+move).text("O");
        if (checkBoard()) {
          displayWinner();
        }
      } else {
        while (!changed) {
          move = possible[getRandomInt(0,8)];
          var t = $("#"+move).text();
          if (t.length === 0) {
            t = "O";
            changed = true;
          }
          $("#"+move).text(t);
          if (checkBoard()) {
            displayWinner();
          }
        }
      }
    }
    cpuThinking = false;
    $(".status").text(status);
  },1000);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function reset() {
  winner = '';
  $(".winner").toggle();
  $(".cell").empty();
  $(".board").on('click','.cell', function() {
    if (cpuThinking) {
      return;
    }
    var t = $(this).text();
    if (t === "O") {
      return;
    }
    if (t.length === 0) {
      t = "X";
    }
    $(this).text(t);
    var arr = getGrid();
    if (checkBoard()) {
      displayWinner();
    } else {
      cpuMove();
    }
  });
}

function getGrid() {
  var arr = $(".cell").map(function() {
    return $(this).text();
  });
  return $.makeArray(arr);
}

// function checkWin(grid, bool) {
//   arr = [];
//   for (var i = 0; i < grid.length; i++) {
//     if (i < 9) {
//       arr.push(grid[i]);
//     }
//   }
//   grid = arr;
//   if (
//     (grid[3] === grid[4] && grid[4] === grid[5]) ||
//     (grid[1] === grid[4] && grid[4] === grid[7]) ||
//     (grid[0] === grid[4] && grid[4] === grid[8]) ||
//     (grid[2] === grid[4] && grid[4] === grid[6])
//   ) {
//     winner = grid[4];
//   } else if (
//     (grid[0] === grid[1] && grid[1] === grid[2]) ||
//     (grid[0] === grid[3] && grid[3] === grid[6])
//   ) {
//     winner = grid[0];
//   } else if (
//     (grid[2] === grid[5] && grid[5] === grid[8]) ||
//     (grid[6] === grid[7] && grid[7] === grid[8])
//   ) {
//     winner = grid[8];
//   }
//   var a = grid.reduce(function(a,b) {
//     return a + b;
//   },"");
//   if (winner.length === 1) {
//     if (!bool) {
//       winner = "";
//     }
//     return true;
//   } else if (a.length === 9) {
//     winner = 'd';
//     return true;
//   }
// }

function winCheck(grid,player) {
  return combos.some(function(c) {
    return c.every(function(i) {
      return grid[i] === player;
    });
  });
}

function checkBoard(grid) {
  var bool = false;
  if (grid === undefined) {
    // Get Game Board
    grid = getGrid();
    bool = true;
  }
  // Check Wins
  var win = false;
  for (var j=0; j<players.length; j++) {
    win = winCheck(grid,players[j]);
    if (win) {
      if (bool) {
        winner = players[j];
      }
      return win;
    }
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

function displayWinner() {
  var winString = "";
  if (winner === "d") {
    winString = "It's a draw!";
  } else {
    winString = winner === 'X' ? "You win!" : "CPU wins!";
  }
  updateCounter(winner);
  var playButton = "<div class='play-again'>Play Again</div>";
  $(".winner").text(winString);
  $(".winner").append(playButton);
  $(".winner").toggle();
  $(".board").off('click','.cell');
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

$(function () {
  reset();
  updateCounter();
  $(".game").on('click','.play-again', function() {
    reset();
  });
});
