import dotenv from 'dotenv';

dotenv.config();

export const featureFlags = {
  IS_CI: process.env.IS_CI === 'true',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};
