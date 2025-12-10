export default function Score({playersScore}) {
  return <>{playersScore.map((element, elIndex) => (<div key={`score-${elIndex}`}>Score de {element.player}: {element.score} Points</div>))}</>
}
