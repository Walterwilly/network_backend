async function editDistance(input) {
    const {strA, strB} = JSON.parse(input)

    if (typeof strA !== 'string' || typeof strB !== 'string')
        throw new Error("strA of strB is not a string")

    const [lenA, lenB] = [strA.length, strB.length]

    if (lenA == 0) return lenB
    if (lenB == 0) return lenA

    let table = Array(lenA+1).fill().map(()=>Array(lenB+1).fill(0))
    for (let i = 1 ; i <= lenA ; i++) table[i][0] = 1
    for (let j = 1 ; j <= lenB ; j++) table[0][j] = 1

    let max = -1

    for (let i = 1 ; i <= lenA ; i++) {
        for (let j = 1 ; j <= lenB ; j++) {
            if (strA[i-1] != strB[j-1])
                table[i][j] = 1 + Math.min(table[i-1][j-1], table[i-1][j], table[i][j-1])
            else 
                table[i][j] = table[i-1][j-1]
        }
    }

    return (table[lenA][lenB]).toString()
}

export { editDistance }