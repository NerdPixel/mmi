import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Space } from 'antd'
import { MessageOutlined } from '@ant-design/icons'

import './App.css'
import Chessboard from 'chessboardjsx'
import { ChessInstance, ShortMove, Square } from 'chess.js'
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
    const [fen, setFen] = useState(chess.fen())
    const { transcript, resetTranscript, listening } = useSpeechRecognition()
    const [from, setFrom] = useState<Square | null>(null)
    const [to, setTo] = useState<Square | null>(null)
    const [selectedSquare, setSelectedSquare] = useState<Square | null>()

    useEffect(() => {
        // check if player says full command like "a2 to a3"
        const transcriptedFull = transcript.match(
            /[a-hA-H]+[1-8].*(?:to|2).*[a-hA-H]+[1-8]/g
        )
        if (transcriptedFull) {
            const squares = transcriptedFull[0].toLowerCase()
            setFrom(squares.substring(0, 3).trim() as Square)
            setTo(squares.substring(squares.length - 2).trim() as Square)
        } else {
            // could be only a part has been said
            const transcriptedPart = transcript.match(/[a-hA-H]+[1-8]/g)
            if (transcriptedPart) {
                const square = transcriptedPart[0].toLowerCase() as Square
                if (from) {
                    setTo(square)
                } else {
                    setFrom(square)
                }
            }
        }
    }, [transcript])

    useEffect(() => {
        if (from && to) {
            handleMove({ from, to })
            setFrom(null)
            setTo(null)
        }
    }, [from, to])

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
        if (listening) {
            SpeechRecognition.stopListening()
        } else {
            resetTranscript()
            SpeechRecognition.startListening({
                continuous: false,
                language: 'en-US',
            })
        }
    }

    const handleSquareClick = (square: Square) => {
        if (from) {
            setTo(square)
        } else {
            setFrom(square)
        }
    }

    return (
        <Container>
            <Space>
                <div className="flex-center">
                    <Chessboard
                        width={800}
                        position={fen}
                        onDrop={(move) => {
                            setFrom(null)
                            handleMove({
                                from: move.sourceSquare,
                                to: move.targetSquare,
                                promotion: 'q',
                            })
                        }}
                        squareStyles={{
                            ...(from
                                ? {
                                      [from]: {
                                          backgroundColor: 'orange',
                                      },
                                  }
                                : {}),
                            ...(selectedSquare
                                ? {
                                      [selectedSquare]: {
                                          backgroundColor: 'orange',
                                      },
                                  }
                                : {}),
                        }}
                        onSquareClick={handleSquareClick}
                        onMouseOverSquare={setSelectedSquare}
                    />
                </div>
                <Flexbox>
                    <Button
                        type="primary"
                        icon={<MessageOutlined />}
                        onClick={toggleListening}
                    >
                        {listening ? 'Listening...' : 'Click to talk'}
                    </Button>
                </Flexbox>
            </Space>
        </Container>
    )
}

export default App
