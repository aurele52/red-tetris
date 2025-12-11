import { applyMove } from "../domain/ApplyMove.js";
import { EMPTY_KIND } from "../types/types.js";
import { Piece } from "./Piece.js";

function  isValidPosition(coords, board) {
  return coords.every(
    (coord) =>
      coord.x >= 0 &&
      coord.x < board[0].length &&
      coord.y >= 0 &&
      coord.y < board.length &&
      board[coord.y][coord.x] === EMPTY_KIND,
  );
}

export class Player {
  id;
  name;
  board;
  currentPiece;
  score;
  isAlive;
  malus;
  cleared;
  random;
  totScore;
  stored;
  next;

  constructor(id, name, random, mode) {
    this.id = id;
    this.name = name;
    this.board = this.createEmptyBoard();
    this.currentPiece = null;
    this.score = 0;
    this.isAlive = true;
    this.malus = 0;
    this.cleared = 0;
    this.random = random;
    this.totScore = 0;
    this.stored = null;
    this.next = null;
  }

  store() {
    if (!this.stored) {
      if (!this.next) return false
      this.next.x = this.currentPiece.x
      this.next.y = this.currentPiece.y
        if (!isValidPosition(this.next.getAbsoluteCoords(), this.board)) {
          return false
        }
      this.stored = this.currentPiece
      let kinds = [0, 1, 2, 3, 4, 5, 6];
      this.currentPiece = this.next
      this.next = new Piece(kinds[Math.floor(this.random() * kinds.length)]);

    } else {
      this.stored.x = this.currentPiece.x
      this.stored.y = this.currentPiece.y
      if (!isValidPosition(this.stored.getAbsoluteCoords(), this.board)) {
        return false
      }
      let tmp = this.stored;
      this.stored = this.currentPiece;
      this.currentPiece = tmp

    }
    return true
  }

  createEmptyBoard() {
    return Array(20)
      .fill(null)
      .map(() => Array(10).fill(EMPTY_KIND));
  }

  spawnPiece() {
    let kinds = [0, 1, 2, 3, 4, 5, 6];
    if (!this.next)
      this.next = new Piece(
        kinds[Math.floor(this.random() * kinds.length)],
      );
    this.currentPiece = this.next;
    this.next = new Piece(
      kinds[Math.floor(this.random() * kinds.length)],
    );
    if (this.currentPiece && !this.currentPiece.isValidPosition(this.board)) {
      this.isAlive = false;
    }
  }

  setRandom(randq) {
    this.random = randq;
  }

  lockPiece() {
    if (!this.currentPiece) return;

    const newBoard = this.board.map((row) => [...row]);
    const coords = this.currentPiece.getAbsoluteCoords();

    coords.forEach((coord) => {
      if (coord.y >= 0 && coord.y < newBoard.length) {
        newBoard[coord.y][coord.x] = this.currentPiece.kind;
      }
    });

    this.board = newBoard;
    this.clearLines();
    this.currentPiece = null;
  }

  clearLines() {
    const newBoard = this.board.filter((row) =>
      row.some((cell) => cell === EMPTY_KIND),
    );
    const linesCleared = this.board.length - newBoard.length;

    this.cleared += linesCleared;

    this.score += linesCleared * 100;

    while (newBoard.length < 20) {
      newBoard.unshift(Array(10).fill(EMPTY_KIND));
    }
    this.board = newBoard;
  }

  reset() {
    this.board = this.createEmptyBoard();
    this.currentPiece = null;
    this.score = 0;
    this.isAlive = true;
    this.cleared = 0;
    this.malus = 0;
  }

  toData() {
    return {
      id: this.id,
      name: this.name,
      score: this.score,
      isAlive: this.isAlive,
      board: this.board,
      currentPiece: this.currentPiece?.toData() || null,
      malus: this.malus,
    };
  }
}
