import { applyMove } from "../domain/ApplyMove.js";
import { EMPTY_KIND } from "../types/types.js";
import { Piece } from "./Piece.js";

export class Player {
  id;
  name;
  game;
  board;
  currentPiece;
  score;
  isAlive;
  malus;
  cleared;
  random;

  constructor(id, name, random, game) {
    this.id = id;
    this.name = name;
    this.game = game;
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
    console.log("in spawn piece");

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
    console.log("in lock piece");

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
    console.log("in clear line");

    if (this.mode === "Expert" && linesCleared > 0) {
      const opponentIds = this.getOpponentIds(this.id);
      console.log("in the expert mode iun clear lines");
      opponentIds.forEach(opponentId => {
          this.game.handleAction(opponentId, "RotateCW");
      });

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
