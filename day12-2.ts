import * as fs from "fs"
const abs = Math.abs

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
function gcd(a: number, b: number) {
    if (a == 0) return abs(b)
    if (b == 0) return abs(a)

    let h: number
    do {
        h = a % b
        a = b
        b = h
    } while (b != 0)
    return abs(a)
}
function lcm(a: number, b: number) {
    return abs(a * b) / gcd(a, b)
}

const initialPs = parse(input)
const initialVs = initialPs.map(_ => <Vector>[0, 0, 0])

function period(axis: number): number {
    let ps = initialPs.slice()
    let vs = initialVs.slice()

    let s = 0
    while (true) {
        vs = gravity(ps, vs)
        ps = move(ps, vs)

        if (ps.every((p, i) => p[axis] === initialPs[i][axis] && vs[i][axis] === initialVs[i][axis])) {
            console.log(`equality after step ${s + 1}`)
            return s + 1
        }
        s++
    }
}

const periods = [0, 1, 2].map(period)
console.log(lcm(lcm(periods[2], periods[1]), periods[0]))


function gravity(ps: Vector[], vs: Vector[]): Vector[] {
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

function move(ps: Vector[], vs: Vector[]): Vector[] {
    return ps.map((p, i) => add(p, vs[i]))
}