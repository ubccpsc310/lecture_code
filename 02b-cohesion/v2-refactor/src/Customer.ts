export class Customer {
	public interests: string[];
	constructor(
		public id: string,
		public name: string,
		public birthYear: number,
		public resident: boolean
	) {
		this.interests = [];
	}

	public get status(): string {
		if (this.interests.length >= 5) return "Community Champion";
		if (this.interests.length >= 3) return "Frequent Customer";
		return "Default";
	}

	public recordCategory(category: string): void {
		if (!this.interests.includes(category)) {
			this.interests.push(category);
		}
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
