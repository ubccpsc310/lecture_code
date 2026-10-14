/** A room booked by one student for part of one day. Dates are "YYYY-MM-DD", times are 24-hour "HH:MM". */
export interface Booking {
	room: string;
	student: string;
	date: string;
	start: string;
	end: string;
}

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
