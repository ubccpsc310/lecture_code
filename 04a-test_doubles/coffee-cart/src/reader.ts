export interface IReader {
	charge(amount: number): boolean; // returns true if the charge succeeded and false if it failed
}
