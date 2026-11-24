// Tracks work that's still running in the background. Used in Activity 2.
//
// Usage:
//   jobs.start("march-cpsc", async () => {
//     // slow work goes here; start() doesn't wait for it
//   });
//   jobs.isPending("march-cpsc"); // true until the work finishes

export class Jobs {
	private readonly pending = new Set<string>(); // ids whose work is still running

	/** Starts `work` in the background and returns right away. */
	start(id: string, work: () => Promise<void>): void {
		this.pending.add(id);
		work()
			.catch((err) => console.error(`job ${id} failed`, err))
			.finally(() => this.pending.delete(id));
	}

	/** Is the work for this id still running? */
	isPending(id: string): boolean {
		return this.pending.has(id);
	}
}
