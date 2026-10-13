import { BookingDesk } from "./core/BookingDesk";
import { BookingStore } from "./core/BookingStore";
import { JsonBookingStore } from "./adapters/JsonBookingStore";

const DATA_FILE = "data/bookings.json";

const USAGE = `rooms — study room bookings

  book <room> <student> <date> <start> <end>   e.g. book IKB-261 alex 2026-11-03 10:00 12:00
  list <date>                                  e.g. list 2026-11-03
`;

export function run(argv: string[], store: BookingStore): string {
	const desk = new BookingDesk(store);
	const [command, ...args] = argv;
	if (command === "book" && args.length === 5) {
		const [room, student, date, start, end] = args;
		const refusal = desk.book({ room, student, date, start, end });
		if (refusal !== undefined) {
			return `Can't book: ${refusal}`;
		}
		return `Booked ${room} for ${student} on ${date}, ${start}–${end}`;
	}
	if (command === "list" && args.length === 1) {
		const bookings = desk.schedule(args[0]);
		if (bookings.length === 0) {
			return `No bookings on ${args[0]}`;
		}
		return bookings.map((each) => `${each.start}–${each.end}  ${each.room}  ${each.student}`).join("\n");
	}
	return USAGE;
}

if (require.main === module) {
	console.log(run(process.argv.slice(2), new JsonBookingStore(DATA_FILE)));
}
