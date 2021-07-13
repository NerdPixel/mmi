import React from 'react'
import ChessTimer from './ChessTimer'
import Moves from './Moves'
import styled from 'styled-components'
import { ChessInstance } from 'chess.js'

const Border = styled.div`
    border: ${(props) => (props.marked ? 'solid 2px blue' : 'solid 2px black')};
    margin: 50;
`

const SideBar = ({
    player,
    marked,
    chess,
    playerColor,
    timer,
    showTimer,
}: {
    player: string
    playTime: number
    marked: boolean
    chess: ChessInstance
    timer: number
    playerColor: string
    showTimer: boolean
}) => {
    return (
        <Border marked={marked}>
            <h2>{player}'s status</h2>
            {marked && <h3>It is your turn!</h3>}
            {showTimer && <ChessTimer timer={timer} />}
            <Moves chess={chess} player={playerColor} />
        </Border>
    )
}

export default SideBar
