import { expect } from "chai";
import { run } from "../src/main";
import { JsonBookingStore } from "../src/adapters/JsonBookingStore";
import { tempFile } from "./tempFile";

// End-to-end tests: a command in through run(), the real core, and a real JsonBookingStore underneath.
describe("rooms, end to end", () => {
	let file: string;

	beforeEach(() => {
		file = tempFile("bookings.json");
	});

	/** Runs one command, with a new store on the same file, the way each `yarn start` does. */
	function rooms(...argv: string[]): string {
		return run(argv, new JsonBookingStore(file));
	}

	it("refuses a booking that overlaps one made by an earlier command", () => {
		expect(rooms("book", "IKB-261", "alex", "2026-11-03", "10:00", "12:00")).to.equal(
			"Booked IKB-261 for alex on 2026-11-03, 10:00–12:00"
		);
		expect(rooms("book", "IKB-261", "sam", "2026-11-03", "11:00", "12:00")).to.equal(
			"Can't book: IKB-261 is already booked 10:00–12:00"
		);
	});
});
