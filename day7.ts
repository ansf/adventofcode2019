import * as fs from "fs"

function load(program: string) {
	return fs.readFileSync(program, "utf8")
		.split(",")
		.map(l => parseInt(l))
}

const program = load("input-day7.txt")

//const program = [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0]

function thruster(input: number[]): number {
	const out = compute(program, input)
	return out[out.length - 1]
}
function thrusterChain(phases: number[]): number {
	const p = phases.slice()
	let out = thruster([p.shift(), 0])
	while (p.length) {
		out = thruster([p.shift(), out])
	}
	return out
}

const phases = [0, 1, 2, 3, 4]
const allPhases = permutate(phases)
const maxThrust = allPhases.reduce((acc, v) => {
	return Math.max(acc, thrusterChain(v))
}, 0)
console.log(maxThrust)

function permutate(a: number[]): number[][] {
	if (a.length == 1) {
		return [a]
	}
	return Array(a.length).fill(0)
		.map((_, i) => {
			const c = a.slice()
			return [c.splice(i, 1)[0], c] as const
		})
		.reduce((acc, [prefix, rest]) => {
			permutate(rest)
				.map(p => [prefix, ...p])
				.forEach(p => acc.push(p))
			return acc
		}, [])
}

function compute(p: number[], input: number[]): number[] {
	const mem = p.slice()
	const outputs = []
	let iptr = 0
	while (true) {
		const code = mem[iptr]
		const op = code % 100
		const modes = [code % 1000 / 100, code % 10000 / 1000, code % 100000 / 10000].map(Math.floor)

		switch (op) {
			case 1:
				iptr = add(iptr, mem, modes)
				break
			case 2:
				iptr = mul(iptr, mem, modes)
				break
			case 3:
				iptr = get(iptr, mem, modes, input)
				break
			case 4:
				const [newIptr, output] = put(iptr, mem, modes)
				iptr = newIptr
				//outputs.push(output)
				return [output]
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
				return outputs
			default: throw new Error(`unknown instruction ${mem[iptr]}`)
		}
	}
}

function v(mem: number[], ptr: number, mode: number) {
	if (mode === 0) {
		return mem[mem[ptr]]
	} else if (mode === 1) {
		return mem[ptr]
	}
	throw new Error(`unknown mode ${mode}`)
}

function add(iptr: number, mem: number[], modes: number[]) {
	mem[mem[iptr + 3]] = v(mem, iptr + 1, modes[0]) + v(mem, iptr + 2, modes[1])
	return iptr + 4
}
function mul(iptr: number, mem: number[], modes: number[]) {
	mem[mem[iptr + 3]] = v(mem, iptr + 1, modes[0]) * v(mem, iptr + 2, modes[1])
	return iptr + 4
}
function put(iptr: number, mem: number[], modes: number[]) {
	return [iptr + 2, v(mem, iptr + 1, modes[0])]
}
function get(iptr: number, mem: number[], modes: number[], input: number[]) {
	mem[mem[iptr + 1]] = input.shift()
	return iptr + 2
}
function jnz(iptr: number, mem: number[], modes: number[]) {
	if (v(mem, iptr + 1, modes[0]) !== 0) {
		return v(mem, iptr + 2, modes[1])
	}
	return iptr + 3
}
function jz(iptr: number, mem: number[], modes: number[]) {
	if (v(mem, iptr + 1, modes[0]) === 0) {
		return v(mem, iptr + 2, modes[1])
	}
	return iptr + 3
}
function lt(iptr: number, mem: number[], modes: number[]) {
	const val = (v(mem, iptr + 1, modes[0]) < v(mem, iptr + 2, modes[1])) ? 1 : 0
	mem[mem[iptr + 3]] = val
	return iptr + 4
}
function eq(iptr: number, mem: number[], modes: number[]) {
	const val = (v(mem, iptr + 1, modes[0]) === v(mem, iptr + 2, modes[1])) ? 1 : 0
	mem[mem[iptr + 3]] = val
	return iptr + 4
}
