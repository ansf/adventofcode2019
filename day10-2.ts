import * as fs from "fs"
import { fileURLToPath } from "url"

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

//const input = ".#....#####...#..\n##...##.#####..##\n##...#...#.#####.\n..#.....X...###..\n..#.#.....#....##"
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

const dirs = Array.from(ds).map(d => JSON.parse(d) as [number, number])
	.map(d => [...d, Math.atan2(d[1], d[0]) * 180 / Math.PI - 270])
	.map(d => [d[0], d[1], (2 * 360 + d[2]) % 360])
	.sort((a, b) => a[2] - b[2])
	.map(d => [d[0], d[1]] as const)

function shoot(x: number, y: number, d: readonly [number, number]): [number, number] | undefined {
	do {
		x += d[0]
		y += d[1]
		if (x < 0 || x >= w) {
			return undefined
		}
		if (y < 0 || y >= h) {
			return undefined
		}
		if (image[x][y] == "#") {
			image[x][y] = "x"
			return [x, y]
		}
	} while (true)
}

let p = [17, 23]
//let p = [8, 3]
let count = 0
let i = 0

while (true) {
	const d = dirs[i++ % dirs.length]
	const shot = shoot(p[0], p[1], d)
	if (shot) {
		count++
		print(image)
	}
	if (count == 200) {
		console.log(shot)
		console.log("---")
		break
	}
}

