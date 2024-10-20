import React, { useState } from 'react';
import Cell from './Cell';
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      const row = [];
      for (let i = 0; i < ncols; i++) {
        const result = Math.floor(Math.random() * 100) + 1;
        if (result < chanceLightStartsOn) {
          row.push(true);
        } else {
          row.push(false);
        }
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
    return board.every((row) => row.every((col) => col === false));
  }

  function deepCopy(arr) {
    return arr.map((item) => (Array.isArray(item) ? deepCopy(item) : item));
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split('-').map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = deepCopy(oldBoard);
      flipCell(y, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y, x + 1, boardCopy);
      flipCell(y, x - 1, boardCopy);
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else

  if (hasWon()) {
    return <div>'YOU WON!'</div>;
  }

  // make table board
  const tableBody = [];
  for (let r in board) {
    const tds = [];
    for (let c in board[r]) {
      const status = board[r][c];
      const td = (
        <Cell
          isLit={status}
          flipCellsAroundMe={flipCellsAround}
          coord={`${r}-${c}`}
          k={`${r}-${c}`}
        />
      );
      tds.push(td);
    }
    const tr = <tr key={r}>{tds}</tr>;
    tableBody.push(tr);
  }

  // TODO
  return (
    <>
      <table>
        <tbody>{tableBody}</tbody>
      </table>
    </>
  );
}

export default Board;
