export default function Score(props) {
  return <>{props.totScore.map((element) => (<>Score de {element.player}: {element.score} Points</>));}</>
}
