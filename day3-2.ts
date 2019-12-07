import * as fs from "fs" 

const input = fs.readFileSync("input-day3.txt", "utf8")
//const input = "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83\n"
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

function points(p: [number, number][]): [number, number, number][] {
	let c = [0, 0]
	let points = []
	let length = 1
	p.forEach(p => {
		for(let l = 0; l < len(p); l++) {
			c = add(c, norm(p))
			points.push([...c, length])
			length++	
		}
	})
	return points
}

const [points1, points2] = paths.map(p => points(p).map(p => ([`${p[0]};${p[1]}`, p[2]] as const)))
const pmap1 = new Map<string, number>(points1.reverse())
const pmap2 = new Map<string, number>(points2.reverse())
const overlap = Array.from(pmap1.keys()).filter(p => pmap2.has(p))
console.log(Math.min(...overlap.map(p => pmap1.get(p) + pmap2.get(p))))
