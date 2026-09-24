// Type-checks only the project `yarn build` was run from, using the root tsconfig.
// tsc can't narrow `include` from the command line, so write a small config that extends
// the root one. It lives under node_modules/ so tsc still finds node_modules/@types.
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const project = process.env.INIT_CWD ?? process.cwd();
const cacheDir = join(root, "node_modules", ".cache", "typecheck");
const config = join(cacheDir, "tsconfig.json");

mkdirSync(cacheDir, { recursive: true });
writeFileSync(
	config,
	JSON.stringify({
		extends: join(root, "tsconfig.json"),
		include: [join(project, "src/**/*.ts"), join(project, "test/**/*.ts")],
	})
);

const tsc = spawnSync(join(root, "node_modules", ".bin", "tsc"), ["-p", config], { stdio: "inherit", cwd: project });
process.exit(tsc.status ?? 1);
