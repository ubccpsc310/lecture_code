import * as fs from "fs";
import { Booking } from "../core/Booking";
import { BookingStore } from "../core/BookingStore";

const FORMAT_VERSION = 2;

/**
 * Keeps bookings in a JSON file that Facilities' other tools read too: { "version": 2, "bookings": [...] }.
 * Translates between the core's BookingStore and Node's fs.
 */
export class JsonBookingStore implements BookingStore {
	constructor(private file: string) {}

	bookingsFor(room: string, date: string): Booking[] {
		return this.readAll().filter((each) => each.room === room && each.date === date);
	}

	add(booking: Booking): void {
		const bookings = [...this.readAll(), booking];
		fs.writeFileSync(this.file, JSON.stringify({ version: FORMAT_VERSION, bookings }, null, "\t") + "\n");
	}

	private readAll(): Booking[] {
		// nothing has been booked yet
		if (!fs.existsSync(this.file)) {
			return [];
		}
		return JSON.parse(fs.readFileSync(this.file, "utf8")).bookings;
	}
}
