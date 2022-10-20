export interface Configuration {
  meta: {
    appName: string;
  };
  server: {
    dbUrl: string;
    port: number;
  };
}
