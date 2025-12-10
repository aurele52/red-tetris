export default function Score({playersScore}) {
  return <>{playersScore.map((element) => (<>Score de {element.player}: {element.score} Points</>))}</>
}
