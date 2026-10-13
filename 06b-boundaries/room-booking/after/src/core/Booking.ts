/** A room booked by one student for part of one day. Dates are "YYYY-MM-DD", times are 24-hour "HH:MM". */
export interface Booking {
	room: string;
	student: string;
	date: string;
	start: string;
	end: string;
}
