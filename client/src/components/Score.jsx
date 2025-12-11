export default function Score({playersScore}) {
  return <div
  style={{
    gap: "2px",
    background: "#111",
    padding: "10px 80px",
    justify: "center",
    width: "max-content",
    margin: "0 auto 20px auto",
    boxShadow: `var(--shadow-offset-small) var(--shadow-offset-small) 0px var(--outline-red),
                var(--shadow-offset-large) var(--shadow-offset-large) 0px var(--outline-blue),
                0 0 12px var(--outline-black)`,
    border: "2px solid #ffd500", }}
  >{playersScore.map((element, elIndex) => (<p key={`score-${elIndex}`}>Score de {element.player}: {element.score} Points</p>))}</div>
}
