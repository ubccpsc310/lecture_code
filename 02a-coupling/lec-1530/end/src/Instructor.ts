export class Instructor {
	constructor(
		public id: string,
		public firstName: string,
		public lastName: string,
		public certifications: string[]
	) {}

	public role(): string {
		return "instructor";
	}

	public isCertifiedFor(category: string): boolean {
		return this.certifications.includes(category);
	}
	public label(): string {
		return `${this.firstName} ${this.lastName} (${this.role()})`;
	}
}
// const kyle = new Instructor("1234", "Kyle", "Chin", []);
