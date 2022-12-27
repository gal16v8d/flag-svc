export interface Configuration {
  meta: {
    appName: string;
    appSecKey: string;
  };
  server: {
    dbUrl: string;
    port: number;
  };
}
