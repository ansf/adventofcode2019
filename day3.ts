import * as fs from "fs" 

const input = fs.readFileSync("input-day3.txt", "utf8")
const paths: [number, number][][] = input.split("\n")
	.slice(0, -1)
	.map(p => 
		p.split(",")
			.map(v => ([v[0], parseInt(v.slice(1))]))
			.map((v: [string, number]): [number, number] => {
				switch(v[0]) {
					case "U": return [0, v[1]]; break
					case "D": return [0, -v[1]]; break
					case "R": return [v[1], 0]; break
					case "L": return [-v[1], 0]; break
					default: throw new Error(`unknown direction ${v[0]}`)
				}
			})
	)

function add(v1: number[], v2: number[]): [number, number] {
	return [v1[0] + v2[0], v1[1] + v2[1]]
}

function len(v: number[]) {
	return Math.abs(v[0]) + Math.abs(v[1])
}

function norm(v: number[]) {
	return [Math.sign(v[0]), Math.sign(v[1])]
}

function points(p: [number, number][]): [number, number][] {
	let c = [0, 0]
	let points = []
	p.forEach(p => {
		for(let l = 0; l < len(p); l++) {
			c = add(c, norm(p))
			points.push(c)
		}
	})
	return points
}

const [points1, points2] = paths.map(p => points(p).map(p => `${p[0]};${p[1]}`))
const pset = new Set(points2)
const overlap = points1.filter(p => pset.has(p)).map(p => p.split(";").map(p => parseInt(p)))
console.log(Math.min(...overlap.map(p => Math.abs(p[0]) + Math.abs(p[1]))))
