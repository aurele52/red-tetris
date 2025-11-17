import { Board, EMPTY_KIND, Kind, PlayerData } from "../types/types";
import { Piece } from "./Piece";

export class Player {
  id: string;
  name: string;
  board: Board;
  currentPiece: Piece | null;
  score: number;
  isAlive: boolean;
  malus: number;
  cleared: number;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.board = this.createEmptyBoard();
    this.currentPiece = null;
    this.score = 0;
    this.isAlive = true;
    this.malus = 0;
    this.cleared = 0;
  }

  private createEmptyBoard(): Board {
    return Array(20)
      .fill(null)
      .map(() => Array(10).fill(EMPTY_KIND));
  }

  spawnPiece(): void {
    const kinds: Kind[] = [0, 1, 2, 3, 4, 5, 6] as Kind[];
    const randomKind = kinds[Math.floor(Math.random() * kinds.length)];
    this.currentPiece = new Piece(randomKind, 3, this.malus);

    if (this.currentPiece && !this.currentPiece.isValidPosition(this.board)) {
      this.isAlive = false;
    }
  }

  lockPiece(): void {
    if (!this.currentPiece) return;

    const newBoard = this.board.map((row) => [...row]);
    const coords = this.currentPiece.getAbsoluteCoords();

    coords.forEach((coord) => {
      if (coord.y >= 0 && coord.y < newBoard.length) {
        newBoard[coord.y][coord.x] = this.currentPiece!.kind;
      }
    });

    this.board = newBoard;
    this.clearLines();
    this.currentPiece = null;
  }

  private clearLines(): void {
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

  reset(): void {
    this.board = this.createEmptyBoard();
    this.currentPiece = null;
    this.score = 0;
    this.isAlive = true;
    this.cleared = 0;
    this.malus = 0;
  }

  toData(): PlayerData {
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
