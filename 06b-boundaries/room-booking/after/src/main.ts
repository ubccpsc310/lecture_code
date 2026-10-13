import { BookingStore } from "./core/BookingStore";
import { book } from "./core/rooms";
import { JsonBookingStore } from "./adapters/JsonBookingStore";

const DATA_FILE = "data/bookings.json";

const USAGE = `rooms — study room bookings

  book <room> <student> <date> <start> <end>   e.g. book IKB-261 alex 2026-11-03 10:00 12:00
`;

export function run(argv: string[], store: BookingStore): string {
	const [command, ...args] = argv;
	if (command === "book" && args.length === 5) {
		const [room, student, date, start, end] = args;
		const refusal = book(store, { room, student, date, start, end });
		if (refusal !== undefined) {
			return `Can't book: ${refusal}`;
		}
		return `Booked ${room} for ${student} on ${date}, ${start}–${end}`;
	}
	return USAGE;
}

if (require.main === module) {
	console.log(run(process.argv.slice(2), new JsonBookingStore(DATA_FILE)));
}
