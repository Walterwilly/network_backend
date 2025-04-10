import { rna2protein } from "./algorithm/rna2protein.js"
import { editDistance } from "./algorithm/editDistance.js"
import { burrowWheeler } from "./algorithm/burrowWheeler.js"
import { GreedyMotifSearch } from "./algorithm/motifSearch.js"
import { smithWaterman } from "./algorithm/localAlignment.js"
import { probHiddenPath } from "./algorithm/HMM.js"
import { nussinov } from "./algorithm/rnaFolding.js"
import { reconstructSpectrum } from "./algorithm/massSpectrum.js"

async function compute (mode, input, note) {
    try {
        switch (mode) {
            case 'X': return await note
            case 'A': return await rna2protein(input)
            case 'B': return await editDistance(input)
            case 'C': return await burrowWheeler(input)
            case 'D': return await GreedyMotifSearch(input)
            case 'E': return await smithWaterman(input)
            case 'F': return await probHiddenPath(input)
            case 'G': return await nussinov(input)
            case 'H': return await reconstructSpectrum(input)
            default : throw new Error("the mode is unregistered")
        }
    } catch (error) {
        throw error
    }
}

export default compute