async function probHiddenPath(input) {
    try {
        const {path, state, transition} = JSON.parse(input)

        // Validate input
        if (typeof path !== 'string') 
            throw new Error("path is not string")
        if (!Array.isArray(state)) 
            throw new Error("state is not array")
        if (!Array.isArray(transition) || !transition.every(row => Array.isArray(row)&& row.length === state.length)) 
            throw new Error("transition is not matrix")
        if (transition.length !== state.length || transition.some(row => row.length !== state.length)) 
            throw new Error("state length not match transition's dimension")
        if (!transition.every(row => row.every(value => typeof value === 'number'))) 
            throw new Error("transition  should be a matrix a number")

        const encode = new Map()
        state.forEach((s, i) => encode[s] = i)
        
        let probability = 1.0 / state.length

        for (let i = 0 ; i < path.length - 1 ; i++) {
            if (encode[path[i]] === undefined || encode[path[i+1]] === undefined)
                throw new Error("found unregistered state in path")

            probability *= transition[encode[path[i]]][encode[path[i+1]]]
        }

        return probability.toString()
    } catch (error) {
        throw error
    }
}

export { probHiddenPath }