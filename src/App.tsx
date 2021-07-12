import React, { useState } from 'react'
import styled from 'styled-components'
import MainGame from './MainGame'
import IntroInputField from './IntroInputField'
import './App.css'

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
`

const App: React.FC = () => {
    const [bPlayer, setbPlayer] = useState('')
    const [wPlayer, setwPlayer] = useState('')
    const [playTime, setPlayTime] = useState('')

    const [gameHasStarted, setGameHasStarted] = useState(false)

    const state = gameHasStarted ? (
        <MainGame
            bPlayer={bPlayer}
            wPlayer={wPlayer}
            playTime={playTime}
        ></MainGame>
    ) : (
        <IntroInputField
            setbPlayer={setbPlayer}
            setwPlayer={setwPlayer}
            setPlayTime={setPlayTime}
            setGameHasStarted={setGameHasStarted}
        ></IntroInputField>
    )

    return <Container>{state}</Container>
}

export default App
