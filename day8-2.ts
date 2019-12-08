import * as fs from "fs"

const content = fs.readFileSync("input-day8.txt", "utf8")
    .trim()
    .split("")
    .map(l => parseInt(l))

const layers: number[][] = []
for (let i = 0; i < content.length; i += 150) {
    layers.push(content.slice(i, i + 150))
}

const image = Array(25).fill(0).map(_ => Array(6).fill(2))

console.log(layers)

for (let x = 0; x < image.length; x++) {
    for (let y = 0; y < image[0].length; y++) {
        image[x][y] = layers.reduce((acc, v) => acc === 2 ? v[x + y * 25] : acc, 2)
    }
}

for (let y = 0; y < image[0].length; y++) {
    console.log(Array(25).fill(0).map((_, x) => image[x][y]).map(c => c == 0 ? " " : "M").join(""))
}