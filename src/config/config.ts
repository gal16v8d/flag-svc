import { ConfigFactory } from '@nestjs/config';
import { Configuration } from './config.interface';

const toInt = (val: string, defaultValue: number): number =>
  isNaN(parseInt(val)) ? defaultValue : parseInt(val);

const int = (val: string | undefined, defaultValue: number): number =>
  val ? toInt(val, defaultValue) : defaultValue;

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
    port: int(process.env.PORT, 3001),
  },
});

export default config;
