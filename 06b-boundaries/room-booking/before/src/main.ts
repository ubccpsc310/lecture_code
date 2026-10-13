import { book, schedule } from "./bookings";

const USAGE = `rooms — study room bookings

  book <room> <student> <date> <start> <end>   e.g. book IKB-261 alex 2026-11-03 10:00 12:00
  list <date>                                  e.g. list 2026-11-03
`;

export function run(argv: string[]): string {
	const [command, ...args] = argv;
	if (command === "book" && args.length === 5) {
		const [room, student, date, start, end] = args;
		return book(room, student, date, start, end);
	}
	if (command === "list" && args.length === 1) {
		return schedule(args[0]);
	}
	return USAGE;
}

if (require.main === module) {
	console.log(run(process.argv.slice(2)));
}
