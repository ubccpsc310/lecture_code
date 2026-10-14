/**
 * Study room bookings. Every booking ever made is kept in one JSON file.
 * Facilities' other tools read that file too, so it uses their field names.
 */

const DATA_FILE = "data/bookings.json";

// A room can be booked for at most 2 hours at a time.
const MAX_MINUTES = 120;

/** What book() needs from the file system. Node's fs module already has this shape. */
export interface FileSystem {
	readFileSync(path: string, encoding: "utf8"): string;
	writeFileSync(path: string, data: string): void;
}

/** A room booked by one student for part of one day. Dates are "YYYY-MM-DD", times are 24-hour "HH:MM". */
interface Booking {
	room: string;
	student: string;
	date: string;
	startTime: string;
	endTime: string;
}

function minutes(time: string): number {
	const [hours, mins] = time.split(":").map(Number);
	return hours * 60 + mins;
}

/** Books room for student on date, from start to end, and says whether it worked. */
export function book(fs: FileSystem, room: string, student: string, date: string, start: string, end: string): string {
	const bookings: Booking[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

	const length = minutes(end) - minutes(start);
	if (length <= 0) {
		return `Can't book: ${start}–${end} ends before it starts`;
	}
	if (length > MAX_MINUTES) {
		return `Can't book: a room can be booked for at most ${MAX_MINUTES / 60} hours`;
	}

	for (const other of bookings) {
		// two bookings overlap if each starts before the other ends; back-to-back is fine
		const sameRoom = other.room === room && other.date === date;
		if (sameRoom && minutes(start) < minutes(other.endTime) && minutes(other.startTime) < minutes(end)) {
			return `Can't book: ${room} is already booked ${other.startTime}–${other.endTime}`;
		}
	}

	bookings.push({ room, student, date, startTime: start, endTime: end });
	fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, "\t") + "\n");
	return `Booked ${room} for ${student} on ${date}, ${start}–${end}`;
}
