export class Customer {
	public interests: string[];
	public status: string;
	constructor(
		public id: string,
		public name: string,
		public birthYear: number,
		public resident: boolean
	) {
		this.interests = [];
		this.status = "Default";
	}

	public role(): string {
		return "customer";
	}

	public ageIn(year: number): number {
		return year - this.birthYear;
	}

	public isSeniorIn(year: number): boolean {
		return this.ageIn(year) >= 65;
	}

	public isYouthIn(year: number): boolean {
		return this.ageIn(year) < 18;
	}

	public label(): string {
		return `${this.name} (${this.role()})`;
	}
}
