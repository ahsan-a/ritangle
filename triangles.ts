type Tri = [number, number, number];
type Coord = [number, number];

// util funcs
function primeFac(n: number) {
	const primes: number[] = [];
	while (n % 2 == 0) {
		primes.push(2);
		n = Math.floor(n / 2);
	}
	for (let i = 3; i <= Math.floor(Math.sqrt(n)); i = i + 2) {
		while (n % i == 0) {
			primes.push(i);
			n = Math.floor(n / i);
		}
	}
	primes.push(n);
	return primes;
}

const duplicates = (arr: number[]) => arr.some((x, i) => arr.indexOf(x) !== i);

function coprimes(sides: Tri) {
	const facs = sides.map((x) => primeFac(x)).map((x) => [...new Set(x)]);

	return !(duplicates([...facs[0], ...facs[1]]) || duplicates([...facs[1], ...facs[2]]) || duplicates([...facs[0], ...facs[2]]));
}

const triangular = new Set([
	0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153, 171, 190, 210, 231, 253, 276, 300, 325, 351, 378, 406, 435, 465, 496, 528,
	561, 595, 630, 666, 703, 741, 780, 820, 861, 903, 946, 990,
]);
const nonZero = [
	[0, 0],
	[0, 2],
	[0, 3],
	[0, 4],
	[0, 5],
	[1, 0],
	[1, 1],
	[1, 3],
	[1, 4],
	[2, 0],
	[2, 2],
	[2, 5],
	[3, 0],
	[3, 3],
];

function permute<T>(inputArr: T[]) {
	let results: T[][] = [];

	function permute(arr: T[], memo: T[] = []) {
		let cur: T[];

		for (var i = 0; i < arr.length; i++) {
			cur = arr.splice(i, 1);
			if (arr.length === 0) {
				results.push(memo.concat(cur));
			}
			permute(arr.slice(), memo.concat(cur));
			arr.splice(i, 0, cur[0]);
		}

		return results;
	}

	return permute(inputArr);
}

// For actual grid
// prettier-ignore
const lineNames = ["oneac", "onedn", "twoac", "twodn","threedn", "fourac", "fivedn", "sixac", "sevendn", "eightac", "ninedn", "tendn", "elevenac", "twelvedn", "thirteenac", "fourteenac"] as const;
type LineName = (typeof lineNames)[number];

interface LineRef {
	coords: Coord[];
}
const newLine = (coords: Coord[]): LineRef => ({ coords });
const lines: Record<LineName, LineRef> = {
	oneac: newLine([
		[0, 0],
		[0, 1],
	]),
	onedn: newLine([
		[0, 0],
		[1, 0],
	]),
	twoac: newLine([
		[0, 2],
		[0, 3],
	]),
	twodn: newLine([
		[0, 2],
		[1, 2],
		[2, 2],
	]),
	threedn: newLine([
		[0, 3],
		[1, 3],
		[2, 3],
	]),
	fourac: newLine([
		[0, 4],
		[0, 5],
	]),
	fivedn: newLine([
		[0, 5],
		[1, 5],
	]),
	sixac: newLine([
		[1, 0],
		[1, 1],
		[1, 2],
	]),
	sevendn: newLine([
		[1, 1],
		[2, 1],
		[3, 1],
	]),
	eightac: newLine([
		[1, 3],
		[1, 4],
		[1, 5],
	]),
	ninedn: newLine([
		[1, 4],
		[2, 4],
		[3, 4],
	]),
	tendn: newLine([
		[2, 0],
		[3, 0],
	]),
	elevenac: newLine([
		[2, 2],
		[2, 3],
	]),
	twelvedn: newLine([
		[2, 5],
		[3, 5],
	]),
	thirteenac: newLine([
		[3, 0],
		[3, 1],
		[3, 2],
	]),
	fourteenac: newLine([
		[3, 3],
		[3, 4],
		[3, 5],
	]),
};

class Grid {
	grid: number[][] = new Array(4).fill(new Array(6));
	constructor(input: Partial<Record<LineName, number>> = {}) {
		for (const lineName in input) {
			this.setLine(lineName as LineName, input[lineName]);
		}
	}

	setLine(lineName: LineName, val: number) {
		const { coords } = lines[lineName];

		const valStr = val.toString();
		if (valStr.length !== coords.length) throw new Error(`${valStr} not the right size for ${lineName}, should be ${coords.length}`);
		for (let i = 0; i < coords.length; i++) {
			console.log(valStr, i, valStr[i], lineName, coords);

			this.yx(coords[i], parseInt(valStr[i]));
		}
	}

	yx(coord: Coord, val?: number) {
		if (val) this.grid[coord[0]][coord[1]] = val;

		return this.grid[coord[0]][coord[1]];
	}

	output() {
		console.log(this.grid);
	}
}

// part one
const topRow: Tri = (() => {
	for (let a = 10; a < 100; a++)
		for (let b = 10; b < 100; b++)
			for (let c = 10; c < 100; c++) {
				// valid triangle:
				if (!(a + b > c && b + c > a && a + c > b)) continue;

				/// triangular perimeter:
				if (!triangular.has(a + b + c)) continue;

				// odd side
				const sides: Tri = [a, b, c];
				if (sides.map((x) => x % 2).reduce((x, acc) => x + acc) !== 3) continue;

				const facs = sides.map((x) => primeFac(x));

				// composite
				if (facs.filter((x) => x.length > 1).length !== 3) continue;

				if (!coprimes(sides)) continue;

				return sides;
			}

	return [0, 0, 0];
})();
/// therefore, 69,77,85 is our values

const primTwo = (() => {
	const prims: Tri[] = [];
	for (let a = 10; a < 100; a++)
		for (let b = 10; b < 100; b++)
			for (let c = 10; c < 100; c++) {
				// valid triangle:
				if (!(a + b > c && b + c > a && a + c > b)) continue;

				/// right angled triangle
				if (a * a + b * b !== c * c) continue;

				/// coprimes
				const sides: Tri = [a, b, c];

				if (!coprimes(sides)) continue;
				prims.push(sides);
			}

	return prims;
})();
const primThree = (() => {
	const prims: Tri[] = [];
	for (let a = 10; a < 100; a++)
		for (let b = 100; b < 1000; b++)
			for (let c = 100; c < 1000; c++) {
				// valid triangle:
				if (!(a + b > c && b + c > a && a + c > b)) continue;

				/// right angled triangle
				if (a * a + b * b !== c * c) continue;

				/// coprimes
				const sides: Tri = [a, b, c];

				if (!coprimes(sides)) continue;
				prims.push(sides);
			}

	return prims;
})();

main: for (const top of permute(topRow))
	for (const _two of primTwo)
		for (const two of permute(_two)) {
			// every combo of toprow and second row here.

			for (const _three of primThree)
				for (const three of permute(_three.slice(1)).map((x) => [_three[0], ...x])) {
					for (const _four of primThree)
						for (const four of permute(_four.slice(1)).map((x) => [_four[0], ...x])) {
							const grid = new Grid({
								oneac: top[0],
								twoac: top[1],
								fourac: top[2],
								elevenac: two[0],
								tendn: two[1],
								twelvedn: two[2],
								onedn: three[0],
								thirteenac: three[1],
								sevendn: three[2],
								fivedn: four[0],
								fourteenac: four[1],
								ninedn: four[2],
							});
							grid.output();
							break main;
						}
				}
		}
