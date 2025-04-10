function getWeight(amino) {
    const weightMap = {
        G:  57, A:  71, S:  87, P:  97, V:  99, T: 101, C: 103, L: 113, N: 114, 
        D: 115, Q: 128, E: 129, M: 131, H: 137, F: 147, R: 156, Y: 163, W: 186
    }

    return weightMap[amino]
}

function sumWeight(peptide) {
    return Array.from(peptide).map(amino => getWeight(amino)).reduce((total, weight) => total + weight)
}

function generateSpectrum(peptide) {
    const spectrum = [[0, ""]]
    const peptides = peptide + peptide
    const sz = peptide.length

    // console.log(peptides)

    for (let l = 1 ; l < sz ; l++) {
        for (let i = 0 ; i < sz ; i++) {
            let pep = peptides.slice(i, i+l) ;
            spectrum.push([sumWeight(pep), pep]) ;
        }
    }

    spectrum.push([sumWeight(peptide), peptide]) ;

    // console.log(spectrum)

    return [ ...new Set(spectrum) ].map(elem => elem[0])
}

function isCircular(strA, strB) {
    if (strA.length != strB.length) return false 

    return (strA + strA).includes(strB)
}

function scoringSpectrum(theoretical, experimental) {
    return experimental.filter(weight => theoretical.includes(weight)).length
}

// with leaderboard
function bnb(spectrum, mx) {
    let leadPeptide = [0, ""]
    let leaderboard = [ leadPeptide ]
    const amino_acids = "GASPVTCLNDQEMHFRYW"

    while (leaderboard.length > 0) {
        const temp = []

        leaderboard.forEach(peptide => {
            for (const amino_acid of amino_acids) {
                let t_pep = peptide[1] + amino_acid
                let t_spec = generateSpectrum(t_pep)

                if (t_spec.slice(-1)[0] > mx) continue
                if (temp.some(pep => isCircular(t_pep, pep[1]))) continue

                temp.push([scoringSpectrum(t_spec, spectrum), t_pep])
            }
        })

        temp.sort((a, b) => b[0] - a[0])

        leaderboard = temp.filter(peptide => (peptide[0] >= leadPeptide[0]))

        // console.log(leaderboard)

        if (leaderboard.length > 0)
            leadPeptide = leaderboard[0]
    }

    return leadPeptide[1]
}

async function reconstructSpectrum(input) {
    try {
        if (!Array.isArray(input) || !input.every(row => Number.isInteger(row)))
            throw new Error("input is not an array of number")

        const spectrum = input
        const leadPeptide = bnb(spectrum, Math.max(...spectrum))

        return leadPeptide
    } catch (error) {
        throw error
    }
}

export { reconstructSpectrum }