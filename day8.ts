import * as fs from "fs"

const content = fs.readFileSync("input-day8.txt", "utf8")
    .trim()
    .split("")
    .map(l => parseInt(l))

const layers: number[][] = []
for (let i = 0; i < content.length; i += 150) {
    layers.push(content.slice(i, i + 150))
}

const info = layers
    .map(l => ([
        l.filter(p => p === 0).length,
        l.filter(p => p === 1).length,
        l.filter(p => p === 2).length
    ] as const))
    .sort((a, b) => a[0] - b[0])

console.log(info[0][1] * info[0][2])