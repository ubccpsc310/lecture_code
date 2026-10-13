import { expect } from "chai";
import { Booking } from "../src/core/Booking";
import { BookingStore } from "../src/core/BookingStore";

const SAM_10_TO_12: Booking = { room: "IKB-261", student: "sam", date: "2026-11-03", start: "10:00", end: "12:00" };
const PRIYA_13_TO_14: Booking = { room: "IKB-263", student: "priya", date: "2026-11-03", start: "13:00", end: "14:00" };
const ALEX_NEXT_DAY: Booking = { room: "IKB-261", student: "alex", date: "2026-11-04", start: "10:00", end: "12:00" };

/**
 * What every BookingStore promises, whatever it keeps bookings in.
 * makeStore is called once per test, and must return a new, empty store.
 */
export function bookingStoreContract(makeStore: () => BookingStore): void {
	it("starts with no bookings", () => {
		expect(makeStore().bookingsOn("2026-11-03")).to.deep.equal([]);
	});

	it("has a booking once it is added", () => {
		const store = makeStore();
		store.add(SAM_10_TO_12);
		expect(store.bookingsOn("2026-11-03")).to.deep.equal([SAM_10_TO_12]);
	});

	it("has every booking on a date, in any room", () => {
		const store = makeStore();
		store.add(SAM_10_TO_12);
		store.add(PRIYA_13_TO_14);
		expect(store.bookingsOn("2026-11-03")).to.have.deep.members([SAM_10_TO_12, PRIYA_13_TO_14]);
	});

	it("has only the bookings on the date asked for", () => {
		const store = makeStore();
		store.add(SAM_10_TO_12);
		store.add(ALEX_NEXT_DAY);
		expect(store.bookingsOn("2026-11-04")).to.deep.equal([ALEX_NEXT_DAY]);
	});
}
