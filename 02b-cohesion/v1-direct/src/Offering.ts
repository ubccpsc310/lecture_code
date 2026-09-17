import { Instructor } from "./Instructor";
import { Customer } from "./Customer";
import type { Program } from "./program";

export class Offering {
	constructor(
		public id: string,
		public instructor: Instructor,
		public season: string,
		public year: number,
		public fee: number,
		public capacity: number,
		public centreId: string
	) {}

	public program!: Program;
	public registrations: Customer[] = [];
	public waitlist: Customer[] = [];

	public getEnrolled(): number {
		return this.registrations.length;
	}

	public getWaitlisted(): number {
		return this.waitlist.length;
	}

	public getSpacesLeft(): number {
		return this.capacity - this.registrations.length;
	}

	public isFull(): boolean {
		return this.registrations.length >= this.capacity;
	}

	public isRegistered(customer: Customer): boolean {
		return this.registrations.some((registered) => registered.id === customer.id);
	}

	public register(customer: Customer): boolean {
		if (this.isFull()) {
			this.waitlist.push(customer);
			if (!customer.interests.includes(this.program.category)) {
				customer.interests.push(this.program.category);
				if (customer.interests.length >= 5) {
					customer.status = "Community Champion";
				} else if (customer.interests.length >= 3) {
					customer.status = "Frequent Customer";
				}
			}
			return false;
		}
		this.registrations.push(customer);
		if (!customer.interests.includes(this.program.category)) {
			customer.interests.push(this.program.category);
			if (customer.interests.length >= 5) {
				customer.status = "Community Champion";
			} else if (customer.interests.length >= 3) {
				customer.status = "Frequent Customer";
			}
		}
		return true;
	}

	public valueOf(field: string): string | number | undefined {
		switch (field) {
			case "id":
				return this.id;
			case "instructor":
				return this.instructor.name;
			case "year":
				return this.year;
			case "fee":
				return this.fee;
			case "capacity":
				return this.capacity;
			case "enrolled":
				return this.getEnrolled();
			case "waitlist":
				return this.getWaitlisted();
			case "title":
				return this.program.title;
			case "category":
				return this.program.category;
			case "code":
				return this.program.code;
			default:
				return undefined;
		}
	}
}
