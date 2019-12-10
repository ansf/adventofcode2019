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

	private inputs = []
	private outputs = []

	constructor(program: number[]) {
		this.mem = program.slice()
	}

	input(...input: number[]) {
		this.inputs = this.inputs.concat(input)
		return this
	}

	compute(): number[] {
		let iptr = 0

		while (true) {
			const code = this.mem[iptr]
			const op = code % 100
			const modes = [code % 1000 / 100, code % 10000 / 1000, code % 100000 / 10000].map(Math.floor)
			if (op == 99) {
				return this.outputs
			}

			const instr = this.instructions[op - 1]
			if (!instr) {
				throw new Error(`unknown instruction ${op}`)
			}

			const vs = Array(instr.length - 1).fill(0).map((_, i) => this.ptr(iptr + i + 1, modes[i]))
			iptr = instr.apply(this, [iptr, ...vs])
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

	private add(iptr: number, ptr1: number, ptr2: number, ptr3: number) {
		this.mem[ptr3] = this.m(ptr1) + this.m(ptr2)
		return iptr + 4
	}
	private mul(iptr: number, ptr1: number, ptr2: number, ptr3: number) {
		this.mem[ptr3] = this.m(ptr1) * this.m(ptr2)
		return iptr + 4
	}
	private put(iptr: number, ptr1: number) {
		this.outputs.push(this.m(ptr1))
		return iptr + 2
	}
	private get(iptr: number, ptr1: number) {
		if (this.inputs.length === 0) {
			throw new Error("no input")
		}
		this.mem[ptr1] = this.inputs.shift()
		return iptr + 2
	}
	private jnz(iptr: number, ptr1: number, ptr2: number) {
		if (this.m(ptr1) !== 0) {
			return this.m(ptr2)
		}
		return iptr + 3
	}
	private jz(iptr: number, ptr1: number, ptr2: number) {
		if (this.m(ptr1) === 0) {
			return this.m(ptr2)
		}
		return iptr + 3
	}
	private lt(iptr: number, ptr1: number, ptr2: number, ptr3: number) {
		const val = (this.m(ptr1) < this.m(ptr2)) ? 1 : 0
		this.mem[ptr3] = val
		return iptr + 4
	}
	private eq(iptr: number, ptr1: number, ptr2: number, ptr3: number) {
		const val = (this.m(ptr1) === this.m(ptr2)) ? 1 : 0
		this.mem[ptr3] = val
		return iptr + 4
	}
	private sbase(iptr: number, ptr1: number) {
		this.base += this.m(ptr1)
		return iptr + 2
	}
}


const program = load("input-day9.txt")
//const program = [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99]
console.log(new Computer(program).input(1).compute())
