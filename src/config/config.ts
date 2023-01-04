import { ConfigFactory } from '@nestjs/config';
import { Configuration } from './config.interface';

const int = (val: string | undefined, num: number): number =>
  isNaN(parseInt(val)) ? num : parseInt(val);

const config: ConfigFactory<Configuration> = () => ({
  meta: {
    appName: process.env.APP_NAME ?? 'Flag Service',
    appSecKey: process.env.FLAG_API_KEY ?? '',
  },
  server: {
    dbUrl: process.env.DB_FEATURE,
    port: int(process.env.PORT, 3001),
  },
});

export default config;
