async function burrowWheeler(input) {
    try {
        if (typeof input !== 'string')
            throw new Error("input is not a string")

        const string = input
        const len = string.length ;
        let table = [ string + '$' ]

        for (let i = 0 ; i < len ; i++)
            table.push(rotate(table.slice(-1)[0]))

        table.sort()

        return table.map((str) => str.slice(-1)).join('')
    } catch (error) {
        throw error
    }
}

function rotate(str) {
    if (str.length == 0) return ''
    if (str.length == 1) return str

    return str.slice(1) + str.slice(0, 1)
}

export { burrowWheeler }