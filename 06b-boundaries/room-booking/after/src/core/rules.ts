import { Booking } from "./Booking";

// A room can be booked for at most 2 hours at a time,
// and a student can hold at most 2 bookings on the same day.
const MAX_MINUTES = 120;
const MAX_PER_DAY = 2;

export function minutes(time: string): number {
	const [hours, mins] = time.split(":").map(Number);
	return hours * 60 + mins;
}

/**
 * Why request can't be booked, or undefined if it can.
 * sameDay is every booking already made on request's date, in any room.
 */
export function refusalFor(request: Booking, sameDay: Booking[]): string | undefined {
	const { room, student, date, start, end } = request;

	const length = minutes(end) - minutes(start);
	if (length <= 0) {
		return `${start}–${end} ends before it starts`;
	}
	if (length > MAX_MINUTES) {
		return `a room can be booked for at most ${MAX_MINUTES / 60} hours`;
	}

	for (const other of sameDay) {
		// two bookings overlap if each starts before the other ends; back-to-back is fine
		if (other.room === room && minutes(start) < minutes(other.end) && minutes(other.start) < minutes(end)) {
			return `${room} is already booked ${other.start}–${other.end}`;
		}
	}
	if (sameDay.filter((each) => each.student === student).length >= MAX_PER_DAY) {
		return `${student} already has ${MAX_PER_DAY} bookings on ${date}`;
	}
	return undefined;
}
