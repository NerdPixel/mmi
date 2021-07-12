import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Space } from 'antd'
import SideBar from './SideBar'
import { MessageOutlined } from '@ant-design/icons'

import './App.css'
import Chessboard, { Piece } from 'chessboardjsx'
import { ChessInstance, PieceType, ShortMove, Square } from 'chess.js'
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition'
import { normalizeTranscript, Pieces } from './synonyms'

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

const MessageBox = styled.div`
    border: 2px solid tomato;
    padding: 10px;
    position: relative;
`

const Chess = require('chess.js')

const checkContainsPiece = (chess: ChessInstance, transcript: string) => {
    const transcriptedPart = transcript.match(/[a-hA-H]+\s?[1-8]/g)
    if (!transcriptedPart) return {}

    const identifiedPiece = Object.entries(Pieces).reduce(
        (acc: string | undefined, [key, syns]) => {
            if (
                syns.some((syn) => transcript.toLowerCase().includes(syn)) &&
                !acc
            ) {
                return key
            }
            return acc
        },
        undefined
    )

    const toSquare = transcriptedPart[0]
        .toLowerCase()
        .replace(' ', '') as Square
    if (identifiedPiece && toSquare) {
        const possibleMoves = chess.SQUARES.filter((square) => {
            const s = chess.get(square)
            return s?.color === chess.turn() && s.type === identifiedPiece
        })
            .map((square) => {
                const moves = chess
                    .moves({ square, verbose: true })
                    .filter((x) => x.to === toSquare)

                if (moves.length === 1) return { from: square, to: toSquare }
                return undefined
            })
            .filter((x) => x)

        if (possibleMoves.length > 1) {
            return { error: 'Multiple possible pieces for that move' }
        } else {
            return { move: possibleMoves[0] }
        }
    }
    return {}
}

const MainGame = (props: {
    bPlayer: string
    wPlayer: string
    playTime: string
}) => {
    const [chess] = useState<ChessInstance>(
        new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    )
    const [whitesTurn, setWhitesTurn] = useState(true)
    const [fen, setFen] = useState(chess.fen())
    const { transcript, resetTranscript, listening } = useSpeechRecognition()
    const [from, setFrom] = useState<Square | null>(null)
    const [to, setTo] = useState<Square | null>(null)
    const [selectedSquare, setSelectedSquare] = useState<Square | null>()
    const [error, setError] = useState<string | null>()
    const [moves, setMoves] = useState<[ShortMove] | null>(null)

    const noteMove = (move: ShortMove) => {
        if (moves != null) {
            const newMoves = moves
            newMoves.push(move)
            setMoves(newMoves)
        } else {
            setMoves([move])
        }
    }

    useEffect(() => {
        if (!transcript) return

        console.log(normalizeTranscript(transcript))
        // check if player says full command like "a2 to a3"
        const transcriptedFull = transcript.match(
            /[a-hA-H]+[1-8].*(?:to|2).*[a-hA-H]+[1-8]/g
        )

        if (transcriptedFull) {
            const squares = transcriptedFull[0].toLowerCase()
            setFrom(squares.substring(0, 3).trim() as Square)
            setTo(squares.substring(squares.length - 2).trim() as Square)
        } else {
            const pieceMove = checkContainsPiece(
                chess,
                normalizeTranscript(transcript)
            )
            if (pieceMove.move) {
                setFrom(pieceMove.move.from)
                setTo(pieceMove.move.to)
                return
            } else if (pieceMove.error) {
                setError(pieceMove.error || 'Did not understand')
                return
            }

            // could be only a part has been said
            const transcriptedPart = transcript.match(/[a-hA-H]+[1-8]/g)
            if (transcriptedPart) {
                const square = transcriptedPart[0].toLowerCase() as Square
                if (from) {
                    setTo(square)
                } else {
                    setFrom(square)
                }
                setError(null)
                return
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
        setError(null)
        if (chess.move(move)) {
            noteMove(move)
            setWhitesTurn(false)
            setTimeout(() => {
                const moves = chess.moves()

                if (moves.length > 0) {
                    const computerMove =
                        moves[Math.floor(Math.random() * moves.length)]
                    chess.move(computerMove)
                    // noteMove(computerMove)
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
            setError(null)
            SpeechRecognition.startListening({
                continuous: false,
                language: 'en-US',
            })
        }
    }
    const handleKeypress = (e: KeyboardEvent) => {
        console.log(e)
        if (e.code === 'Space') {
            toggleListening()
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeypress)
        return () => window.removeEventListener('keydown', handleKeypress)
    }, [])

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
                <div id="blackBar" className="sidebar">
                    <SideBar
                        player={props.bPlayer}
                        playTime={props.playTime}
                        marked={!whitesTurn}
                        moves={moves}
                        whiteBar={false}
                    ></SideBar>
                </div>

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
                <div id="whiteBar" className="sideBar">
                    <SideBar
                        player={props.wPlayer}
                        playTime={props.playTime}
                        marked={whitesTurn}
                        moves={moves}
                        whiteBar={true}
                    ></SideBar>
                </div>
                <Flexbox>
                    <Button
                        type="primary"
                        icon={<MessageOutlined />}
                        onClick={toggleListening}
                    >
                        {listening ? 'Listening...' : 'Click to talk'}
                    </Button>
                    <p>or press the Space key...</p>
                    {error && !listening && <MessageBox>{error}</MessageBox>}
                </Flexbox>
            </Space>
        </Container>
    )
}

export default MainGame
