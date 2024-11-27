import { Job, JobCreate } from '../types';
import { api } from './api';

export const jobService = {
  async createJob(jobData: JobCreate): Promise<Job> {
    const { data } = await api.post('/jobs', jobData);
    return data;
  }
};
