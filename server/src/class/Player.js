import { EMPTY_KIND } from "../types/types";
import { Piece } from "./Piece";

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

  constructor(id, name, random) {
    this.id = id;
    this.name = name;
    this.board = this.createEmptyBoard();
    this.currentPiece = null;
    this.score = 0;
    this.isAlive = true;
    this.malus = 0;
    this.cleared = 0;
    this.random = random;
  }

  createEmptyBoard() {
    return Array(20)
      .fill(null)
      .map(() => Array(10).fill(EMPTY_KIND));
  }

  spawnPiece() {
    let kinds = [0, 1, 2, 3, 4, 5, 6];
    this.currentPiece = new Piece(
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
