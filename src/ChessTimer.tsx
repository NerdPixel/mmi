import { useEffect, useState } from 'react'

export const useTimer = (initialTime: number, active: boolean) => {
    const ret = useState<number>(initialTime)
    const [timer, setTimer] = ret
    useEffect(() => {
        let timerID = setInterval(() => {
            if (timer > 0 && active) {
                setTimer(timer - 1)
            }
            if (timer === 0) {
                clearInterval(timerID)
            }
        }, 1000)
        return () => {
            clearInterval(timerID)
        }
    }, [setTimer, timer, active])

    return ret
}

const ChessTimer = ({ timer }: { timer: number }) => {
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
