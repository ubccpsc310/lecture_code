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
	// TODO: what could go wrong in JsonBookingStore that the core's unit tests would never notice?
	// Write a pending test for each one: an it() with a title and no function.
});
