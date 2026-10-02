export function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  const headers = parseLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    const record: Record<string, string> = {};
    headers.forEach((header, i) => {
      record[header.trim()] = values[i]?.trim() ?? "";
    });
    return record;
  });
}

function parseLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}
