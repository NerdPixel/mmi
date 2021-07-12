import { useEffect, useState } from 'react'

const ChessTimer = (props: { playTime: number }) => {
    //const [timer, setTimer] = useState(props.playTime * 60)
    const [timer, setTimer] = useState(2)
    useEffect(() => {
        const timerID: NodeJS.Timer = setInterval(() => {
            timer > 0 && setTimer(timer - 1)
        }, 1000)
        return () => {
            clearInterval(timerID)
        }
    }, [timer])

    return (
        <div>
            <div>{timer}</div>
        </div>
    )
}

export default ChessTimer
