import fs from 'node:fs/promises';
import path from 'node:path';

export async function writeBriefToFile(filePath: string, content: string): Promise<string> {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  const dir = path.dirname(resolvedPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(resolvedPath, content, 'utf-8');
  return resolvedPath;
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const resolvedPath = path.resolve(process.cwd(), filePath);
    await fs.access(resolvedPath);
    return true;
  } catch {
    return false;
  }
}
