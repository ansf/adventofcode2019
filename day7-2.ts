import * as fs from "fs"

class Computer {

	halted = false
	output = undefined

	private mem: number[]
	private iptr = 0
	private nextOutput = undefined
	private inputs = []

	constructor(program: number[]) {
		this.mem = program.slice()
	}

	input(...n: number[]) {
		this.inputs = this.inputs.concat(n)
		return this
	}

	compute() {
		if (this.halted) {
			throw new Error("computer already halted")
		}

		while (true) {
			this.iptr = this.step()
			if (this.halted) {
				return { halted: true }
			}
			if (typeof this.nextOutput !== "undefined") {
				this.output = this.nextOutput
				this.nextOutput = undefined
				return { output: this.output }
			}
		}
	}

	private step() {
		let iptr = this.iptr
		const mem = this.mem

		const code = this.mem[iptr]
		const op = code % 100
		const modes = [code % 1000 / 100, code % 10000 / 1000, code % 100000 / 10000].map(Math.floor)

		switch (op) {
			case 1: return add(iptr, mem, modes)
			case 2: return mul(iptr, mem, modes)
			case 3: return get(iptr, mem, modes, this.inputs)
			case 4:
				const [newIptr, output] = put(iptr, mem, modes)
				this.nextOutput = output
				return newIptr
			case 5: return jnz(iptr, mem, modes)
			case 6: return jz(iptr, mem, modes)
			case 7: return lt(iptr, mem, modes)
			case 8: return eq(iptr, mem, modes)
			case 99:
				this.halted = true
				return iptr
			default: throw new Error(`unknown instruction ${mem[iptr]}`)
		}
	}
}

function load(program: string) {
	return fs.readFileSync(program, "utf8")
		.split(",")
		.map(l => parseInt(l))
}

const program = load("input-day7.txt")

function thrusterChain(phases: number[]): number {
	const thrusters = phases.map(phase => new Computer(program).input(phase))
	thrusters[0].input(0)
	thrusters[0].compute()

	while (true) {
		thrusters[1].input(thrusters[0].output).compute()
		thrusters[2].input(thrusters[1].output).compute()
		thrusters[3].input(thrusters[2].output).compute()
		thrusters[4].input(thrusters[3].output).compute()
		if (thrusters[4].halted) {
			return thrusters[4].output
		}
		thrusters[0].input(thrusters[4].output).compute()
	}
}

const phases = [5, 6, 7, 8, 9]
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
	if (input.length === 0) {
		throw new Error("no input")
	}
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
