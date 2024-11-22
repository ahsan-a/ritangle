interface Grid {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	f: number;
	g: number;
	h: number;
	n: number;
}

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
const squares = [
	0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625, 676, 729, 784, 841, 900, 961,
];

const onedn = (g: Grid) => g.a * 100 + g.h * 10 + g.g;
const twodn = (g: Grid) => g.b * 10 + g.n;
const threeac = (g: Grid) => g.n * 10 + g.d;
const fourdn = (g: Grid) => g.d * 10 + g.e;
const fiveac = (g: Grid) => g.g * 100 + g.f * 10 + g.e;

// prettier-ignore
for (let a = 2; a <= 5; a++) for (let b = 0; b <= 9; b++) for (let c = 0; c <= 6; c++) for (let d = 0; d <= 9; d++) for (let e = 6; e <= 9; e++) for (let f = 0; f <= 9; f++) for (let g = 1; g <= 6; g++) for (let h = 0; h <= 9; h++) for (let n = 2; n <= 4; n+=2) {
   const gr: Grid = { a, b, c, d, e, f, g, h, n };

   if (twodn(gr) !== a*b*c + a*h*g) continue;
   if (!squares.includes(fiveac(gr) - fourdn(gr))) continue;
   if (threeac(gr) !== fourdn(gr) - d - e) continue;
   if (!primes.includes(g+f+e)) continue;

   console.log(gr);
   
}
