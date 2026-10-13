import * as fs from "fs";
import * as os from "os";
import * as path from "path";

/** A path to a file called name, in a new, empty temporary directory. The file doesn't exist yet. */
export function tempFile(name: string): string {
	return path.join(fs.mkdtempSync(path.join(os.tmpdir(), "rooms-")), name);
}
