import { expect } from "chai";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { run } from "../src/main";
import { JsonBookingStore } from "../src/adapters/JsonBookingStore";

// End-to-end tests: commands in through run(), the real core, and the real JSON store underneath.
// Each command gets a new store, like each `yarn start` does.
describe("rooms, end to end", () => {
	let file: string;

	function rooms(...argv: string[]): string {
		return run(argv, new JsonBookingStore(file));
	}

	beforeEach(() => {
		file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "rooms-")), "bookings.json");
	});

	afterEach(() => {
		fs.rmSync(path.dirname(file), { recursive: true, force: true });
	});

	it("books a room, then lists it", () => {
		expect(rooms("book", "IKB-261", "alex", "2026-11-03", "10:00", "12:00")).to.equal(
			"Booked IKB-261 for alex on 2026-11-03, 10:00–12:00"
		);
		expect(rooms("list", "2026-11-03")).to.equal("10:00–12:00  IKB-261  alex");
	});

	it("refuses a booking that overlaps one made by an earlier command", () => {
		rooms("book", "IKB-261", "alex", "2026-11-03", "10:00", "12:00");
		expect(rooms("book", "IKB-261", "sam", "2026-11-03", "11:00", "12:00")).to.equal(
			"Can't book: IKB-261 is already booked 10:00–12:00"
		);
		expect(rooms("list", "2026-11-03")).to.equal("10:00–12:00  IKB-261  alex");
	});
});
