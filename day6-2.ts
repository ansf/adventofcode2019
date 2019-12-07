import * as fs from "fs"

const input = fs.readFileSync("input-day6.txt", "utf8")

type Node = {id: string, orbiting?: Node, orbitedBy: Node[]}
const nodes = new Map<string, Node>()

const orbits = input.split("\n")
	.slice(0, -1)
	.map(line => line.split(")"))
orbits.forEach(o => {
	nodes.set(o[0], {id: o[0], orbitedBy: []})
	nodes.set(o[1], {id: o[1], orbitedBy: []})
})
orbits.forEach(o => {
	nodes.get(o[1]).orbiting = nodes.get(o[0])
	nodes.get(o[0]).orbitedBy.push(nodes.get(o[1]))
})

function isRoot(o: Node) {
	return !o.orbiting
}

const from = nodes.get("YOU")
const to = nodes.get("SAN")

function distanceDF(from: Node, to: Node): number {
	if(from == to) {
		return 0
	}

	return Math.min(
		...[...from.orbitedBy, from.orbiting].map(o => {
			return 1 + distanceDF(o, to)
		})
	)
}

function distanceBF(from: Node, to: Node): number {
	const seen = new Set<string>()
	let next = [from.orbiting]
	let l = 0 
	while(true) {
		next = next.reduce((acc, n) => 
			acc.concat([...n.orbitedBy, n.orbiting]), [])
			.filter(n => n && !seen.has(n.id))
		next.forEach(n => seen.add(n.id))
		
		l++
		if(next.find(n => n.id === to.id)) {
			return l-1
		}	
	}
}

console.log(distanceBF(from, to))
