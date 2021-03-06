import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Layout, Space, Modal } from 'antd'
import SideBar from './SideBar'
import magic from './Magic.png'

import './App.css'
import Chessboard from 'chessboardjsx'
import { ChessInstance, ShortMove, Square } from 'chess.js'
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition'
import Sider from 'antd/lib/layout/Sider'
import { Content } from 'antd/lib/layout/layout'
import { useTimer } from './ChessTimer'

const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const checkmateFen = '8/4N1pk/8/7R/8/8/8/8 b KQkq - 0 1'
export const Pieces = {
    p: ['pawn', 'phone', 'on', 'born', 'palm'],
    n: ['knight', 'night', 'light'],
    b: ['bishop'],
    r: ['rook', 'rock'],
    q: ['queen'],
    k: ['king'],
}

export const syns = [
    ['see', 'c'],
    ['die', 'd'],
    ['for', '4'],
    ['andy', 'undo'],
    ['andrew', 'undo'],
]

export const normalizeTranscript = (transcript: string) => {
    transcript = transcript.toLowerCase()
    for (let syn of syns) {
        transcript = transcript.replaceAll(syn[0], syn[1])
    }
    return transcript
}

const MessageBox = styled.div`
    border: 2px solid tomato;
    padding: 10px;
    position: relative;
`

const WinnerModal = styled(Modal)`
    background-color: #580a1d;
    color: white;
    border-radius: 4px;
    .ant-modal-content {
        box-shadow: none;
    }

    .ant-modal-footer {
        background-color: #580a1d;
        border-top: 1px solid gold;
        padding: 0px 16px;
    }
    .ant-modal-body {
        background-color: #580a1d;
    }
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

const MainGame = ({
    bPlayer,
    wPlayer,
    playTime,
}: {
    bPlayer: string
    wPlayer: string
    playTime: number
}) => {
    const [chess] = useState<ChessInstance>(new Chess(startFen))
    const [fen, setFen] = useState(chess.fen())
    const { transcript, resetTranscript, listening } = useSpeechRecognition()
    const [from, setFrom] = useState<Square | null>(null)
    const [to, setTo] = useState<Square | null>(null)
    const [selectedSquare, setSelectedSquare] = useState<Square | null>()
    const [error, setError] = useState<string | null>()
    const [isWinnerModalVisible, setWinnerModalVisible] =
        useState<boolean>(false)
    const whitesTurn = chess.turn() === 'w'

    const [wTimer, setWTimer] = useTimer(playTime, chess.turn() === 'w')
    const [bTimer, setBTimer] = useTimer(playTime, chess.turn() === 'b')
    const [lastMoveTime, setLastMoveTime] = useState<[number, number][] | null>(
        [[playTime, playTime]]
    )

    useEffect(() => {
        if (!transcript) return

        const norm = normalizeTranscript(transcript)
        console.log(norm)
        // check if player says full command like "a2 to a3"
        const transcriptedFull = transcript.match(
            /[a-hA-H]+[1-8].*(?:to|2).*[a-hA-H]+[1-8]/g
        )

        if (transcriptedFull) {
            const squares = transcriptedFull[0].toLowerCase()
            setFrom(squares.substring(0, 3).trim() as Square)
            setTo(squares.substring(squares.length - 2).trim() as Square)
        } else {
            const pieceMove = checkContainsPiece(chess, norm)
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
            } else if (norm.includes('undo')) {
                undoMove()
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
            setFen(chess.fen())

            // Update undo timer values
            setLastMoveTime((x) =>
                x ? [[wTimer, bTimer], x[0]] : [[wTimer, bTimer]]
            )
            if (chess.in_checkmate()) {
                setWinnerModalVisible(true)
            }
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
        if (e.code === 'Space') {
            e.preventDefault()
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
            console.log('To ', square)
        } else {
            setFrom(square)
            console.log('From ', square)
        }
    }

    const undoMove = () => {
        if (lastMoveTime && lastMoveTime[1]) {
            chess.undo()
            const [wTime, bTime] = lastMoveTime[1]
            setWTimer(wTime)
            setBTimer(bTime)
            setLastMoveTime((x) => (x ? [x[1]] : null))
            setFen(chess.fen())
        }
    }

    return (
        <div className="mainwrapper">
            <WinnerModal
                visible={isWinnerModalVisible}
                footer={[
                    <button
                        className="defaultButton"
                        onClick={() => setWinnerModalVisible(false)}
                    >
                        Return
                    </button>,
                ]}
            >
                Checkmate! The winner is{' '}
                {chess.turn() === 'w' ? bPlayer : wPlayer}
            </WinnerModal>
            <div className="controls">
                <img
                    className="logo"
                    onClick={toggleListening}
                    src={magic}
                    alt={'press to speak button'}
                />
                {listening
                    ? 'Listening...'
                    : 'Click to talk or press the Space key...'}
                <button
                    className="defaultButton"
                    disabled={!(lastMoveTime && lastMoveTime[1])}
                    onClick={undoMove}
                >
                    Undo
                </button>
                <div>
                    {error && !listening && <MessageBox>{error}</MessageBox>}
                </div>
            </div>

            <div>
                <Space className="main">
                    <Layout id="layout">
                        <Sider
                            className={`sideBar sideBarSlyth ${
                                whitesTurn ? '' : 'active'
                            }`}
                            width="250"
                        >
                            <SideBar
                                player={bPlayer}
                                playTime={playTime}
                                marked={!whitesTurn}
                                chess={chess}
                                playerColor="b"
                                timer={bTimer}
                                showTimer={playTime !== 0}
                            />
                        </Sider>
                        <Content className="flex-center">
                            <Chessboard
                                allowDrag={() => !listening}
                                calcWidth={({ screenWidth }) =>
                                    screenWidth * 0.42
                                }
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
                                                  backgroundColor: 'gold',
                                              },
                                          }
                                        : {}),
                                    ...(selectedSquare
                                        ? {
                                              [selectedSquare]: {
                                                  backgroundColor: 'gold',
                                              },
                                          }
                                        : {}),
                                }}
                                onSquareClick={handleSquareClick}
                                onMouseOverSquare={(...args) => {
                                    if (!listening) {
                                        setSelectedSquare(...args)
                                    }
                                }}
                                onMouseOutSquare={() => setSelectedSquare(null)}
                            />
                        </Content>
                        <Sider
                            width="250"
                            className={`sideBar sideBarGryf ${
                                whitesTurn ? 'active' : ''
                            }`}
                        >
                            <SideBar
                                player={wPlayer}
                                playTime={playTime}
                                marked={whitesTurn}
                                chess={chess}
                                playerColor="w"
                                timer={wTimer}
                                showTimer={playTime !== 0}
                            />
                        </Sider>
                    </Layout>
                </Space>
            </div>
        </div>
    )
}

export default MainGame
