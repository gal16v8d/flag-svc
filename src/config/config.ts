import { ConfigFactory } from '@nestjs/config';
import { Configuration } from './config.interface';

const safeParseInt = (val: string | undefined, num: number): number => {
  const parsed = parseInt(val ?? String(num));
  return isNaN(parsed) ? num : parsed;
};

const config: ConfigFactory<Configuration> = () => ({
  app: {
    clusterEnabled: process.env.CLUSTER_ENABLED
      ? Boolean(process.env.CLUSTER_ENABLED)
      : false,
  },
  meta: {
    appName: process.env.APP_NAME ?? 'Flag Service',
    appSecKey: process.env.FLAG_API_KEY ?? '',
  },
  server: {
    dbUrl: process.env.DB_FEATURE ?? '',
    port: safeParseInt(process.env.PORT, 3001),
  },
});

export default config;
