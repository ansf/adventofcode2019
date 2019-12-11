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

const computer = new Computer(load("input-day11.txt"))

const map = new Map<string, number>()
let p = [0, 0]
let vs = [[0, -1], [1, 0], [0, 1], [-1, 0]]
let v = 0
let state = 0

map.set(JSON.stringify([0, 0]), 1)

computer.input = () => {
	return map.get(JSON.stringify(p)) ?? 0
}
computer.output = (n: number) => {
	if (n !== 0 && n !== 1) {
		throw Error(`unexpected output ${n}`)
	}
	if (state === 0) {
		map.set(JSON.stringify(p), n)
		state = 1
	} else {
		if (n == 0) {
			v = (4 + v - 1) % 4
		} else {
			v = (v + 1) % 4
		}
		p = [p[0] + vs[v][0], p[1] + vs[v][1]]
		state = 0
	}
}

computer.compute()

const [l, t, r, b] = Array.from(map.keys())
	.map(n => JSON.parse(n))
	.reduce((a, v) => [Math.min(a[0], v[0]), Math.min(a[1], v[1]), Math.max(a[2], v[0]), Math.max(a[3], v[1])], [0, 0, 0, 0])
const image = Array(r + 1).fill(0).map(_ => Array(b + 1).fill(" "))

map.forEach((v, k) => {
	const [x, y] = JSON.parse(k)
	image[x][y] = v
})


print(image)

function print<T>(a: T[][]) {
	for (let y = 0; y < a[0].length; y++) {
		console.log(Array(a.length).fill(0).map((_, x) => a[x][y] ? "#" : " ").join(""))
	}
}