import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";

// The core is everything in src/core. Core files may import each other, and nothing else:
// no Node modules like fs, and nothing from outside src/core.
const CORE = "src/core";

function coreFiles(): string[] {
	return fs
		.readdirSync(CORE, { recursive: true, encoding: "utf8" })
		.filter((name) => name.endsWith(".ts"))
		.map((name) => path.join(CORE, name));
}

function importsOf(file: string): string[] {
	const source = fs.readFileSync(file, "utf8");
	return [...source.matchAll(/from\s+"([^"]+)"/g)].map((match) => match[1]);
}

function isInCore(file: string, imported: string): boolean {
	return imported.startsWith(".") && path.resolve(path.dirname(file), imported).startsWith(path.resolve(CORE));
}

// TODO: remove .skip once there is a src/core
describe.skip("architecture", () => {
	it("has a core", () => {
		expect(fs.existsSync(CORE)).to.be.true;
	});

	it("the core imports only from the core", () => {
		const outside = coreFiles().flatMap((file) =>
			importsOf(file)
				.filter((imported) => !isInCore(file, imported))
				.map((imported) => `${file} imports "${imported}"`)
		);
		expect(outside).to.deep.equal([]);
	});
});
