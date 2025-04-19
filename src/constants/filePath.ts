import path from 'path';

export const TEMP_DIR = path.join(process.cwd(), 'temp');
export const DATA_DIR = path.join(process.cwd(), 'data');
export const UPLOAD_DIR = path.join(process.cwd(), 'output');

// Backwards compatibility with huat-mobile v1/v2
export const HUAT_V2_COMPAT_DATA_DIR = path.join(UPLOAD_DIR, 'v1');

// SINGAPORE - SGPools
export const SG_POOLS_DIR = path.join(DATA_DIR, 'singapore', 'singaporePools');
export const SG_POOLS_4D_DIR = path.join(SG_POOLS_DIR, 'fourD');
export const SG_POOLS_TOTO_DIR = path.join(SG_POOLS_DIR, 'toto');
export const SG_POOLS_SWEEP_DIR = path.join(SG_POOLS_DIR, 'sweep');
