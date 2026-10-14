import * as fs from "fs";
import { Booking, BookingStore } from "../core/BookingStore";

/** One booking, as Facilities' tools write it. */
interface BookingRecord {
	room: string;
	student: string;
	date: string;
	startTime: string;
	endTime: string;
}

/**
 * Keeps bookings in a JSON file that Facilities' other tools read too, so it uses their field names.
 * Translates between the core's BookingStore and Node's fs.
 */
export class JsonBookingStore implements BookingStore {
	constructor(private file: string) {}

	bookingsFor(room: string, date: string): Booking[] {
		return this.readAll()
			.filter((each) => each.room === room && each.date === date)
			.map((each) => ({
				room: each.room,
				student: each.student,
				date: each.date,
				start: each.startTime,
				end: each.endTime,
			}));
	}

	add(booking: Booking): void {
		const { room, student, date, start, end } = booking;
		const records = [...this.readAll(), { room, student, date, startTime: start, endTime: end }];
		fs.writeFileSync(this.file, JSON.stringify(records, null, "\t") + "\n");
	}

	private readAll(): BookingRecord[] {
		// nothing has been booked yet
		if (!fs.existsSync(this.file)) {
			return [];
		}
		return JSON.parse(fs.readFileSync(this.file, "utf8"));
	}
}
