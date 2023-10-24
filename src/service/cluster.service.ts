// eslint-disable-next-line @typescript-eslint/no-var-requires
const cluster = require('cluster');
import { Injectable } from '@nestjs/common';
import * as os from 'os';
import * as process from 'process';

const cpus = os.cpus().length;

@Injectable()
export class ClusterService {
  static clusterize(callback: () => void): void {
    if (cluster.isPrimary) {
      console.log(`Primary ${process.pid} start!`);
      for (let i = 0; i < cpus; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} exit!`);
      });
    } else {
      console.log(`worker ${process.pid} start!`);
      callback();
    }
  }
}
