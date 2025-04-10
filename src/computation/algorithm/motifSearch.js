const ctoi = { 'A': 0, 'C': 1, 'G': 2, 'T': 3 }
let DNAs, k, t

function retrieveMotif(dna) {
    const motifs = []
    const len = dna.length

    for (let i = 0 ; i + k < len ; i++)
        motifs.push(dna.substring(i, i+k))

    return motifs
}

function profiling(motifs) {
    const profile = Array(4).fill().map(() => Array(k).fill(1.0/(t+4)))
    const len = motifs.length

    for (let i = 0 ; i < k ; i++)
        for (let j = 0 ; j < len ; j++)
            profile[ctoi[motifs[j][i]]][i] += 1.0/(t+4) ;

    return profile
}

function probable(motif, profile) {
    let probability = 0.0

    for (let i = 0 ; i < k ; i++)
        probability += (profile[ctoi[motif[i]]][i]) ;

    return probability
}

function mostProbable(dna, profile) {
    const motifs = retrieveMotif(dna)
    let bestProbability = 0.0 
    let bestMotif = ''

    motifs.forEach(motif => {
        const probability = probable(motif, profile)
        if (probability > bestProbability) {
            bestProbability = probability
            bestMotif = motif
        }
    })

    return bestMotif
}

function scoring(motifs) {
    const profile = Array(4).fill().map(() => Array(k).fill(0))
    let score = 0

    for (let i = 0 ; i < k ; i++) {
        for (let j = 0 ; j < t ; j++)
            profile[ctoi[motifs[j][i]]][i]++ ;
        let mx = Math.max( Math.max(profile[0][i], profile[1][i]), Math.max(profile[2][i], profile[3][i]) ) ;
        score += (t - mx) ;
    }

    return score
}

async function GreedyMotifSearch(input) {
    try {
        ({ DNAs, k } = JSON.parse(input))

        if (!Array.isArray(DNAs) || !DNAs.every(row => typeof row === 'string') && /^[ATCG]+$/.test(row))
            throw new Error("DNAs is not an array of string")
        if (!Number.isInteger(k))
            throw new Error("k is not an integer")

        t = DNAs.length

        let bestMotifs = []
        let bestScore = t * k
        const firstMotifs = retrieveMotif(DNAs[0])

        firstMotifs.forEach(motif => {
            let motifs = [ motif ]
            DNAs.slice(1).forEach(dna => motifs.push(mostProbable(dna, profiling(motifs))))

            let score = scoring(motifs)
            if (score < bestScore) {
                bestMotifs = motifs
                bestScore = score
            }
        })

        return bestMotifs.join('[==NEWLINE==]')
    } catch (error) {
        throw error
    }
}

export { GreedyMotifSearch }