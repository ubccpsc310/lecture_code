export class Centre {
	constructor(
		public id: string,
		public name: string,
		public address: string,
		public district: string
	) {}

	public facilities: Facility[] = [];

	public getFacilities(): Facility[] {
		return this.facilities;
	}
}

export class Facility {
	constructor(
		public id: string,
		public number: string,
		public type: string,
		public surface: string,
		public occupancy: number
	) {}

	public centre!: Centre;
}
