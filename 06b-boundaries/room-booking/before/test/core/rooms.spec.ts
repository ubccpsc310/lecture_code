import { expect } from "chai";
import { Booking } from "../../src/core/Booking";
import { book, refusalFor } from "../../src/core/rooms";
import { FakeBookingStore } from "../FakeBookingStore";

function booking(room: string, student: string, start: string, end: string): Booking {
	return { room, student, date: "2026-11-03", start, end };
}

const SAM_10_TO_12 = booking("IKB-261", "sam", "10:00", "12:00");

// Unit tests: the core on its own, with plain objects or a FakeBookingStore. No files.
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

	it("refuses a booking that overlaps another", () => {
		expect(refusalFor(booking("IKB-261", "alex", "11:59", "13:00"), [SAM_10_TO_12])).to.equal(
			"IKB-261 is already booked 10:00–12:00"
		);
	});

	it("allows a booking back-to-back with another", () => {
		expect(refusalFor(booking("IKB-261", "alex", "12:00", "13:00"), [SAM_10_TO_12])).to.be.undefined;
	});
});

describe("book", () => {
	it("keeps a booking that no rule refuses", () => {
		const store = new FakeBookingStore();
		const request = booking("IKB-261", "alex", "10:00", "12:00");
		expect(book(store, request)).to.be.undefined;
		expect(store.bookingsFor("IKB-261", "2026-11-03")).to.deep.equal([request]);
	});

	it("doesn't keep a booking that a rule refuses", () => {
		const store = new FakeBookingStore(SAM_10_TO_12);
		expect(book(store, booking("IKB-261", "alex", "11:00", "13:00"))).to.equal("IKB-261 is already booked 10:00–12:00");
		expect(store.bookingsFor("IKB-261", "2026-11-03")).to.deep.equal([SAM_10_TO_12]);
	});

	it("checks a request only against bookings for the same room", () => {
		const store = new FakeBookingStore(SAM_10_TO_12);
		expect(book(store, booking("IKB-263", "alex", "10:00", "12:00"))).to.be.undefined;
	});
});
