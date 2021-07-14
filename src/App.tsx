import React, { useState } from 'react'
import styled from 'styled-components'
import MainGame from './MainGame'
import IntroInputField from './IntroInputField'
import './App.css'

const App: React.FC = () => {
    const [bPlayer, setbPlayer] = useState('')
    const [wPlayer, setwPlayer] = useState('')
    const [playTime, setPlayTime] = useState<number>(0)

    const [gameHasStarted, setGameHasStarted] = useState(false)

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>,
        bName: string,
        wName: string,
        playingTime: number
    ) => {
        e.preventDefault()
        setbPlayer(bName)
        setwPlayer(wName)
        setPlayTime(playingTime)
        setGameHasStarted(true)
    }

    return (
        <>
            {gameHasStarted ? (
                <MainGame
                    bPlayer={bPlayer}
                    wPlayer={wPlayer}
                    playTime={playTime * 60}
                />
            ) : (
                <IntroInputField handleSubmit={handleSubmit} />
            )}
        </>
    )
}

export default App
