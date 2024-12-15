export interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  posted_by: number;
  created_at: string;
}

export interface JobCreate {
  title: string;
  description: string;
  category: string;
  location: string;
}


export interface User {
    id: number;
    email: string;
    name: string;
    role: 'job_seeker' | 'employer';
}


export interface Application {
  id: number;
  job_id: number;
  user_id: number;
  resume_url?: string;
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
  user: {
    name: string;
    email: string;
  };
  job: {
    id: number;
    title: string;
  };
}

