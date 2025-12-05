type TaskStatus = 'idle' | 'running' | 'done'

export class TaskQueue {
  public taskIds: string[] = [];
  private queue: ({ id: string, job: () => Promise<void>, status: TaskStatus })[] = [];
  public status: TaskStatus = 'idle';
  private currentRunningTask: any;

  addTask(id: string, fn: () => Promise<void>) {
    if (!this.taskIds.includes(id)) {
      this.taskIds.push(id);
      this.queue.push({ id: id, job: fn, status: 'idle' });
    }
  }

  async run(mode: 'queue' | 'concurrent') {
    if (this.currentRunningTask) return this.currentRunningTask;

    this.currentRunningTask = (async () => {
      if (mode === 'queue') {
        await this.runQueue();
      } else {
        await this.runConcurrent();
      }

      this.currentRunningTask = null;
    })(); 

    return this.currentRunningTask;
  }

  private async runConcurrent() {
    if (this.status === 'running') return;

    this.status = 'running';

    await Promise.all(this.queue.map(async queue => {
      queue.status = 'running'
      await queue.job()
      queue.status = 'done'
    }))


    this.status = 'done'
  }

  private async runQueue() {
    if (this.status === 'running') return;
    this.status = 'running';

    while (this.queue.length > 0) {
      const q = this.queue.shift();
      if (q) {
        q.status = 'running'
        await q.job()
        q.status = 'done'
      }
    }

    this.status = 'done';
  }
}