import { expect } from "chai";
import { Booking } from "../../src/core/Booking";
import { refusalFor } from "../../src/core/rules";

function booking(room: string, student: string, start: string, end: string): Booking {
	return { room, student, date: "2026-11-03", start, end };
}

const SAM_10_TO_12 = booking("IKB-261", "sam", "10:00", "12:00");
const SAM_13_TO_14 = booking("IKB-263", "sam", "13:00", "14:00");

describe("refusalFor", () => {
	it("allows a free room", () => {
		expect(refusalFor(booking("IKB-261", "alex", "10:00", "12:00"), [])).to.be.undefined;
	});

	it("refuses a booking that ends before it starts", () => {
		expect(refusalFor(booking("IKB-261", "alex", "12:00", "10:00"), [])).to.equal("12:00–10:00 ends before it starts");
	});

	it("allows exactly 2 hours, and refuses a minute more", () => {
		expect(refusalFor(booking("IKB-261", "alex", "10:00", "12:00"), [])).to.be.undefined;
		expect(refusalFor(booking("IKB-261", "alex", "10:00", "12:01"), [])).to.equal(
			"a room can be booked for at most 2 hours"
		);
	});

	it("refuses a booking that overlaps another in the same room", () => {
		expect(refusalFor(booking("IKB-261", "alex", "11:59", "13:00"), [SAM_10_TO_12])).to.equal(
			"IKB-261 is already booked 10:00–12:00"
		);
	});

	it("allows back-to-back bookings, and overlaps in another room", () => {
		expect(refusalFor(booking("IKB-261", "alex", "12:00", "13:00"), [SAM_10_TO_12])).to.be.undefined;
		expect(refusalFor(booking("IKB-265", "alex", "10:00", "12:00"), [SAM_10_TO_12])).to.be.undefined;
	});

	it("refuses a student's third booking on the same day", () => {
		expect(refusalFor(booking("IKB-265", "sam", "15:00", "16:00"), [SAM_10_TO_12, SAM_13_TO_14])).to.equal(
			"sam already has 2 bookings on 2026-11-03"
		);
	});
});
