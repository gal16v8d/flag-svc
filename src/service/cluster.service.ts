// eslint-disable-next-line @typescript-eslint/no-var-requires
const cluster = require('cluster');
import { Injectable, Logger } from '@nestjs/common';
import * as os from 'os';
import * as process from 'process';

const logger = new Logger('ClusterService');
const cpus = os.cpus().length;

@Injectable()
export class ClusterService {
  static clusterize(callback: () => void): void {
    if (cluster.isPrimary) {
      logger.log(`Primary ${process.pid} start!`);
      for (let i = 0; i < cpus; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        logger.log(`worker ${worker.process.pid} exit!`);
      });
    } else {
      logger.log(`worker ${process.pid} start!`);
      callback();
    }
  }
}
