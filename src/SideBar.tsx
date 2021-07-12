import ChessTimer from './ChessTimer'
import Moves from './Moves'
import styled from 'styled-components'
import { ShortMove } from 'chess.js'

const Border = styled.div`
    border: ${(props) => (props.marked ? 'solid 2px blue' : 'solid 2px black')};
    margin: 50;
`

const SideBar = ({
    player,
    playTime,
    marked,
    moves,
    whiteBar,
}: {
    player: string
    playTime: number
    marked: boolean
    moves: [ShortMove] | null
    whiteBar: boolean
}) => {
    return (
        <Border marked={marked}>
            <h2>{player}'s status</h2>
            {marked && <h3>It is your turn!</h3>}
            {playTime !== 0 && <ChessTimer playTime={playTime} />}
            <Moves moves={moves} whiteBar={whiteBar}></Moves>
        </Border>
    )
}

export default SideBar
