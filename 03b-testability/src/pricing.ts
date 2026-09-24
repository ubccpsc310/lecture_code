const NON_RESIDENT_SURCHARGE = 1.25;
const CONCESSION_DISCOUNT = 0.7;
const TAX_RATE = 1.05;
const MODERNIZATION_LEVY = 1.02;
const CENTS_PER_DOLLAR = 100;

abstract class PriceCalculator {
	constructor(
		private readonly fee: number,
		private readonly resident: boolean
	) {}

	calculate(): number {
		let amount = this.resident ? this.fee : this.fee * NON_RESIDENT_SURCHARGE;
		amount = this.applyConcession(amount);
		amount = amount * TAX_RATE * MODERNIZATION_LEVY;
		return Math.round(amount * CENTS_PER_DOLLAR) / CENTS_PER_DOLLAR;
	}

	protected applyConcession(amount: number): number {
		return amount;
	}
}

/** What front-desk staff see for an anonymous search — no concession, since no customer is attached yet. */
export class QuotePrice extends PriceCalculator {}

/** What a specific customer pays at the counter — concession rates only apply to walk-ins. */
export class WalkInPrice extends PriceCalculator {
	constructor(
		fee: number,
		resident: boolean,
		private readonly concessionEligible: boolean
	) {
		super(fee, resident);
	}

	protected applyConcession(amount: number): number {
		return this.concessionEligible ? amount * CONCESSION_DISCOUNT : amount;
	}
}
