import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Job } from '../types';

export const useJobs = (title?: string, location?: string) => {
  return useQuery<Job[]>({
    queryKey: ['jobs', title, location],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (location) params.append('location', location);
      
      const { data } = await api.get('/jobs', { params });
      return data;
    },
  });
};
