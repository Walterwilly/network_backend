function isPair(rna, i, j) {
    const pairing = { 'AU': 1.0, 'CG': 1.0, 'GU': 1.0 }

    const a = pairing[rna[i] + rna[j]]
    const b = pairing[rna[j] + rna[i]]

    if (a !== undefined) return a
    if (b !== undefined) return b

    return 0
}

function decode(rna, str, n) {
    let half = [...str.slice(0, n/2)]
    let last_index = half.lastIndexOf('(') + 1
    let firstHalf = half.slice(0, last_index)

    const dot_bracket = firstHalf.join('') + '.'.repeat(n - 2*last_index) + firstHalf.reverse().join('').replaceAll('(', ')') + '[==NEWLINE==]'
    let visual = ""
    visual += `${rna.slice(0, n/2)}[==NEWLINE==]`
    visual += `${[...dot_bracket].map(el => el == '(' ? '|' : ' ').join('').slice(0, n/2)}[==NEWLINE==]`
    visual += `${[...rna.slice(n/2, n)].reverse().join('')}`

    return dot_bracket + visual
}

async function nussinov(input) {
    const rna = input

    if (typeof rna !== 'string')
        throw new Error("input rna is not a string")
    if (!/^[AUCG]+$/.test(input))
        throw new Error("input is not a valid RNA sequence");

    const n = rna.length
    const dp = Array(n).fill().map(() => Array(n).fill(0))
    const bt = Array(n).fill().map(() => Array(n).fill(false))

    // table filling
    for (let i = n - 2 ; i >= 0 ; i--) {
        for (let j = i + 2 ; j < n ; j++) {
            const down = dp[i+1][j] 
            const left = dp[i][j-1] 
            const side = Math.max(down, left) 
            const diag = dp[i+1][j-1] + isPair(rna, i, j) 

            dp[i][j] = Math.max(diag, side) 
            bt[i][j] = (diag >= side) 
        }
    }

    // backtrack
    let backtrack = "" 
    let i = 0
    let j = n-1 
    while (j >= i) {
        if (bt[i][j]) {
            backtrack += (isPair(rna, i, n-i-1) ? "(" : ".")
            i++, j--
        } else {
            backtrack += "."
            i++
        }
    }

    return decode(rna, backtrack, n)
}

export { nussinov }