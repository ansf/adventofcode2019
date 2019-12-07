import * as fs from "fs" 

const input = [1]

const mem = fs.readFileSync("input-day5.txt", "utf8")
	.split(",")
	.map(l => parseInt(l))

let iptr = 0

while(true) {
	const code = mem[iptr]
	const op = code % 100
	const modes = [code % 1000 / 100, code % 10000 / 1000, code % 100000 / 10000].map(Math.floor)

	switch(op) {
		case 1:	
			add(iptr, mem, modes)
			iptr += 4
		break
		case 2:	
			mul(iptr, mem, modes)
			iptr += 4
		break
		case 3:
			get(iptr, mem, modes)
			iptr += 2
		break;
		case 4:
			put(iptr, mem, modes)
			iptr += 2
		break;
		case 99:
			process.exit(0)
		break
		default: throw new Error(`unknown instruction ${mem[iptr]}`)
	}
}

function v(ptr: number, mode: number) {
	if(mode === 0) {
		return mem[mem[ptr]]
	} else if(mode === 1) {
		return mem[ptr]
	}
	throw new Error(`unknown mode ${mode}`)
}

function add(iptr: number, mem: number[], modes: number[]) {
	mem[mem[iptr+3]] = v(iptr+1, modes[0]) + v(iptr+2, modes[1])
}
function mul(iptr: number, mem: number[], modes: number[]) {
	mem[mem[iptr+3]] = v(iptr+1, modes[0]) * v(iptr+2, modes[1])
}
function put(iptr: number, mem: number[], modes: number[]) {
	console.log(v(iptr+1, modes[0]))
}
function get(iptr: number, mem: number[], modes: number[]) {
	mem[mem[iptr+1]] = input.shift()
}
