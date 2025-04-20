import fs from 'fs';
import path from 'path';

import {
  DATA_DIR,
  HUAT_V2_COMPAT_DATA_DIR,
  TEMP_DIR,
  UPLOAD_DIR,
} from '../constants/filePath';
import { featureFlags } from './featureFlags';

type OutputType = 'temp' | 'upload' | 'data';

interface Options {
  fileName: string;
  type?: OutputType;
}

interface WriteOptions<T> extends Options {
  data: T;
}

function getDirectoryPath(type: OutputType): string {
  switch (type) {
    case 'upload':
      return UPLOAD_DIR;
    case 'temp':
      return TEMP_DIR;
    case 'data':
      return DATA_DIR;
  }
}

export function setupStore() {
  if (!fs.existsSync(TEMP_DIR)) {
    console.log('Creating `temp` directory');
    fs.mkdirSync(TEMP_DIR);
  }

  if (!fs.existsSync(DATA_DIR)) {
    console.log('Creating `data` directory');
    fs.mkdirSync(DATA_DIR);
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    console.log('Creating `output` directory');
    fs.mkdirSync(UPLOAD_DIR);
  }

  if (!fs.existsSync(HUAT_V2_COMPAT_DATA_DIR)) {
    console.log('Creating `temp/v1` directory');
    fs.mkdirSync(HUAT_V2_COMPAT_DATA_DIR);
  }
}

export function readStore<T>(options: Options): T {
  const { fileName, type = 'temp' } = options;
  const dirPath = getDirectoryPath(type);
  const filePath = path.join(dirPath, fileName);

  if (!fs.existsSync(filePath)) {
    return {} as T;
  }
  const data = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  return JSON.parse(data) as T;
}

export function writeStore<T>(options: WriteOptions<T>): void {
  const { fileName, type = 'temp', data } = options;
  const dirPath = getDirectoryPath(type);
  const filePath = path.join(dirPath, fileName);

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, featureFlags.IS_PRODUCTION ? 0 : 2)
  );
}
