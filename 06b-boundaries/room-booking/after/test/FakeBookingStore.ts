import { Booking } from "../src/core/Booking";
import { BookingStore } from "../src/core/BookingStore";

/** Keeps bookings in memory. */
export class FakeBookingStore implements BookingStore {
	private bookings: Booking[];

	constructor(...bookings: Booking[]) {
		this.bookings = bookings;
	}

	bookingsOn(date: string): Booking[] {
		return this.bookings.filter((each) => each.date === date);
	}

	add(booking: Booking): void {
		this.bookings.push(booking);
	}
}
