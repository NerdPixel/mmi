import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Space } from 'antd'
import { MessageOutlined } from '@ant-design/icons'

import './App.css'
import Chessboard from 'chessboardjsx'
import { ChessInstance, ShortMove } from 'chess.js'
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition'

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
`

const Flexbox = styled.div`
    display: flex;
    flex-direction: column;
`

const Chess = require('chess.js')

const App: React.FC = () => {
    const [chess] = useState<ChessInstance>(
        new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    )
    const [isListening, setIsListening] = useState(false)
    const { transcript, resetTranscript } = useSpeechRecognition()

    const [fen, setFen] = useState(chess.fen())

    const handleMove = (move: ShortMove) => {
        if (chess.move(move)) {
            setTimeout(() => {
                const moves = chess.moves()

                if (moves.length > 0) {
                    const computerMove =
                        moves[Math.floor(Math.random() * moves.length)]
                    chess.move(computerMove)
                    setFen(chess.fen())
                }
            }, 300)

            setFen(chess.fen())
        }
    }

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false)
            SpeechRecognition.stopListening()
        } else {
            resetTranscript()
            setIsListening(true)
            SpeechRecognition.startListening({
                continuous: true,
                language: 'en-US',
            })
        }
    }

    return (
        <Container>
            <Space>
                <div className="flex-center">
                    <Chessboard
                        width={800}
                        position={fen}
                        onDrop={(move) =>
                            handleMove({
                                from: move.sourceSquare,
                                to: move.targetSquare,
                                promotion: 'q',
                            })
                        }
                    />
                </div>
                {/*<Flexbox>*/}
                {/*    <Button*/}
                {/*        type="primary"*/}
                {/*        icon={<MessageOutlined />}*/}
                {/*        onClick={toggleListening}*/}
                {/*    >*/}
                {/*        {isListening ? 'Listening...' : 'Click to talk'}*/}
                {/*    </Button>*/}
                {/*    <span>Transcript: {transcript}</span>*/}
                {/*</Flexbox>*/}
            </Space>
        </Container>
    )
}

export default App
