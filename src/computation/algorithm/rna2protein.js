import { codonTable } from "./codonTable.js"

async function rna2protein(input) {
    try {
        if (typeof input !== 'string')
            throw new Error("input is not a string")
        if (!/^[AUCG]{3,}$/.test(input))
            throw new Error("input is not a valid RNA sequence with at least 3 characters");

        const rna = input
        const start_index = rna.indexOf("AUG")
        if (start_index == -1)
            throw new Error("there is no start index")

        const len = rna.length
        const stop_codons = ["UAA", "UAG", "UGA"]

        let protein = ""
        for (let i = start_index ; i < len - 3 ; i += 3) {
            let codon = rna.substring(i, i+3)
            if (stop_codons.includes(codon)) break
            protein += codonTable[codon]
        }
        
        return protein
    } catch (error) {
        throw error
    }
}

export { rna2protein }