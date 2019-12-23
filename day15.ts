import * as fs from "fs"

function load(program: string) {
	return fs.readFileSync(program, "utf8")
		.trim()
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
	output: (o: number) => boolean = (o: number) => { console.log(o); return true }

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
			const newInstrPtr = instr.apply(this, vs)
			if (newInstrPtr === -1) {
				break
			}
			iptr = newInstrPtr ?? (iptr + instr.length + 1)
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
		return this.output(this.m(ptr1)) ? undefined : -1
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

const program = load("input-day15.txt")

class Robot {

	state(position: Position) {
		const p = [position[0], position[1].slice()]
		const computer = new Computer(program)
		computer.input = () => {
			if (p[1].length === 0) {
				throw new Error("path ended")
			}
			return p[1].shift()
		}
		let state: number
		computer.output = (o: number) => {
			if (p[1].length === 0) {
				state = o
				return false
			}
			return true
		}

		computer.compute()
		return state
	}
}

type Point = [number, number]
type Path = number[]
type Position = [Point, Path]

export function findOxygen(): Position {
	let visited: Point[] = []
	function hasVisited(p: Point) {
		return visited.findIndex(v => isEqual(v, p)) !== -1
	}

	let checkPositions: Position[] = [...neighbours([[0, 0], []])]
	while (checkPositions.length > 0) {
		checkPositions.forEach(p => visited.push(p[0]))

		let nextCheckPositions: Position[] = []
		while (checkPositions.length > 0) {
			const check = checkPositions.shift()
			const state = probe(check)
			if (state === 2) {
				return check
			} else if (state === 1) {
				const ns: Position[] = neighbours(check)
					.filter(n => !hasVisited(n[0]))
				nextCheckPositions = nextCheckPositions.concat(ns)
			}
		}
		checkPositions = nextCheckPositions
	}
}

console.log(findOxygen()[1].length)

function isEqual(p1: Point, p2: Point) {
	return p1[0] === p2[0] && p1[1] === p2[1]
}

function probe(p: Position) {
	return new Robot().state(p)
}

function neighbours(p: Position): Position[] {
	return [
		[[p[0][0] + 0, p[0][1] - 1], [...p[1], 1]],
		[[p[0][0] + 0, p[0][1] + 1], [...p[1], 2]],
		[[p[0][0] - 1, p[0][1] + 0], [...p[1], 3]],
		[[p[0][0] + 1, p[0][1] + 0], [...p[1], 4]],
	]
}