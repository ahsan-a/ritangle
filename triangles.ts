import { Coord, Tri, coprimes, coprimesTwo, getDigits, permute, squares } from './utils.ts';
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
// For actual grid
// prettier-ignore
const lineNames = ["oneac", "onedn", "twoac", "twodn","threedn", "fourac", "fivedn", "sixac", "sevendn", "eightac", "ninedn", "tendn", "elevenac", "twelvedn", "thirteenac", "fourteenac"] as const;
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
	grid: number[][] = new Array(4).fill(0).map((_) => new Array(6).fill(null));
	constructor(input: Partial<Record<LineName, number>> = {}) {
		for (const lineName in input) {
			this.setLine(lineName as LineName, input[lineName]);
		}
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

// part one
// const topRow: Tri = (() => {
// 	for (let a = 10; a < 100; a++)
// 		for (let b = 10; b < 100; b++)
// 			for (let c = 10; c < 100; c++) {
// 				// valid triangle:
// 				if (!(a + b > c && b + c > a && a + c > b)) continue;

// 				/// triangular perimeter:
// 				if (!triangular.has(a + b + c)) continue;

// 				// odd side
// 				const sides: Tri = [a, b, c];
// 				if (sides.map((x) => x % 2).reduce((x, acc) => x + acc) !== 3) continue;

// 				const facs = sides.map((x) => primeFac(x));

// 				// composite
// 				if (facs.filter((x) => x.length > 1).length !== 3) continue;

// 				if (!coprimes(sides)) continue;

// 				return sides;
// 			}

// 	return [0, 0, 0];
// })();

/// therefore, 69,77,25 is our values
const topRow: Tri = [85, 69, 77];

const primTwo = (() => {
	const prims: Tri[] = [];
	for (let m = 2; m * m < 100; m++) {
		for (let n = 1; n < m; n++) {
			if ((m - n) % 2 === 0 || !coprimesTwo([m, n])) continue;
			const a = m * m - n * n;
			const b = 2 * m * n;
			const c = m * m + n * n;

			// Ensure values are within the desired range
			if (a < 10 || b < 10 || c < 10 || a >= 100 || b >= 100 || c >= 100) continue;

			// Ensure a ≤ b
			const sides: Tri = [a, b, c].sort((x, y) => x - y) as Tri;

			prims.push(sides);
		}
	}
	return prims;
})();

const primThree = (() => {
	const prims: Tri[] = [];
	for (let a = 10; a < 100; a++)
		for (let b = 100; b < 1000; b++)
			for (let c = b + 1; c < 1000; c++) {
				/// right angled triangle
				if (a * a + b * b !== c * c) continue;

				/// coprimes
				const sides: Tri = [a, b, c];
				if (!coprimes(sides)) continue;

				prims.push(sides);
			}

	return prims;
})();

let test = 0;

const part1: Grid[] = [];
// 6
baseGrids: for (const top of permute(topRow)) {
	// *6 = 66
	for (const _two of primTwo) {
		// *6 = 396
		for (const two of permute(_two)) {
			// every combo of toprow and second row here.
			// *43 = 17028
			for (const _three of primThree) {
				// *2 = 34056
				threeBreak: for (const three of [
					[_three[0], _three[1], _three[2]],
					[_three[0], _three[2], _three[1]],
				]) {
					for (const _four of primThree) {
						fourBreak: for (const four of permute(_four.slice(1)).map((x) => [_four[0], ...x])) {
							try {
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
								if (two[1] === 83) console.log('here2');
								part1.push(grid);
							} catch (e) {
								if (e.message === 'overwrite') continue;
								else {
									if (['fivedn', 'fourteenac', 'ninedn'].includes(e.message)) continue fourBreak;
									if (['onedn', 'thirteenac', 'sevendn'].includes(e.message)) continue threeBreak;
									else throw e;
									continue;
								}
							}
						}
					}
				}
			}
		}
	}
}

// pt2: find nulls, get all possible combos and then check conditions
for (const base of part1) {
	// GENERIC
	const nulls = base.nulls;
	for (let i = 1; i < Math.pow(10, nulls.length); i++) {
		if (i % 10 === 0) continue;

		const digits = getDigits(i);
		if (digits.length !== nulls.length) for (let j = digits.length; j < nulls.length; j++) digits.unshift(0);

		for (let j = 0; j < nulls.length; j++) {
			base.yx(nulls[j], digits[j]);
		}

		if (!squares.has(base.getLine('twodn') + base.getLine('threedn'))) continue;

		// check perimeters
		const all: number[] = [];
		const perim = base.getLine('oneac') + base.getLine('twoac') + base.getLine('fourac'); // 231
		for (const lineName of lineNames) all.push(base.getLine(lineName));
		if (all.length !== new Set(all).size) continue;

		for (let i = 0; i < all.length; i++)
			for (let j = i + 1; j < all.length; j++) {
				if (all[i] - all[j] === perim || all[j] - all[i] === perim) console.log(base.grid, all[i], all[j]);
			}
	}
	/// -----
}

console.log('done');
