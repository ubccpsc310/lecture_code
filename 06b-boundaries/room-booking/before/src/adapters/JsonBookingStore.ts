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
		// TODO: read the bookings from this.file, and keep the ones for room on date
		throw new Error("not implemented");
	}

	add(booking: Booking): void {
		// TODO: read the bookings from this.file, add booking, and write them all back
		throw new Error("not implemented");
	}
}
