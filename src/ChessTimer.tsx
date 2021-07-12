import { useEffect, useState } from 'react'
import React from 'react'

//   const [timer, setTimer] = React.useState(10);
//   const id =React.useRef(null);
//   const clear=()=>{
//   window.clearInterval(id.current)
// }

const ChessTimer = (props: { playTime: number }) => {
    const [timer, setTimer] = useState(props.playTime)
    useEffect(() => {
        if (timer > 0) {
            const timerID: NodeJS.Timer = setInterval(
                () => setTimer(timer - 1),
                1000
            )
            return () => {
                clearInterval(timerID)
            }
        }
    }, [timer])

    return (
        <div>
            <div>{timer}</div>
        </div>
    )
}

export default ChessTimer
