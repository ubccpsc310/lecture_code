import { expect } from "chai";
import { Booking } from "../src/core/Booking";
import { BookingStore } from "../src/core/BookingStore";

const SAM_10_TO_12: Booking = { room: "IKB-261", student: "sam", date: "2026-11-03", start: "10:00", end: "12:00" };
const PRIYA_NEXT_ROOM: Booking = {
	room: "IKB-263",
	student: "priya",
	date: "2026-11-03",
	start: "10:00",
	end: "12:00",
};
const ALEX_NEXT_DAY: Booking = { room: "IKB-261", student: "alex", date: "2026-11-04", start: "10:00", end: "12:00" };

/**
 * What every BookingStore promises, whatever it keeps bookings in.
 * makeStore is called once per test, and must return a new, empty store.
 */
export function bookingStoreContract(makeStore: () => BookingStore): void {
	it("starts with no bookings", () => {
		expect(makeStore().bookingsFor("IKB-261", "2026-11-03")).to.deep.equal([]);
	});

	it("has a booking once it is added", () => {
		const store = makeStore();
		store.add(SAM_10_TO_12);
		expect(store.bookingsFor("IKB-261", "2026-11-03")).to.deep.equal([SAM_10_TO_12]);
	});

	it("has only the bookings for the room and date asked for", () => {
		const store = makeStore();
		store.add(SAM_10_TO_12);
		store.add(PRIYA_NEXT_ROOM);
		store.add(ALEX_NEXT_DAY);
		expect(store.bookingsFor("IKB-261", "2026-11-03")).to.deep.equal([SAM_10_TO_12]);
	});
}
