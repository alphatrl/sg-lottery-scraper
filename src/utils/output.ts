import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

const DIRECTORY_DIST_TEMP = path.join(process.cwd(), 'temp');
const DIRECTORY_DIST_UPLOAD = path.join(process.cwd(), 'output');

dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';

try {
  fs.mkdirSync(DIRECTORY_DIST_TEMP);
  fs.mkdirSync(`${DIRECTORY_DIST_TEMP}/v1`);
} catch (e) {}

try {
  fs.mkdirSync(DIRECTORY_DIST_UPLOAD);
  fs.mkdirSync(`${DIRECTORY_DIST_UPLOAD}/v1`);
} catch (e) {}

export function readStore<T>(fileName: string, type = 'temp'): T {
  const folderLocation =
    type === 'upload' ? DIRECTORY_DIST_UPLOAD : DIRECTORY_DIST_TEMP;
  const filePath = path.join(folderLocation, fileName);

  if (!fs.existsSync(filePath)) {
    return {} as T;
  }
  const data = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  return JSON.parse(data) as T;
}

export function writeStore<T>(fileName: string, data: T, type = 'temp'): void {
  const folderLocation =
    type === 'upload' ? DIRECTORY_DIST_UPLOAD : DIRECTORY_DIST_TEMP;
  const filePath = path.join(folderLocation, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, isProduction ? 0 : 2));
}
