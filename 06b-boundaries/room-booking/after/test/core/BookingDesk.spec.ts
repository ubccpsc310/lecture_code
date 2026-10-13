import { expect } from "chai";
import { Booking } from "../../src/core/Booking";
import { BookingDesk } from "../../src/core/BookingDesk";
import { FakeBookingStore } from "../FakeBookingStore";

function booking(room: string, student: string, date: string, start: string, end: string): Booking {
	return { room, student, date, start, end };
}

const SAM_10_TO_12 = booking("IKB-261", "sam", "2026-11-03", "10:00", "12:00");

describe("BookingDesk", () => {
	it("keeps a booking that no rule refuses", () => {
		const store = new FakeBookingStore();
		const request = booking("IKB-261", "alex", "2026-11-03", "10:00", "12:00");
		expect(new BookingDesk(store).book(request)).to.be.undefined;
		expect(store.bookingsOn("2026-11-03")).to.deep.equal([request]);
	});

	it("doesn't keep a booking that a rule refuses", () => {
		const store = new FakeBookingStore(SAM_10_TO_12);
		const request = booking("IKB-261", "alex", "2026-11-03", "11:00", "13:00");
		expect(new BookingDesk(store).book(request)).to.equal("IKB-261 is already booked 10:00–12:00");
		expect(store.bookingsOn("2026-11-03")).to.deep.equal([SAM_10_TO_12]);
	});

	it("checks a request only against bookings on the same day", () => {
		const store = new FakeBookingStore(SAM_10_TO_12);
		const request = booking("IKB-261", "alex", "2026-11-04", "10:00", "12:00");
		expect(new BookingDesk(store).book(request)).to.be.undefined;
	});

	it("lists a day's bookings earliest first", () => {
		const late = booking("IKB-263", "priya", "2026-11-03", "15:00", "16:00");
		const store = new FakeBookingStore(late, SAM_10_TO_12);
		expect(new BookingDesk(store).schedule("2026-11-03")).to.deep.equal([SAM_10_TO_12, late]);
	});
});
