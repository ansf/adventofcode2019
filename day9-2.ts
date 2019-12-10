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
			if (op == 99) {
				return this.outputs
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
		this.outputs.push(this.m(ptr1))
	}
	private get(ptr1: number) {
		if (this.inputs.length === 0) {
			throw new Error("no input")
		}
		this.mem[ptr1] = this.inputs.shift()
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

const program = load("input-day9.txt")
console.log(new Computer(program).input(2).compute())
