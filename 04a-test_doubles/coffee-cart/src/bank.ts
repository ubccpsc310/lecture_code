import { IReader } from "./reader";

/**
 * The coffee cart's card reader. Every charge goes to the bank, and an approved charge is real money.
 */
export class BankCardReader implements IReader {
	/** Returns true if the card was charged, false if it was declined. Never throws. */
	public charge(cents: number): boolean {
		// There's no bank behind this code, so this stands in for the bank's answer.
		// Like the real thing, the caller doesn't get to pick.
		return Math.random() < 0.7;
	}
}
