import { promises as fs } from "fs";
import * as os from "os";
import * as path from "path";

const ROOMS = [
	{ id: "DMP 110", capacity: 150 },
	{ id: "DMP 310", capacity: 80 },
	{ id: "ICCS 005", capacity: 40 },
];

/** A small request: 3 sections. Takes well under 100 ms. */
export const SMALL = {
	sections: [
		{ id: "CPSC 310 101", size: 120 },
		{ id: "CPSC 310 L1A", size: 30 },
		{ id: "CPSC 310 L1B", size: 30 },
	],
	rooms: ROOMS,
};

/** A big request: 100 sections. Takes about 2 seconds. */
export const BIG = {
	sections: Array.from({ length: 100 }, (_, i) => ({ id: `SECTION ${i + 1}`, size: 20 + (i % 5) * 30 })),
	rooms: ROOMS,
};

/** A new, empty directory for a Store to save into. */
export function freshDir(): Promise<string> {
	return fs.mkdtemp(path.join(os.tmpdir(), "schedules-"));
}
