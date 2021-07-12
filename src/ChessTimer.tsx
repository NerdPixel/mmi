import { useEffect, useState } from 'react'

const ChessTimer = ({ playTime }: { playTime: number }) => {
    const [timer, setTimer] = useState(playTime)
    useEffect(() => {
        let timerID = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1)
            }
            if (timer === 0) {
                clearInterval(timerID)
            }
        }, 1000)
        return () => {
            clearInterval(timerID)
        }
    }, [timer])

    return <div>{timer}</div>
}

export default ChessTimer
