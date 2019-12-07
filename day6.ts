import * as fs from "fs"

const input = fs.readFileSync("input-day6.txt", "utf8")

type Node = {id: string, o?: Node}
const nodes = new Map<string, Node>()

const orbits = input.split("\n")
	.slice(0, -1)
	.map(line => line.split(")"))
orbits.forEach(o => {
	nodes.set(o[0], {id: o[0]})
	nodes.set(o[1], {id: o[1]})
})
orbits.forEach(o => {
	nodes.get(o[1]).o = nodes.get(o[0])
})
console.log(orbits.length)

function isRoot(o: Node) {
	return !o.o
}

function orbitCount(o: Node) {
	if(isRoot(o)) {
		return 0
	}
	return 1 + orbitCount(o.o)
}
const count = Array.from(nodes.values())
	.map(o => orbitCount(o))
	.reduce((a, v) => a+v, 0)
console.log(count)
