import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail]; // adiciona os jobs

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  // inicializaa fila
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // adicioan na fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // processa todoss os jobs q estao na filas
  proccessQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];
      // bee.process(handle); // somente 1 job
      bee.on('failed', this.handleFailure).process(handle); // ouvir eventos com bee
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
