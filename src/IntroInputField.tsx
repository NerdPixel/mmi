import React, { useState } from 'react'

const IntroInputField = (props: { handleSubmit: Function }) => {
    const [bPlayer, setbPlayer] = useState('')
    const [wPlayer, setwPlayer] = useState('')
    const [playTime, setPlayTime] = useState('')

    return (
        <div>
            <form
                onSubmit={(e) => {
                    props.handleSubmit(e, bPlayer, wPlayer, playTime)
                }}
            >
                <label>Name of white player:</label>
                <input
                    type="text"
                    value={wPlayer}
                    required
                    onChange={(e) => {
                        setwPlayer(e.target.value)
                    }}
                ></input>
                <label>Name of black player:</label>
                <input
                    type="text"
                    value={bPlayer}
                    required
                    onChange={(e) => {
                        setbPlayer(e.target.value)
                    }}
                ></input>
                <label>Pick your chess timer:</label>
                <select
                    value={playTime}
                    onChange={(e) => {
                        setPlayTime(e.target.value)
                    }}
                    required
                >
                    <option value="10">10/10 Minutes</option>
                    <option value="20">20/20 Minutes</option>
                    <option value="60">60/60 Minutes</option>
                    <option defaultValue="noLimit">without time limit</option>
                </select>
                <input type="submit" value="Submit"></input>
            </form>
        </div>
    )
}
export default IntroInputField
