import { Booking } from "./Booking";

/**
 * Where bookings are kept. The core declares what it needs, in its own terms.
 * Adapters outside the core decide how: a file, a database, memory.
 */
export interface BookingStore {
	/** Every booking for room on date. */
	bookingsFor(room: string, date: string): Booking[];

	/** Keeps booking. Afterwards, bookingsFor(booking.room, booking.date) includes it. */
	add(booking: Booking): void;
}
