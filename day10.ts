import * as fs from "fs"

const abs = Math.abs

function flip<T>(a: T[][]) {
	const flipped = Array.from(Array(a[0].length)).map(() => Array.from(Array(a.length)))
	for (let x = 0; x < flipped.length; x++) {
		for (let y = 0; y < flipped[0].length; y++) {
			flipped[x][y] = a[y][x]
		}
	}
	return flipped
}

function print<T>(a: T[][]) {
	for (let y = 0; y < a[0].length; y++) {
		console.log(Array(a.length).fill(0).map((_, x) => a[x][y]).join(""))
	}
}

function gcd(a: number, b: number) {
	if (a == 0) return abs(b)
	if (b == 0) return abs(a)

	let h: number
	do {
		h = a % b
		a = b
		b = h
	} while (b != 0)
	return abs(a)
}

function cancel(f: [number, number]) {
	let [a, b] = f
	let d: number
	do {
		d = gcd(a, b)
		a /= d
		b /= d
	} while (d !== 1)
	return [a, b]
}

const input = fs.readFileSync("input-day10.txt", "utf8")

const image = flip(input
	.split("\n")
	.map(l => l.split("")))

const w = image.length
const h = image[0].length

const ds = new Set<string>()
for (let x = -w + 1; x < w; x++) {
	for (let y = -h + 1; y < h; y++) {
		if (x === 0 && y === 0) {
			continue
		}
		ds.add(JSON.stringify(cancel([x, y])))
	}
}

const dirs = Array.from(ds).map(d => JSON.parse(d))

function count(x: number, y: number): number {
	if (image[x][y] != "#") {
		return 0
	}

	return dirs.map(d => countDir(x, y, d)).reduce((a, v) => a + v, 0)
}

function countDir(x: number, y: number, d: [number, number]): number {
	do {
		x += d[0]
		y += d[1]
		if (x < 0 || x >= w) {
			return 0
		}
		if (y < 0 || y >= h) {
			return 0
		}
		if (image[x][y] == "#") {
			return 1
		}
	} while (true)
}

let best = [0, -1, -1]
for (let x = 0; x < w; x++) {
	for (let y = 0; y < h; y++) {
		const c = count(x, y)
		if (c > best[0]) {
			best = [c, x, y]
		}
	}
}
print(image)
console.log(best)