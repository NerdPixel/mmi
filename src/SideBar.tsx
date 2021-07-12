import ChessTimer from './ChessTimer'
import Moves from './Moves'
import styled from 'styled-components'
import { ShortMove } from 'chess.js'

const SideBar = (props: {
    player: string
    playTime: number
    marked: boolean
    moves: [ShortMove] | null
    whiteBar: boolean
}) => {
    const BorderMarked = styled.div`
        border: solid 2px blue;
        margin: 50;
    `

    const NormalBorder = styled.div`
        border: solid 2px black;
    `
    const name = props.player
    const Border = props.marked ? BorderMarked : NormalBorder
    const turnTime = props.marked ? <h3>It is your turn!</h3> : <div></div>
    const timer =
        props.playTime != 0 ? (
            <ChessTimer playTime={props.playTime}></ChessTimer>
        ) : (
            <div></div>
        )
    return (
        <div>
            {
                <Border>
                    <h2>{name}'s status</h2>
                    <div>{turnTime}</div>
                    <div>{timer}</div>
                    <Moves
                        moves={props.moves}
                        whiteBar={props.whiteBar}
                    ></Moves>
                </Border>
            }
        </div>
    )
}

export default SideBar
