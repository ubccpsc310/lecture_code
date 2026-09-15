import type { Offering } from "./Offering";

export class Program {
	constructor(
		public id: string,
		public title: string,
		public category: string,
		public code: string
	) {}

	public offerings: Offering[] = [];

	public getOfferings(): Offering[] {
		return this.offerings;
	}

	public getOfferingById(id: string): Offering | undefined {
		return this.offerings.find((offering) => offering.id === id);
	}
}
