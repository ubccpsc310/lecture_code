import * as fs from "fs";
import { book } from "./bookings";

const USAGE = `rooms — study room bookings

  book <room> <student> <date> <start> <end>   e.g. book IKB-261 alex 2026-11-03 10:00 12:00
`;

export function run(argv: string[]): string {
	const [command, ...args] = argv;
	if (command === "book" && args.length === 5) {
		const [room, student, date, start, end] = args;
		return book(fs, room, student, date, start, end);
	}
	return USAGE;
}

if (require.main === module) {
	console.log(run(process.argv.slice(2)));
}
