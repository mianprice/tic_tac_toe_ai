/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
let combos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

class TTTAI {
  constructor(difficulty) {
    switch (difficulty) {
      case 'easy':
        this.move = this.move_easy;
        break;
      case 'medium':
        this.move = this.move_medium;
        break;
      case 'hard':
        this.move = this.move_hard;
        break;
      default:
        this.move = this.move_easy;
        break;
    }
  }
  move_easy(current_board) {
    return Math.floor(Math.random() * 9);
  }
  move_medium(current_board) {
    if (Math.random() > 0.5) {
      return this.move_easy(current_board);
    } else {
      return this.move_hard(current_board);
    }
  }
  move_hard(board) {
    var ind = [];
    var indices = [3,2,3,2,4,2,3,2,3];
    var toChange = [];
    var wins = [];
    var blocks = [];
    var changed = false;
    for (var i = 0; i < combos.length; i++) {
      var set = [board[combos[i][0]],board[combos[i][1]],board[combos[i][2]]];
      var status = set.reduce((a,b) => {
        if (b === 'O') {
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
      },"");
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
    return ind[Math.floor(Math.random() * ind.length)];
  }
}

let cpu = new TTTAI('easy');

class TicTacToe extends React.Component{
  constructor() {
    super();
    this.state = {
      player: 'X',
      game: ["","","","","","","","",""],
      message: 'Player 1, make your move',
      scoreboard: [
        {
          name: 'P1',
          score: 0
        },
        {
          name: 'Draw',
          score: 0
        },
        {
          name: 'CPU',
          score: 0
        }
      ],
      game_win: false,
      game_draw: false,
      cpu_move: false,
      game_type: '1',
      cpu_diff: '1'
    };
  }
  markSquare(ind) {
    if (this.state.game[ind] !== "") {
      this.setState({
        message: 'That spot is already taken.'
      });
    } else {
      let x = this.state.game;
      x[ind] = this.state.player;
      let winner;
      let new_scoreboard = this.state.scoreboard;
      let gw = combos.some((c) => {
        return c.every((i) => {
          winner = x[i];
          return x[i] === (this.state.player === 'X' ? 'X' : 'O');
        });
      });
      let gd = (x.reduce((x,y) => {return x + y},"")).length === 9;
      if (gw) {
        if (winner === 'X') {
          new_scoreboard[0].score += 1;
        } else {
          new_scoreboard[2].score += 1;
        }
      } else if (gd) {
        new_scoreboard[1].score += 1;
      }
      let cpu_m;
      if (this.state.game_type === '1' && this.state.cpu_move === false) {
        cpu_m = true;
      } else {
        cpu_m = false;
      }
      this.setState({
        game: x,
        player: this.state.player === 'X' ? 'O' : 'X',
        message: this.state.game_type === '1' ? (this.state.cpu_move ? 'Player 1, make your move' : 'CPU is thinking') : (this.state.player === 'X' ? 'Player 2, make your move' : 'Player 1, make your move'),
        game_win: gw,
        game_draw: gd,
        scoreboard: new_scoreboard,
        cpu_move: cpu_m
      });
    }
  }
  reset() {
    this.setState({
      player: 'X',
      game: ["","","","","","","","",""],
      message: 'Player 1, make your move',
      game_win: false,
      game_draw: false,
      cpu_move: false
    });
  }
  changeStateValue(str, event) {
    switch (str) {
      case 'cpu_diff':
        let ai_diff = event.target.value === '1' ? 'easy' : (event.target.value === '2' ? 'medium' : 'hard');
        cpu = new TTTAI(ai_diff);
        this.setState({
          player: 'X',
          game: ["","","","","","","","",""],
          message: 'Player 1, make your move',
          scoreboard: [
            {
              name: 'P1',
              score: 0
            },
            {
              name: 'Draw',
              score: 0
            },
            {
              name: 'CPU',
              score: 0
            }
          ],
          game_win: false,
          game_draw: false,
          cpu_move: false,
          cpu_diff: event.target.value
        });
        break;
      case 'game_type':
        let p2 = event.target.value === '1' ? 'CPU' : 'P2';
        this.setState({
          player: 'X',
          game: ["","","","","","","","",""],
          message: 'Player 1, make your move',
          scoreboard: [
            {
              name: 'P1',
              score: 0
            },
            {
              name: 'Draw',
              score: 0
            },
            {
              name: p2,
              score: 0
            }
          ],
          game_win: false,
          game_draw: false,
          cpu_move: false,
          game_type: event.target.value,
          cpu_diff: '1'
        });
        break;
      default:
        break;
    }
  }
  render() {
    if (this.state.cpu_move && !this.state.game_win && !this.state.game_draw) {
      setTimeout(() => {
        this.markSquare(cpu.move(this.state.game));
      }, 1000);
    }
    return (
      <div className="ttt">
        <div className="status">
          <div className="title">Tic Tac Toe</div>
          <div className="message">
            <div className="innerMessage">
              {this.state.game_win ? `Game over. ${this.state.game_type === '1' ? (this.state.cpu_move ? 'Player 1' : 'CPU') : (this.state.player === 'X' ? 'Player 2' : 'Player 1')} wins!` : (this.state.game_draw ? `Game over.  It's a draw.` : this.state.message)}
            </div>
            <div className={this.state.game_win || this.state.game_draw ? "reset" : "noreset"} onClick={(event) => {this.reset()}}>
              Start Over
            </div>
          </div>
        </div>
        <div className="body_area">
          <div className="board">
            {this.state.game.map((element,idx) => (
              <div className="cell" key={idx} onClick={(event) => {this.state.game_draw || this.state.game_win || this.state.cpu_move ? event.preventDefault() : this.markSquare(idx)}}><div className="text_contain"><i className={this.state.game[idx] === "X" ? "fa fa-fw fa-times" : (this.state.game[idx] === "O" ? "fa fa-fw fa-circle-o" : "")}></i></div></div>
            ))}
          </div>
          <div className="scoreboard">
            <div className="scorecard">
              <div className="score_title"><div className="text_contain">Scoreboard</div></div>
            </div>
            {this.state.scoreboard.map((element,idx) => (
              <div key={idx} className="scorecard">
                <div className="winner"><div className="text_contain">{this.state.scoreboard[idx].name}</div></div>
                <div className="score"><div className="text_contain">{this.state.scoreboard[idx].score}</div></div>
              </div>
            ))}
            <div className="scorecard">
              <div className="options">
                <div className="text_contain">
                  <select value={this.state.game_type} onChange={event => this.changeStateValue('game_type', event)}>
                    <option value="1">Player vs. AI</option>
                    <option value="2">Player vs. Player</option>
                  </select>
                </div>
              </div>
              <div className={this.state.game_type === '1' ? "scorecard" : "no_show"}>
                <div className="text_contain">
                  <select value={this.state.cpu_diff} onChange={event => this.changeStateValue('cpu_diff', event)}>
                    <option value="1">Easy</option>
                    <option value="2">Medium</option>
                    <option value="3">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className={this.state.game_win || this.state.game_draw ? "reset" : "noreset"} onClick={(event) => {this.reset()}}>
            Start Over
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <TicTacToe/>,
  document.getElementById('root')
);
