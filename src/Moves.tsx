import { ShortMove } from 'chess.js'

const Moves = (props: { moves: [ShortMove] | null; whiteBar: boolean }) => {
    let moves = props.moves
    if (moves != null) {
        let counterStart = props.whiteBar ? 0 : 1

        let playerMoves
        for (let i = counterStart; i < moves.length; i += 2) {
            if (playerMoves != null) {
                playerMoves.push(moves[i])
            } else {
                playerMoves = [moves[i]]
            }
        }

        let counterPrint = 0
        if (playerMoves != null) {
            return (
                <div>
                    {playerMoves.map((move) => {
                        counterPrint++
                        return (
                            <div>
                                {counterPrint}. from {move.from} to {move.to}
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return <div></div>
        }
    } else {
        return <div></div>
    }
}

export default Moves
