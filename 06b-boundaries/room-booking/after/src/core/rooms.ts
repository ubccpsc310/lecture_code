import { Booking } from "./Booking";
import { BookingStore } from "./BookingStore";

// A room can be booked for at most 2 hours at a time.
const MAX_MINUTES = 120;

function minutes(time: string): number {
	const [hours, mins] = time.split(":").map(Number);
	return hours * 60 + mins;
}

/**
 * Why request can't be booked, or undefined if it can.
 * others is every booking already made for the same room on the same day.
 */
export function refusalFor(request: Booking, others: Booking[]): string | undefined {
	const { room, start, end } = request;

	const length = minutes(end) - minutes(start);
	if (length <= 0) {
		return `${start}–${end} ends before it starts`;
	}
	if (length > MAX_MINUTES) {
		return `a room can be booked for at most ${MAX_MINUTES / 60} hours`;
	}

	for (const other of others) {
		// two bookings overlap if each starts before the other ends; back-to-back is fine
		if (minutes(start) < minutes(other.end) && minutes(other.start) < minutes(end)) {
			return `${room} is already booked ${other.start}–${other.end}`;
		}
	}
	return undefined;
}

/** Books request unless a rule refuses it. Returns why it was refused, or undefined if it was booked. */
export function book(store: BookingStore, request: Booking): string | undefined {
	const refusal = refusalFor(request, store.bookingsFor(request.room, request.date));
	if (refusal === undefined) {
		store.add(request);
	}
	return refusal;
}
