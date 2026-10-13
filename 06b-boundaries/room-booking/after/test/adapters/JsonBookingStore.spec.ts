import { expect } from "chai";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Booking } from "../../src/core/Booking";
import { JsonBookingStore } from "../../src/adapters/JsonBookingStore";
import { bookingStoreContract } from "../bookingStoreContract";

const SAM_10_TO_12: Booking = { room: "IKB-261", student: "sam", date: "2026-11-03", start: "10:00", end: "12:00" };

// Integration tests: a real JsonBookingStore, writing a real file in a fresh temporary directory.
describe("JsonBookingStore", () => {
	let file: string;

	beforeEach(() => {
		file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "rooms-")), "bookings.json");
	});

	afterEach(() => {
		fs.rmSync(path.dirname(file), { recursive: true, force: true });
	});

	bookingStoreContract(() => new JsonBookingStore(file));

	it("keeps bookings for the next store that opens the same file", () => {
		new JsonBookingStore(file).add(SAM_10_TO_12);
		expect(new JsonBookingStore(file).bookingsOn("2026-11-03")).to.deep.equal([SAM_10_TO_12]);
	});

	it("writes the format Facilities' tools read", () => {
		new JsonBookingStore(file).add(SAM_10_TO_12);
		expect(JSON.parse(fs.readFileSync(file, "utf8"))).to.deep.equal({ version: 2, bookings: [SAM_10_TO_12] });
	});
});
