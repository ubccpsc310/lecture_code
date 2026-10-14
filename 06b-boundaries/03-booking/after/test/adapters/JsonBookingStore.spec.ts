import { expect } from "chai";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Booking } from "../../src/core/BookingStore";
import { JsonBookingStore } from "../../src/adapters/JsonBookingStore";

/** A path to a file called bookings.json, in a new, empty temporary directory. The file doesn't exist yet. */
function tempFile(): string {
	return path.join(fs.mkdtempSync(path.join(os.tmpdir(), "rooms-")), "bookings.json");
}

const SAM_10_TO_12: Booking = { room: "IKB-261", student: "sam", date: "2026-11-03", start: "10:00", end: "12:00" };

// Integration tests: a real JsonBookingStore, writing a real file in a temporary directory. No core.
describe("JsonBookingStore", () => {
	it("starts with no bookings, before its file exists", () => {
		expect(new JsonBookingStore(tempFile()).bookingsFor("IKB-261", "2026-11-03")).to.deep.equal([]);
	});

	it("has a booking once it is added, even in a new store on the same file", () => {
		const file = tempFile();
		new JsonBookingStore(file).add(SAM_10_TO_12);
		expect(new JsonBookingStore(file).bookingsFor("IKB-261", "2026-11-03")).to.deep.equal([SAM_10_TO_12]);
	});

	it("writes the field names Facilities' tools read", () => {
		const file = tempFile();
		new JsonBookingStore(file).add(SAM_10_TO_12);
		expect(JSON.parse(fs.readFileSync(file, "utf8"))).to.deep.equal([
			{ room: "IKB-261", student: "sam", date: "2026-11-03", startTime: "10:00", endTime: "12:00" },
		]);
	});
});
