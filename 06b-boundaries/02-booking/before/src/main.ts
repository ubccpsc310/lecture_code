import * as fs from "fs";
import { book } from "./bookings";
import { BookingStore } from "./core/BookingStore";
import { JsonBookingStore } from "./adapters/JsonBookingStore";

const DATA_FILE = "data/bookings.json";

const USAGE = `rooms — study room bookings

  book <room> <student> <date> <start> <end>   e.g. book IKB-261 alex 2026-11-03 10:00 12:00
`;

export function run(argv: string[], store: BookingStore): string {
	const [command, ...args] = argv;
	if (command === "book" && args.length === 5) {
		const [room, student, date, start, end] = args;
		// TODO: book through the core's book(), with store, instead of through src/bookings.ts
		return book(fs, room, student, date, start, end);
	}
	return USAGE;
}

if (require.main === module) {
	console.log(run(process.argv.slice(2), new JsonBookingStore(DATA_FILE)));
}
