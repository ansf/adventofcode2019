import * as fs from "fs" 

const input = [5]

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
			iptr = add(iptr, mem, modes)
		break
		case 2:	
			iptr = mul(iptr, mem, modes)
		break
		case 3:
			iptr = get(iptr, mem, modes)
		break
		case 4:
			iptr = put(iptr, mem, modes)
		break
		case 5:
			iptr = jnz(iptr, mem, modes)
		break
		case 6:
			iptr = jz(iptr, mem, modes)
		break
		case 7:
			iptr = lt(iptr, mem, modes)
		break
		case 8:
			iptr = eq(iptr, mem, modes)
		break
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
	return iptr + 4
}
function mul(iptr: number, mem: number[], modes: number[]) {
	mem[mem[iptr+3]] = v(iptr+1, modes[0]) * v(iptr+2, modes[1])
	return iptr + 4
}
function put(iptr: number, mem: number[], modes: number[]) {
	console.log(v(iptr+1, modes[0]))
	return iptr + 2
}
function get(iptr: number, mem: number[], modes: number[]) {
	mem[mem[iptr+1]] = input.shift()
	return iptr + 2
}
function jnz(iptr: number, mem: number[], modes: number[]) {
	if(v(iptr+1, modes[0]) !== 0) {
		return v(iptr+2, modes[1])
	}
	return iptr + 3
}
function jz(iptr: number, mem: number[], modes: number[]) {
	if(v(iptr+1, modes[0]) === 0) {
		return v(iptr+2, modes[1])
	}
	return iptr + 3
}
function lt(iptr: number, mem: number[], modes: number[]) {
	const val = (v(iptr+1, modes[0]) < v(iptr+2, modes[1])) ? 1 : 0
	mem[mem[iptr+3]] = val
	return iptr + 4
}
function eq(iptr: number, mem: number[], modes: number[]) {
	const val = (v(iptr+1, modes[0]) === v(iptr+2, modes[1])) ? 1 : 0
	mem[mem[iptr+3]] = val
	return iptr + 4
}
