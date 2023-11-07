export interface Configuration {
  app: {
    clusterEnabled: boolean;
  };
  meta: {
    appName: string;
    appSecKey: string;
  };
  server: {
    dbUrl: string;
    port: number;
  };
}
