import * as fs from "fs" 

const targetOutput = 19690720

function run(noun: number, verb: number) {
	const mem = fs.readFileSync("input-day2.txt", "utf8")
		.split(",")
		.map(l => parseInt(l))

	mem[1] = noun
	mem[2] = verb

	let instrPtr = 0

	while(true) {
		const opCode = mem[instrPtr]
		switch(opCode) {
			case 1:	
				add(mem, mem[instrPtr+1], mem[instrPtr+2], mem[instrPtr+3])
			break
			case 2:	
				mul(mem, mem[instrPtr+1], mem[instrPtr+2], mem[instrPtr+3])
			break
			case 99:
				return mem[0]
			break
			default: throw new Error(`unknown instruction ${mem[instrPtr]}`)
		}
		instrPtr += 4
	}
}

function add(mem: number[], src1: number, src2: number, dst: number) {
	mem[dst] = mem[src1] + mem[src2]
}
function mul(mem: number[], src1: number, src2: number, dst: number) {
	mem[dst] = mem[src1] * mem[src2]
}

for(let noun = 0; noun < 100; noun++) {
	for(let verb = 0; verb < 100; verb++) {
		const output = run(noun, verb)
		if(output === targetOutput) {
			console.log(100*noun + verb)
			process.exit(0)
		}
	}
}
