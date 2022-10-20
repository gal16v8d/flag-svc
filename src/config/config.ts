import { ConfigFactory } from '@nestjs/config';
import { Configuration } from './config.interface';

const int = (val: string | undefined, num: number): number =>
  val ? (isNaN(parseInt(val)) ? num : parseInt(val)) : num;

const config: ConfigFactory<Configuration> = () => ({
  meta: {
    appName: process.env.APP_NAME ?? 'Flag Service',
  },
  server: {
    dbUrl: process.env.DB_FEATURE,
    port: int(process.env.PORT, 3001),
  },
});

export default config;
