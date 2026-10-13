import * as fs from "fs";

/**
 * Study room bookings. Every booking ever made is kept in one JSON file.
 */

const DATA_FILE = "data/bookings.json";

// A room can be booked for at most 2 hours at a time,
// and a student can hold at most 2 bookings on the same day.
const MAX_MINUTES = 120;
const MAX_PER_DAY = 2;

/** A room booked by one student for part of one day. Dates are "YYYY-MM-DD", times are 24-hour "HH:MM". */
interface Booking {
	room: string;
	student: string;
	date: string;
	start: string;
	end: string;
}

function minutes(time: string): number {
	const [hours, mins] = time.split(":").map(Number);
	return hours * 60 + mins;
}

/** Books room for student on date, from start to end, and says whether it worked. */
export function book(room: string, student: string, date: string, start: string, end: string): string {
	const bookings: Booking[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

	const length = minutes(end) - minutes(start);
	if (length <= 0) {
		return `Can't book: ${start}–${end} ends before it starts`;
	}
	if (length > MAX_MINUTES) {
		return `Can't book: a room can be booked for at most ${MAX_MINUTES / 60} hours`;
	}

	const sameDay = bookings.filter((each) => each.date === date);
	for (const other of sameDay) {
		// two bookings overlap if each starts before the other ends; back-to-back is fine
		if (other.room === room && minutes(start) < minutes(other.end) && minutes(other.start) < minutes(end)) {
			return `Can't book: ${room} is already booked ${other.start}–${other.end}`;
		}
	}
	if (sameDay.filter((each) => each.student === student).length >= MAX_PER_DAY) {
		return `Can't book: ${student} already has ${MAX_PER_DAY} bookings on ${date}`;
	}

	bookings.push({ room, student, date, start, end });
	fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, "\t") + "\n");
	return `Booked ${room} for ${student} on ${date}, ${start}–${end}`;
}

/** Every booking on date, earliest first. */
export function schedule(date: string): string {
	const bookings: Booking[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
	const sameDay = bookings.filter((each) => each.date === date).sort((a, b) => minutes(a.start) - minutes(b.start));
	if (sameDay.length === 0) {
		return `No bookings on ${date}`;
	}
	return sameDay.map((each) => `${each.start}–${each.end}  ${each.room}  ${each.student}`).join("\n");
}
