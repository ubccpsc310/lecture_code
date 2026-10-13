import { Booking } from "../src/core/Booking";
import { BookingStore } from "../src/core/BookingStore";

/** Keeps bookings in memory. */
export class FakeBookingStore implements BookingStore {
	private bookings: Booking[];

	constructor(...bookings: Booking[]) {
		this.bookings = bookings;
	}

	bookingsFor(room: string, date: string): Booking[] {
		return this.bookings.filter((each) => each.room === room && each.date === date);
	}

	add(booking: Booking): void {
		this.bookings.push(booking);
	}
}
