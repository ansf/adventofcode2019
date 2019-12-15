import * as fs from "fs"

function load(program: string) {
	return fs.readFileSync(program, "utf8")
		.split(",")
		.map(l => parseInt(l))
}

class Computer {

	private instructions = [
		this.add,
		this.mul,
		this.get,
		this.put,
		this.jnz,
		this.jz,
		this.lt,
		this.eq,
		this.sbase,
	] as const

	private mem: number[]
	private base = 0

	input: () => number = () => { throw new Error("no input") }
	output = (n: number) => console.log(n)

	constructor(program: number[]) {
		this.mem = program.slice()
	}

	compute() {
		let iptr = 0

		while (true) {
			const code = this.mem[iptr]
			const op = code % 100
			if (op == 99) {
				return
			}

			const instr = this.instructions[op - 1]
			if (!instr) {
				throw new Error(`unknown instruction ${op}`)
			}

			const vs = Array.from(Array(instr.length)).map((_, i) =>
				this.ptr(iptr + i + 1, Math.floor(code % 10 ** (i + 3) / (10 ** (i + 2)))))
			iptr = instr.apply(this, vs) ?? (iptr + instr.length + 1)
		}
	}

	private ptr(ptr: number, mode: number) {
		switch (mode) {
			case 0: return this.mem[ptr]
			case 1: return ptr
			case 2: return this.mem[ptr] + this.base
			default: throw new Error(`unknown mode ${mode}`)
		}
	}

	private m(ptr: number) {
		return this.mem[ptr] ?? 0
	}

	private add(ptr1: number, ptr2: number, ptr3: number) {
		this.mem[ptr3] = this.m(ptr1) + this.m(ptr2)
	}
	private mul(ptr1: number, ptr2: number, ptr3: number) {
		this.mem[ptr3] = this.m(ptr1) * this.m(ptr2)
	}
	private put(ptr1: number) {
		this.output(this.m(ptr1))
	}
	private get(ptr1: number) {
		this.mem[ptr1] = this.input()
	}
	private jnz(ptr1: number, ptr2: number) {
		if (this.m(ptr1) !== 0) {
			return this.m(ptr2)
		}
	}
	private jz(ptr1: number, ptr2: number) {
		if (this.m(ptr1) === 0) {
			return this.m(ptr2)
		}
	}
	private lt(ptr1: number, ptr2: number, ptr3: number) {
		const val = (this.m(ptr1) < this.m(ptr2)) ? 1 : 0
		this.mem[ptr3] = val
	}
	private eq(ptr1: number, ptr2: number, ptr3: number) {
		const val = (this.m(ptr1) === this.m(ptr2)) ? 1 : 0
		this.mem[ptr3] = val
	}
	private sbase(ptr1: number) {
		this.base += this.m(ptr1)
	}
}

const program = load("input-day13.txt")
program[0] = 2
const computer = new Computer(program)

const map = new Map<string, number>()
let state = 0
let x: number
let y: number
let score = 0
let ballX = 0
let paddleX = 0

computer.input = () => {
	return Math.sign(ballX - paddleX)
}

computer.output = (n: number) => {
	switch (state) {
		case 0:
			x = n
			state = 1
			break
		case 1:
			y = n
			state = 2
			break
		case 2:
			map.set(JSON.stringify([x, y]), n)
			if (x === -1 && y === 0) {
				score = n
			} else if (n === 4) {
				ballX = x
			} else if (n === 3) {
				paddleX = x
			}
			state = 0
			break
	}
	console.log(Array.from(map.values()).filter(v => v === 2).length)
}

computer.compute()

console.log(score)