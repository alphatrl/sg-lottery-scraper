import fs from 'fs';

import path from 'path';

const DIRECTORY_DIST_TEMP = path.join(process.cwd(), 'temp', '');
const DIRECTORY_DIST_UPLOAD = path.join(process.cwd(), 'output');

try {
  fs.mkdirSync(DIRECTORY_DIST_TEMP);
} catch (e) {}

try {
  fs.mkdirSync(DIRECTORY_DIST_UPLOAD);
} catch (e) {}

export function readStore<T>(
  fileName: string,
  type = 'temp'
): T | Record<string, unknown> {
  const folderLocation =
    type === 'upload' ? DIRECTORY_DIST_UPLOAD : DIRECTORY_DIST_TEMP;
  const filePath = path.join(folderLocation, fileName);

  if (!fs.existsSync(filePath)) {
    return {};
  }
  const data = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  return JSON.parse(data) as T | Record<string, unknown>;
}

export function writeStore<T>(fileName: string, data: T, type = 'temp'): void {
  const folderLocation =
    type === 'upload' ? DIRECTORY_DIST_UPLOAD : DIRECTORY_DIST_TEMP;
  const filePath = path.join(folderLocation, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data));
}
