const MATCH = +3
const MISMATCH = -3
const GAP_PENALTY = 2

function matchingScore(strA, strB, indexA, indexB) {
    return strA[indexA] == strB[indexB] ? MATCH : MISMATCH
}

async function smithWaterman(input) {
    try {
        const {strA, strB} = JSON.parse(input)

        if (typeof strA !== 'string' || typeof strB !== 'string')
            throw new Error("strA of strB is not a string")

        const [lenA, lenB] = [strA.length, strB.length]

        let max_score_backtrack = 0
        let lastA, lastB

        const table = Array(lenA+1).fill().map(() => Array(lenB+1).fill(0))

        for (let i = 1 ; i <= lenA ; i++) {
            for (let j = 1 ; j <= lenB ; j++) {
                let maxScore = 0 

                // check match score
                maxScore = Math.max(maxScore, table[i-1][j-1] + matchingScore(strA, strB, i-1, j-1))

                // check gap
                for (let k = 1 ; k <= i ; k++) // check vertically
                    maxScore = Math.max(maxScore, table[i-k][j] - k*GAP_PENALTY) ;
                for (let l = 1 ; l <= j ; l++) // check horizontally
                    maxScore = Math.max(maxScore, table[i][j-l] - l*GAP_PENALTY) ;

                // set current position
                table[i][j] = maxScore
                if (maxScore >= max_score_backtrack) {
                    max_score_backtrack = maxScore
                    lastA = i, lastB = j
                }
            }
        }

        // backtrack
        let predictA = ""
        let predictB = ""
        let i = lastA, j = lastB
        let matchLines = ""

        while (table[i][j] != 0) {
            const vert = table[i-1][j] ;
            const hori = table[i][j-1] ;

            // if previous match
            if (strA[i-1] == strB[j-1]) {
                predictA = strA[i-1] + predictA ;
                predictB = strB[j-1] + predictB ;
                matchLines = '|' + matchLines
                i--, j-- ;
            } else if (vert == hori) {
                predictA = strA[i-1] + predictA ;
                predictB = strB[j-1] + predictB ;
                matchLines = '|' + matchLines
                i--, j-- ;
            } else if (vert > hori) {
                predictA = strA[i-1] + predictA ;
                predictB = "-" + predictB ;
                matchLines = ' ' + matchLines
                i-- ;
            } else if (hori > vert) {
                predictA = "-" + predictA ;
                predictB = strB[j-1] + predictB ;
                matchLines = ' ' + matchLines
                j-- ;
            }
        }

        return `${predictA}[==NEWLINE==]${matchLines}[==NEWLINE==]${predictB}`
    } catch (error) {
        throw error
    }
}

export { smithWaterman }