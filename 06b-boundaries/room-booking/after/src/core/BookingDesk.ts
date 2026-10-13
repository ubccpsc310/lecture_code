import { Booking } from "./Booking";
import { BookingStore } from "./BookingStore";
import { minutes, refusalFor } from "./rules";

/** Takes booking requests, and keeps the ones no rule refuses. */
export class BookingDesk {
	constructor(private store: BookingStore) {}

	/** Books request unless a rule refuses it. Returns why it was refused, or undefined if it was booked. */
	book(request: Booking): string | undefined {
		const refusal = refusalFor(request, this.store.bookingsOn(request.date));
		if (refusal === undefined) {
			this.store.add(request);
		}
		return refusal;
	}

	/** Every booking on date, earliest first. */
	schedule(date: string): Booking[] {
		return [...this.store.bookingsOn(date)].sort((a, b) => minutes(a.start) - minutes(b.start));
	}
}
