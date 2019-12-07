import * as fs from "fs"

const file = fs.readFileSync("input-day1.txt", "utf8")
	.split("\n")
	.slice(0, -1)
	.map(l => parseInt(l))
	.map(i => Math.floor(i / 3) -2)
	.reduce((a, v) => a + v, 0)	
console.log(file)
