import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Score from "./Score";

describe("<Score />", () => {
  it("affiche une ligne par joueur avec son score", () => {
    const playersScore = [
      { player: "Alice", score: 12 },
      { player: "Bob", score: 8 },
      { player: "Charlie", score: 3 },
    ];

    render(<Score playersScore={playersScore} />);

    // Vérifie chaque ligne
    expect(screen.getByText("Score de Alice: 12 Points")).toBeInTheDocument();
    expect(screen.getByText("Score de Bob: 8 Points")).toBeInTheDocument();
    expect(screen.getByText("Score de Charlie: 3 Points")).toBeInTheDocument();

    // Vérifie qu'on a exactement 3 div
    const items = screen.getAllByText(/Score de /);
    expect(items.length).toBe(3);
  });

  it("gère le cas d'une liste vide", () => {
    render(<Score playersScore={[]} />);

    // Aucun élément ne doit apparaître
    const items = screen.queryAllByText(/Score de /);
    expect(items.length).toBe(0);
  });
});
