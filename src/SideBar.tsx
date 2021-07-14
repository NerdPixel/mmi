import React from 'react'
import ChessTimer from './ChessTimer'
import Moves from './Moves'
import styled from 'styled-components'
import { ChessInstance } from 'chess.js'
import orn from './orn.png'

const Border = styled.div`
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
        <Border marked={marked} player={playerColor}>
            <h2>{player}</h2>
            <img src={orn} alt="" />
            {marked && <h3>It is your turn!</h3>}
            {showTimer && <ChessTimer timer={timer} />}
            <Moves chess={chess} player={playerColor} />
        </Border>
    )
}

export default SideBar
