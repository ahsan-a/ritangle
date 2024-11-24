import { Coord, Tri, happy, lucky, cube, getDigits, permute, lucas, cullen, divdiv, primeFac, primes, harshad, squares } from './utils.ts';

const _nonZero = [
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
// For actual grid
const lineNames = [
	'oneac',
	'onedn',
	'twodn',
	'threeac',
	'fourdn',
	'fivedn',
	'sixac',
	'sixdn',
	'sevendn',
	'eightac',
	'ninedn',
	'tenac',
	'elevendn',
	'twelveac',
	'thirteendn',
	'fourteendn',
	'fifteenac',
	'sixteenac',
	'seventeenac',
	'eighteendn',
	'nineteenac',
	'twentyac',
	'twentyoneac',
] as const;
type LineName = (typeof lineNames)[number];

interface LineRef {
	coords: Coord[];
	maxL: number;
}
const newLine = (coords: Coord[]): LineRef => ({ coords, maxL: coords.length });
const lines: Record<LineName, LineRef> = {
	oneac: newLine([
		[0, 0],
		[0, 1],
		[0, 2],
	]),
	onedn: newLine([
		[0, 0],
		[1, 0],
	]),
	twodn: newLine([
		[0, 2],
		[1, 2],
		[2, 2],
		[3, 2],
	]),
	threeac: newLine([
		[0, 3],
		[0, 4],
		[0, 5],
	]),
	fourdn: newLine([
		[0, 4],
		[1, 4],
		[2, 4],
		[3, 4],
	]),
	fivedn: newLine([
		[0, 5],
		[1, 5],
		[2, 5],
	]),
	sixac: newLine([
		[0, 6],
		[0, 7],
		[0, 8],
	]),
	sixdn: newLine([
		[0, 6],
		[1, 6],
		[2, 6],
		[3, 6],
	]),
	sevendn: newLine([
		[0, 8],
		[1, 8],
	]),
	eightac: newLine([
		[1, 0],
		[1, 1],
	]),
	ninedn: newLine([
		[1, 1],
		[2, 1],
	]),
	tenac: newLine([
		[1, 2],
		[1, 3],
		[1, 4],
	]),
	elevendn: newLine([
		[1, 3],
		[2, 3],
		[3, 3],
	]),
	twelveac: newLine([
		[1, 5],
		[1, 6],
		[1, 7],
	]),
	thirteendn: newLine([
		[1, 7],
		[2, 7],
	]),
	fourteendn: newLine([
		[2, 0],
		[3, 0],
	]),
	fifteenac: newLine([
		[2, 1],
		[2, 2],
		[2, 3],
	]),
	sixteenac: newLine([
		[2, 4],
		[2, 5],
		[2, 6],
	]),
	seventeenac: newLine([
		[2, 7],
		[2, 8],
	]),
	eighteendn: newLine([
		[2, 8],
		[3, 8],
	]),
	nineteenac: newLine([
		[3, 0],
		[3, 1],
		[3, 2],
	]),
	twentyac: newLine([
		[3, 3],
		[3, 4],
		[3, 5],
	]),
	twentyoneac: newLine([
		[3, 6],
		[3, 7],
		[3, 8],
	]),
};

class Grid {
	grid: number[][] = new Array(4).fill(0).map((_) => new Array(9).fill(null));
	constructor(input: Partial<Record<LineName, number>> = {}) {
		for (const lineName of Object.keys(input) as LineName[]) {
			this.setLine(lineName, input[lineName] ?? 0);
		}
	}

	set setGrid(grid: number[][]) {
		this.grid = grid;
	}

	getLine(lineName: LineName) {
		const { coords, maxL } = lines[lineName];
		let value = 0;

		for (let i = maxL - 1; i >= 0; i--) {
			value += this.yx(coords[maxL - 1 - i]) * Math.pow(10, i);
		}

		return value;
	}

	setLine(lineName: LineName, val: number) {
		const { coords, maxL } = lines[lineName];

		const valStr = val.toString();
		if (valStr.length !== maxL) throw new RangeError(`${valStr} not the right size for ${lineName}, should be ${maxL}`);
		for (let i = 0; i < maxL; i++) {
			const current = this.yx(coords[i]);
			if (!(current === parseInt(valStr[i]) || current === null)) {
				throw new Error(lineName);
			}
		}
		for (let i = 0; i < maxL; i++) {
			this.yx(coords[i], parseInt(valStr[i]));
		}
	}

	yx(coord: Coord, val?: number) {
		if (typeof val !== 'undefined') this.grid[coord[0]][coord[1]] = val;

		return this.grid[coord[0]][coord[1]];
	}

	get nulls() {
		const nulls: Coord[] = [];
		for (let i = 0; i < this.grid.length; i++)
			for (let j = 0; j < this.grid[i].length; j++) {
				if (this.grid[i][j] === null) nulls.push([i, j]);
			}
		return nulls;
	}

	output() {
		console.log(this.grid);
	}
}

// pt1: all top rows and bottom rows with no repeating digits
// top: happy, lucky, cube
const validTop: Tri[] = [];
for (const h of happy) {
	for (const l of lucky) {
		for (const c of cube) {
			if (h < 100 || l < 100 || c < 100) continue;
			if (h > 999 || l > 999 || c > 999) continue;
			const digits = [...getDigits(h), ...getDigits(l), ...getDigits(c)];
			if (digits.length === new Set(digits).size) validTop.push([h, l, c]);
		}
	}
}

// const validBottom: Tri[] = [];
// for (const s of squares) {
// 	for (const t of triangular) {
// 		for (const f of fibonacci) {
// 			if (s < 100 || t < 100 || f < 100) continue;
// 			if (s > 999 || t > 999 || f > 999) continue;

// 			const digits = [...getDigits(s), ...getDigits(t), ...getDigits(f)];
// 			if (digits.length !== new Set(digits).size) continue;

// 			validBottom.push([s, t, f]);
// 		}
// 	}
// }
// console.log(validBottom);

// through inspection:
// const validBottom = [
// 	[561, 987, 324],
// 	[561, 324, 987],
// ];

// // oh no...
// const oneDnPossible = [47, 12, 18, 27, 36, 54, 81];
// const oneDnStarts = new Set([4, 1, 2, 3, 5, 8]);

// const possible: Grid[] = [];
// let acc = 0;
// for (const _top of validTop) {
// 	console.log(possible.length, acc);
// 	BTop: for (const top of permute(_top)) {
// 		if (!oneDnStarts.has(getDigits(top[0])[0])) continue BTop;
// 		for (const bottom of validBottom) {
// 			for (const butron of lucas) {
// 				for (const killem of cullen) {
// 					for (const divdivdiv of divdiv) {
// 						BSixteenac: for (const divdivdivdiv of divdiv) {
// 							BOnedn: for (const onedn of oneDnPossible)
// 								BSevendn: for (const sevendn of [...new Set(primeFac(top[1]))]
// 									.filter((x) => x > 9 && x < 100)
// 									.filter((x) => getDigits(x)[0] === getDigits(top[2])[2])) {
// 									try {
// 										acc++;
// 										const grid = new Grid({
// 											oneac: top[0],
// 											threeac: top[1],
// 											sixac: top[2],
// 											tenac: divdivdiv,
// 											twelveac: butron,
// 											fifteenac: killem,
// 											sixteenac: divdivdivdiv,
// 											nineteenac: bottom[0],
// 											twentyac: bottom[1],
// 											twentyoneac: bottom[2],
// 											onedn,
// 											sevendn,
// 											fourteendn: 15,
// 										});

// 										if (!primes.has(grid.getLine('twodn')) || !primes.has(grid.getLine('sixdn'))) continue BSixteenac;
// 										if (!harshad.has(grid.getLine('elevendn') - grid.getLine('fivedn'))) continue BSixteenac;
// 										if (!squares.has(getDigits(grid.getLine('fourdn')).reduce((acc, x) => acc + Math.pow(x, 3)))) continue BSixteenac;
// 										possible.push(grid);
// 									} catch (error) {
// 										const e = error as Error;
// 										switch (e.message) {
// 											case 'sevendn':
// 												continue BSevendn;
// 											case 'onedn':
// 												continue BOnedn;
// 										}

// 										continue;
// 									}
// 								}
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// }

// Deno.writeTextFileSync('./valid.json', JSON.stringify(possible));
// console.log(acc);

const valid: { grid: number[][] }[] = JSON.parse(Deno.readTextFileSync('./valid.json'));

for (const _base of valid) {
	const base = new Grid();
	base.setGrid = _base.grid;
}
