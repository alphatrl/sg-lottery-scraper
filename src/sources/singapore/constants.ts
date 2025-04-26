import path from 'path';

import { DATA_DIR } from '../../constants/filePath';
import { SingaporeLatestLottery } from './model';

export const SG_POOLS_DIR = path.join(DATA_DIR, 'singapore', 'singaporePools');
export const SG_POOLS_4D_DIR = path.join(SG_POOLS_DIR, 'fourD');
export const SG_POOLS_TOTO_DIR = path.join(SG_POOLS_DIR, 'toto');
export const SG_POOLS_SWEEP_DIR = path.join(SG_POOLS_DIR, 'sweep');

export const SG_FILE_NAME = 'sg_lottery.json';
export const SG_LATEST_FILE_NAME = 'sg_latest.json';

export const SG_LATEST_DIR = path.join(SG_POOLS_DIR, SG_LATEST_FILE_NAME);

export const SG_LATEST_DEFAULT: SingaporeLatestLottery = {
  updatedOn: 0,
  singaporePools: {
    fourD: 0,
    toto: 0,
    sweep: 0,
  },
};
