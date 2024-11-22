interface Point {
	x: number;
	y: number;
	z: number;
}
const point = (x: number, y: number, z: number): Point => ({ x, y, z });
const dist = (a: Point, b: Point) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2));

const coords = (t: number) => ({
	p: point(2, Math.cos(t), Math.sin(t)),
	q: point(Math.sin(t), 2, Math.cos(t)),
});

const inc = 0.0000001;
let maxa = 0;
let maxt = 0;

for (let i = 0; i <= 2; i += inc) {
	const t = Math.PI * i;

	const tri = coords(t);

	const x = dist(tri.p, tri.q);

	const area = (Math.sqrt(3) / 4) * x * x;

	if (area > maxa) {
		maxa = area;
		maxt = t;
	}
}

console.log(maxt * maxa);
