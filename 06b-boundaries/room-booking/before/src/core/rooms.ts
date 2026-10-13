import { Booking } from "./Booking";
import { BookingStore } from "./BookingStore";

/**
 * Why request can't be booked, or undefined if it can.
 * others is every booking already made for the same room on the same day.
 */
export function refusalFor(request: Booking, others: Booking[]): string | undefined {
	// TODO: move the rules here from src/bookings.ts
	return undefined;
}

/** Books request unless a rule refuses it. Returns why it was refused, or undefined if it was booked. */
export function book(store: BookingStore, request: Booking): string | undefined {
	// TODO: ask refusalFor() about the store's bookings for the same room and day,
	// and add request to the store if nothing refuses it
	return undefined;
}
