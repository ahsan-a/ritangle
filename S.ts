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

function primeFac(n: number) {
	const primes: number[] = [];
	// Print the number of 2s that divide n
	while (n % 2 == 0) {
		primes.push(2);
		n = Math.floor(n / 2);
	}

	// n must be odd at this point.
	// So we can skip one element
	// (Note i = i +2)
	for (let i = 3; i <= Math.floor(Math.sqrt(n)); i = i + 2) {
		// While i divides n, print i
		// and divide n
		while (n % i == 0) {
			primes.push(i);
			n = Math.floor(n / i);
		}
	}

	// This condition is to handle the
	// case when n is a prime number
	// greater than 2
	primes.push(n);
	return primes;
}
const pos = (g: Grid) => `${g.a * 10 + g.b}°${g.c * 10 + g.d}'N ${g.e * 10 + g.f}°${g.g * 10 + g.h}'W n=${g.n}`;
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
const squares = [
	0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625, 676, 729, 784, 841, 900, 961,
];
const tri = [
	0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153, 171, 190, 210, 231, 253, 276, 300, 325, 351, 378, 406, 435, 465, 496, 528,
	561, 595, 630, 666, 703, 741, 780, 820, 861, 903, 946, 990,
];

const oneac = (g: Grid) => g.a * 100 + g.b * 10 + g.c;
const onedn = (g: Grid) => g.a * 100 + g.h * 10 + g.g;
const twodn = (g: Grid) => g.b * 10 + g.n;
const threeac = (g: Grid) => g.n * 10 + g.d;
const fourdn = (g: Grid) => g.d * 10 + g.e;
const fiveac = (g: Grid) => g.g * 100 + g.f * 10 + g.e;

// prettier-ignore
for (let a = 2; a <= 5; a++) for (let b = 0; b <= 9; b++) for (let c = 0; c <= 6; c++) for (let d = 0; d <= 9; d++) for (let e = 6; e <= 9; e++) for (let f = 0; f <= 9; f++) for (let g = 1; g <= 6; g++) for (let h = 0; h <= 9; h++) for (let n = 2; n <= 4; n+=2) {
   const gr: Grid = { a, b, c, d, e, f, g, h, n };

	if (!tri.includes(threeac(gr) + fourdn(gr))) continue;
	if (b !== d) continue;
	if (fiveac(gr) !== onedn(gr) + threeac(gr) + fourdn(gr)) continue;
	if (primeFac(oneac(gr)).length ===1 )continue;
   console.log(pos(gr));
   
}
