import dotenv from 'dotenv';

dotenv.config();

export const featureFlags = {
  IS_CI: process.env.IS_CI === 'true',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_NOTIFICATION_COMPARE_SKIPPED:
    process.env.SKIP_NOTIFICATION_CHECK === 'true',
};
