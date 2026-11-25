// This file was generated with AI wahoo
//
// Zero dependencies (uses Node's built-in fetch). Start the API first, then in another terminal:
//
//   npx tsx bench.ts                          # defaults: http://localhost:3000, 20 requests each
//   npx tsx bench.ts http://localhost:3000 50 # base URL, then number of requests per endpoint
//   npx tsx bench.ts http://localhost:3000 20 2000 # ...then how many schedules to seed (default 500)

const BASE = process.argv[2] ?? "http://localhost:3000";
const N = Number(process.argv[3] ?? 20);
const SEED = Number(process.argv[4] ?? 500); // schedules to create first: GET /schedules reads one file per schedule
const WARMUP = 3; // requests thrown away before measuring (JIT, connection setup)

const ROOMS = [
	{ id: "DMP 110", capacity: 150 },
	{ id: "DMP 310", capacity: 80 },
	{ id: "ICCS 005", capacity: 40 },
];

// Same shape as SMALL in test/fixtures.ts: 3 sections, ~60 ms of "scheduling" work per POST.
const SMALL = {
	sections: [
		{ id: "CPSC 310 101", size: 120 },
		{ id: "CPSC 310 L1A", size: 30 },
		{ id: "CPSC 310 L1B", size: 30 },
	],
	rooms: ROOMS,
};

async function getSchedules(): Promise<void> {
	const res = await fetch(`${BASE}/schedules`);
	if (!res.ok) throw new Error(`GET /schedules -> ${res.status}`);
	await res.json(); // include time to receive the whole body
}

async function postSchedule(): Promise<void> {
	const res = await fetch(`${BASE}/schedules`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(SMALL),
	});
	if (!res.ok) throw new Error(`POST /schedules -> ${res.status}`);
	await res.json();
}

/** Time `n` sequential calls (after a short warm-up). Returns each call's duration in ms. */
async function time(call: () => Promise<void>, n: number): Promise<number[]> {
	for (let i = 0; i < WARMUP; i++) await call();
	const samples: number[] = [];
	for (let i = 0; i < n; i++) {
		const start = performance.now();
		await call();
		samples.push(performance.now() - start);
	}
	return samples;
}

function report(label: string, samples: number[]): void {
	const sorted = [...samples].sort((a, b) => a - b);
	const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
	const p95 = sorted[Math.min(sorted.length - 1, Math.ceil(0.95 * sorted.length) - 1)];
	console.log(
		`${label.padEnd(16)} avg ${mean.toFixed(1).padStart(7)} ms` +
			`   min ${sorted[0].toFixed(1).padStart(7)}   p95 ${p95.toFixed(1).padStart(7)}   max ${sorted[sorted.length - 1].toFixed(1).padStart(7)}   (n=${samples.length})`
	);
}

async function main(): Promise<void> {
	console.log(`Target: ${BASE}   (${N} requests per endpoint, sequential)\n`);

	// Seed in parallel batches so a big list does not take minutes at ~60 ms per POST.
	for (let done = 0; done < SEED; done += 25) {
		await Promise.all(Array.from({ length: Math.min(25, SEED - done) }, postSchedule));
	}
	console.log(`Seeded ${SEED} schedules.`);

	// GET first, while the number of schedules is fixed, so every GET sees the same data.
	report("GET /schedules", await time(getSchedules, N));
	report("POST /schedules", await time(postSchedule, N));

	// Read again after the POSTs: with a cache that is not invalidated, this is where staleness would show.
	const after = await (await fetch(`${BASE}/schedules`)).json();
	const expected = SEED + WARMUP + N; // seed + POST warm-up + measured POSTs
	console.log(`\nGET /schedules now returns ${after.length} schedules (expected ${expected}).`);
	if (after.length !== expected) console.log("-> The list is out of date: that is the cost of caching.");
}

main().catch((err) => {
	console.error(`${err}\n(Is the API running at ${BASE}?)`);
	process.exit(1);
});
