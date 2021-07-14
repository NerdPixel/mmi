import React, { useState } from 'react'
import magic from "./Magic.png"

const IntroInputField = (props: { handleSubmit: Function }) => {
    const [bPlayer, setbPlayer] = useState('')
    const [wPlayer, setwPlayer] = useState('')
    const [playTime, setPlayTime] = useState<number>(0)

    return (
        <div className="intro">
            <img src={magic} />
            
            <form
                onSubmit={(e) => {
                    props.handleSubmit(e, bPlayer, wPlayer, playTime)
                }}
            >
                <div className="formItem">
                    <label>Name of Gryffindor player:</label>
                    <input
                        type="text"
                        value={wPlayer}
                        required
                        onChange={(e) => {
                            setwPlayer(e.target.value)
                        }}
                    />
                </div>
                <div className="formItem">
                    <label>Name of Slytherin player:</label>
                    <input
                        type="text"
                        value={bPlayer}
                        required
                        onChange={(e) => {
                            setbPlayer(e.target.value)
                        }}
                    />
                </div>
                <div className="formItem">
                    <label>Pick your chess timer:</label>
                    <select
                        value={playTime}
                        onChange={(e) => {
                            setPlayTime(parseInt(e.target.value))
                        }}
                        required
                    >
                        <option value={10}>10/10 Minutes</option>
                        <option value={20}>20/20 Minutes</option>
                        <option value={60}>60/60 Minutes</option>
                        <option value={0}>without time limit</option>
                    </select>
                </div>
                <input type="submit" value="Start Game" className="formItem" />
            </form>
        </div>
    )
}
export default IntroInputField
