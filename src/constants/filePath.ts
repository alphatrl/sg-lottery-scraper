import path from 'path';

export const TEMP_DIR = path.join(process.cwd(), 'temp');
export const DATA_DIR = path.join(process.cwd(), 'data');
export const UPLOAD_DIR = path.join(process.cwd(), 'output');

// Backwards compatibility with huat-mobile v1/v2
export const HUAT_V2_COMPAT_TEMP_DIR = path.join(TEMP_DIR, 'v1');
export const HUAT_V2_COMPAT_DATA_DIR = path.join(UPLOAD_DIR, 'v1');
