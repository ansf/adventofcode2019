import * as fs from "fs"

const input = fs.readFileSync("input-day12.txt", "utf8")

function parse(input: string): Vector[] {
    const regEx = /\<x=(-?\d+), y=(-?\d+), z=(-?\d+)\>/g
    let m: RegExpExecArray
    const vs = []
    while ((m = regEx.exec(input)) !== null) {
        vs.push([m[1], m[2], m[3]].map(Number))
    }
    return vs
}

type Vector = [number, number, number]

function add(v1: Vector, v2: Vector): Vector {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]]
}
function sub(v1: Vector, v2: Vector): Vector {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]]
}
function sign(v1: Vector): Vector {
    return [v1[0], v1[1], v1[2]].map(Math.sign) as Vector
}
function len(v1: Vector): number {
    return v1.map(Math.abs).reduce((a, v) => a + v, 0)
}

let ps = parse(input)
let vs = ps.map(_ => <Vector>[0, 0, 0])
for (let i = 0; i < 1000; i++) {
    vs = gravity()
    ps = move()
    console.log(`after step ${i + 1}`)
    console.log(ps)
    console.log(vs)
    console.log()
}

const energy = ps.map((p, i) => len(p) * len(vs[i])).reduce((a, v) => a + v, 0)
console.log(energy)

function gravity(): Vector[] {
    ps.forEach((p1, i) => {
        ps.forEach((p2, j) => {
            if (i == j) {
                return
            }

            const v = vs[i]
            vs[i] = add(v, sign(sub(p2, p1)))
        })
    })
    return vs
}

function move() {
    return ps.map((p, i) => add(p, vs[i]))
}