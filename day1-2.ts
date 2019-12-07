import * as fs from "fs"

const file = fs.readFileSync("input-day1.txt", "utf8")
	.split("\n")
	.slice(0, -1)
	.map(l => parseInt(l))
	.map(i => fuel(i))
	.reduce((a, v) => a + v, 0)	
console.log(file)

function fuel(mass): number {
	if(mass <= 0) {
		return 0
	}
	const liters = Math.floor(mass / 3) - 2
	return fuel(liters) + Math.max(0, liters)
}
