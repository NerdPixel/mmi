import { useEffect, useState } from 'react'

const ChessTimer = ({
    playTime,
    countingOn,
}: {
    playTime: number
    countingOn: boolean
}) => {
    const [timer, setTimer] = useState(playTime * 60)
    useEffect(() => {
        let timerID = setInterval(() => {
            if (timer > 0 && countingOn) {
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

    const convertToTwoDigits = (value: number) => {
        const valueAsString = value.toString()
        if (!/^[0-9]$/.test(valueAsString)) {
            return value
        } else {
            return '0' + valueAsString
        }
    }

    return (
        <div>
            {convertToTwoDigits(Math.trunc(timer / (60 * 60)))}:
            {convertToTwoDigits(Math.trunc(timer / 60) % 60)}:
            {convertToTwoDigits(timer % 60)}
        </div>
    )
}

export default ChessTimer
