import {
  EMPTY_KIND,
  KIND_I,
  KIND_O,
  KIND_T,
  KIND_L,
  KIND_J,
  KIND_S,
  KIND_Z,
} from "../types/types";
import { getShapeTemplate, rotateShape } from "../domain/shape";
import { Piece } from "./Piece";

jest.mock("../domain/shape", () => ({
  getShapeTemplate: jest.fn(),
  rotateShape: jest.fn(),
}));

const mockedGetShapeTemplate = getShapeTemplate;
const mockedRotateShape = rotateShape;

const baseShape = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
];

describe("Piece", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetShapeTemplate.mockReturnValue(baseShape);
    mockedRotateShape.mockReturnValue([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ]);
  });

  describe("constructor", () => {
    it("utilise getShapeTemplate quand aucun shape n'est passé", () => {
      const kind = KIND_I;
      const piece = new Piece(kind);

      expect(mockedGetShapeTemplate).toHaveBeenCalledWith(kind);
      expect(piece.shape).toEqual(baseShape);
      expect(piece.x).toBe(3); // valeur par défaut
      expect(piece.y).toBe(0); // valeur par défaut
      expect(piece.rotation).toBe(0);
    });

    it("utilise le shape passé sans appeler getShapeTemplate", () => {
      const kind = KIND_O;
      const customShape = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ];

      const piece = new Piece(kind, 5, 10, 2, customShape);

      expect(mockedGetShapeTemplate).not.toHaveBeenCalled();
      expect(piece.shape).toBe(customShape);
      expect(piece.x).toBe(5);
      expect(piece.y).toBe(10);
      expect(piece.rotation).toBe(2);
    });
  });

  describe("mouvements", () => {
    it("moveLeft retourne une nouvelle Piece avec x - 1 (sans muter l'original)", () => {
      const kind = KIND_T;
      const piece = new Piece(kind, 4, 5, 1, baseShape);

      const moved = piece.moveLeft();

      expect(moved).not.toBe(piece);
      expect(moved.x).toBe(3);
      expect(moved.y).toBe(5);
      expect(moved.rotation).toBe(1);
      expect(moved.shape).toBe(baseShape);

      // original inchangé
      expect(piece.x).toBe(4);
    });

    it("moveRight retourne une nouvelle Piece avec x + 1", () => {
      const piece = new Piece(KIND_L, 2, 5, 0, baseShape);

      const moved = piece.moveRight();

      expect(moved.x).toBe(3);
      expect(moved.y).toBe(5);
    });

    it("moveDown retourne une nouvelle Piece avec y + 1", () => {
      const piece = new Piece(KIND_J, 2, 5, 0, baseShape);

      const moved = piece.moveDown();

      expect(moved.x).toBe(2);
      expect(moved.y).toBe(6);
    });
  });

  describe("rotate", () => {
    it("incrémente la rotation modulo 4 et utilise rotateShape", () => {
      const piece = new Piece(KIND_S, 1, 2, 1, baseShape);

      const rotated = piece.rotate();

      expect(rotated.rotation).toBe((1 + 1) % 4);
      expect(rotated.shape).toEqual([
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ]);

      expect(piece.rotation).toBe(1);
      expect(piece.shape).toBe(baseShape);
    });

    it("revient à 0 après 3 -> 0 (modulo 4)", () => {
      const piece = new Piece(KIND_Z, 0, 0, 3, baseShape);

      const rotated = piece.rotate();

      expect(rotated.rotation).toBe(0);
    });
  });

  describe("getAbsoluteCoords", () => {
    it("retourne les coordonnées absolues en ajoutant x et y de la piece", () => {
      const piece = new Piece(KIND_I, 10, 20, 0, baseShape);

      const coords = piece.getAbsoluteCoords();

      expect(coords).toEqual([
        { x: 10, y: 20 },
        { x: 11, y: 20 },
      ]);
    });
  });

  describe("isValidPosition", () => {
    const makeEmptyBoard = (width, height) =>
      Array(height).fill(Array(width).fill(EMPTY_KIND));

    it("retourne true quand toutes les cases sont dans les limites et vides", () => {
      const board = makeEmptyBoard(10, 20);
      const piece = new Piece(KIND_I, 3, 5, 0, baseShape);

      expect(piece.isValidPosition(board)).toBe(true);
    });

    it("retourne false si une coordonnée est en dehors du board (gauche)", () => {
      const board = makeEmptyBoard(10, 20);
      const piece = new Piece(KIND_I, -1, 5, 0, baseShape);

      expect(piece.isValidPosition(board)).toBe(false);
    });

    it("retourne false si une coordonnée est en dehors du board (droite)", () => {
      const board = makeEmptyBoard(4, 4);
      // baseShape: (0,0) et (1,0). Avec x = 4 => coords (4,0) et (5,0) -> hors board
      const piece = new Piece(KIND_I, 4, 0, 0, baseShape);

      expect(piece.isValidPosition(board)).toBe(false);
    });

    it("retourne false si une coordonnée est en dessous du board", () => {
      const board = makeEmptyBoard(4, 4);
      // y=4 => (0,4) et (1,4) => hors board (height=4)
      const piece = new Piece(KIND_I, 0, 4, 0, baseShape);

      expect(piece.isValidPosition(board)).toBe(false);
    });

    it("retourne false si une case du board n'est pas EMPTY_KIND", () => {
      const board = makeEmptyBoard(10, 20);

      const piece = new Piece(KIND_I, 3, 5, 0, baseShape);
      // coords absolues: (3,5) et (4,5) => (4,5) est occupé
      board[5][4] = KIND_I;

      expect(piece.isValidPosition(board)).toBe(false);
    });
  });

  describe("toData", () => {
    it("retourne un PieceData fidèle aux propriétés de la piece", () => {
      const piece = new Piece(KIND_I, 7, 8, 2, baseShape);

      const data = piece.toData();

      expect(data).toEqual({
        kind: piece.kind,
        shape: piece.shape,
        x: piece.x,
        y: piece.y,
        rotation: piece.rotation,
      });
    });
  });
});
