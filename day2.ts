import * as fs from "fs"

const mem = fs.readFileSync("input-day2.txt", "utf8")
	.split(",")
	.map(l => parseInt(l))

mem[1] = 12
mem[2] = 2

let instrPtr = 0

function run() {
	while(true) {
		const opCode = mem[instrPtr]
		switch(opCode) {
			case 1:	
				add(mem[instrPtr+1], mem[instrPtr+2], mem[instrPtr+3])
			break
			case 2:	
				mul(mem[instrPtr+1], mem[instrPtr+2], mem[instrPtr+3])
			break
			case 99:
				halt()
			break
			default: throw new Error(`unknown instruction ${mem[instrPtr]}`)
		}
		instrPtr += 4
	}
}

function add(src1: number, src2: number, dst: number) {
	mem[dst] = mem[src1] + mem[src2]
}
function mul(src1: number, src2: number, dst: number) {
	mem[dst] = mem[src1] * mem[src2]
}
function halt() {
	console.log(`halting with value ${mem[0]}`)
	process.exit(0)
}

run()
