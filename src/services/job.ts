import { Application, Job, JobCreate } from '../types';
import { api } from './api';

export const jobService = {
  async createJob(jobData: JobCreate): Promise<Job> {
    const { data } = await api.post('/jobs', jobData);
    return data;
  },

  async getMyJobs(): Promise<Job[]> {
    const { data } = await api.get('/jobs/my-jobs');
    return data;
  },

  async getJobApplications(jobId: number): Promise<Application[]> {
    const { data } = await api.get(`/applications/${jobId}`);
    return data;
  },

  async updateApplicationStatus(applicationId: number, status: 'accepted' | 'rejected' | 'pending'): Promise<Application> {
    const { data } = await api.put(`/applications/${applicationId}`, { status });
    return data;
  },

  async getJobById(id: number): Promise<Job> {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  },

  async applyToJob(jobId: number, applicationData: { resume_url?: string }): Promise<Application> {
    const { data } = await api.post(`/applications`, {
      job_id: jobId,
      ...applicationData
    });
    return data;
  },

  async getAllApplications(): Promise<Application[]> {
    try {
      const { data: jobs } = await api.get('/jobs/my-jobs');

      if (!jobs || jobs.length === 0) {
        return []; 
      }

      const applicationPromises = jobs.map((job: { id: string }) =>
        api.get(`/applications/${job.id}`).then((res) => res.data)
      );

      const applicationsPerJob = await Promise.all(applicationPromises);

      const allApplications = applicationsPerJob.flat();
      console.log(allApplications);
      return allApplications;
      
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },


};
