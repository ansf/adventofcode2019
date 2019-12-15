import * as fs from "fs"

const input = fs.readFileSync("input-day14.txt", "utf8")
const lines = input.trim().split("\n")
const recipes = lines
    .map(line => {
        const [i, o] = line.split("=>")
        return [i.split(",").map(s => s.trim()).map(parse), parse(o.trim())] as const
    })
    .reduce((a, v) => {
        a.set(v[1][1], v)
        return a
    }, new Map<Element, Recipe>())

function parse(ingredient: string): Ingredient {
    const [c, n] = ingredient.split(" ")
    return [Number(c), n]
}

function print(recipe: Recipe) {
    console.log(recipe[0].map(i => `${i[0]} ${i[1]}`).join(", "), " => ", recipe[1][0], recipe[1][1])
}

type Quantity = number
type Element = string
type Ingredient = readonly [Quantity, Element]
type Recipe = readonly [Ingredient[], Ingredient]

class Bag {
    private readonly bag = new Map<Element, Quantity>()
    get(e: Element) {
        return this.bag.get(e) ?? 0
    }
    add(e: Element, q: Quantity) {
        this.bag.set(e, Math.max(0, q + this.get(e)))
    }
    remove(e: Element, q: Quantity) {
        this.add(e, -q)
    }
    delete(e: Element) {
        this.bag.delete(e)
    }
    entries() {
        return this.bag.entries()
    }
    get size() {
        return this.bag.size
    }
}


function oreForFuel(quantity: Quantity) {
    const need = new Bag()
    need.add("FUEL", quantity)

    const spares = new Bag()

    do {
        const [e, q] = Array.from(need.entries()).filter(([e,]) => e !== "ORE")[0]
        need.delete(e)

        const needs = ingredients(recipes.get(e), q, spares)
        needs.forEach(([q, e]) => {
            need.add(e, q)
        })
    } while (need.size > 1)
    return need.get("ORE")
}

function ingredients(recipe: Recipe, quantity: Quantity, spares: Bag): Ingredient[] {
    const e = recipe[1][1]

    const spare = spares.get(e)
    quantity = Math.max(0, quantity - spare)
    spares.remove(e, quantity)
    if (quantity === 0) {
        return []
    }

    const factor = Math.ceil(quantity / recipe[1][0])
    const producing = recipe[1][0] * factor
    spares.add(e, producing - quantity)
    return recipe[0].map(r => ([r[0] * factor, r[1]]))
}

const maxOre = 1000000000000
let fuelL = 1
let fuelU = 1000000000000

do {
    let fuel = fuelL + Math.floor((fuelU - fuelL) / 2)
    let ore = oreForFuel(fuel)
    if (ore < maxOre && oreForFuel(fuel + 1) > maxOre) {
        console.log(fuel)
        break
    }
    if (ore > maxOre) {
        fuelU = fuel - 1
    } else if (ore < maxOre) {
        fuelL = fuel + 1
    }
} while (true)