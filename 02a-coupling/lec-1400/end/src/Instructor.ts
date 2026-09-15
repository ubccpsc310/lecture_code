export class Instructor {
	constructor(
		public id: string,
		public lname: string,
		public fname: string,
		public certifications: string[]
	) {}

	public role(): string {
		return "instructor";
	}

	public isCertifiedFor(category: string): boolean {
		return this.certifications.includes(category);
	}
	public label(): string {
		return `${this.name} (${this.role()})`;
	}

	public get name(): string {
		return `${this.fname} ${this.lname}`;
	}
}
