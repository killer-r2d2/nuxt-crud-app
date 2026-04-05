import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export type NameRecord = { id: number; name: string };

const dataDirectoryPath = join(process.cwd(), ".data");
const namesFilePath = join(dataDirectoryPath, "names.json");

async function ensureNamesFile(): Promise<void> {
  await mkdir(dataDirectoryPath, { recursive: true });
  try {
    await readFile(namesFilePath, "utf-8");
  } catch {
    await writeFile(namesFilePath, "[]", "utf-8");
  }
}

export async function readNames(): Promise<NameRecord[]> {
  await ensureNamesFile();
  const raw = await readFile(namesFilePath, "utf-8");
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is NameRecord =>
        item !== null &&
        typeof item === "object" &&
        typeof (item as NameRecord).id === "number" &&
        typeof (item as NameRecord).name === "string",
    );
  } catch {
    return [];
  }
}

export async function writeNames(names: NameRecord[]): Promise<void> {
  await ensureNamesFile();
  await writeFile(namesFilePath, JSON.stringify(names), "utf-8");
}

export function nextNameId(names: NameRecord[]): number {
  return names.reduce((currentMax, item) => Math.max(currentMax, item.id), 0) + 1;
}
