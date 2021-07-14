import React from 'react'
import { ChessInstance } from 'chess.js'

const Moves = (props: { chess: ChessInstance | null; player: string }) => {
    if (props.chess) {
        return (
            <div>
                {props.chess
                    .history({ verbose: true })
                    .filter((move) => move.color === props.player)
                    .map((move, idx) => (
                        <div key={move.from + move.to}>
                            {idx + 1}. from {move.from} to {move.to}
                        </div>
                    ))}
            </div>
        )
    }

    return null
}

export default Moves
