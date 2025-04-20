import path from 'path';

import { DATA_DIR } from '../../constants/filePath';

export const SG_POOLS_DIR = path.join(DATA_DIR, 'singapore', 'singaporePools');
export const SG_POOLS_4D_DIR = path.join(SG_POOLS_DIR, 'fourD');
export const SG_POOLS_TOTO_DIR = path.join(SG_POOLS_DIR, 'toto');
export const SG_POOLS_SWEEP_DIR = path.join(SG_POOLS_DIR, 'sweep');

export const SG_FILE_NAME = 'sg_lottery.json';
