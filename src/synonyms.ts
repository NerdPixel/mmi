export const Pieces = {
    p: ['pawn'],
    n: ['knight', 'night'],
    b: ['bishop'],
    r: ['rook', 'rock'],
    q: ['queen'],
    k: ['king'],
}

export const syns = [
    ['see', 'c'],
    ['night', 'knight'],
]

export const normalizeTranscript = (transcript: string) => {
    transcript = transcript.toLowerCase()
    for (let syn of syns) {
        transcript = transcript.replaceAll(syn[0], syn[1])
    }
    return transcript
}
