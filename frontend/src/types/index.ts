export interface Skill {
  id: number;
  name: string;
  category?: string;
}

export interface Technology {
  id: number;
  name: string;
}

export interface UserBrief {
  id: number;
  username: string;
  full_name: string;
  role: 'super_admin' | 'managing_director' | 'admin' | 'developer' | 'client';
  avatar_url?: string;
  is_verified: boolean;
}

export interface DeveloperProfileBrief {
  id: number;
  title?: string;
  location?: string;
  availability: string;
  years_experience: number;
  user: UserBrief;
  skills: Skill[];
}

export interface DeveloperProfile {
  id: number;
  user_id: number;
  title?: string;
  short_bio?: string;
  bio?: string;
  location?: string;
  availability: string;
  years_experience: number;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  is_public: boolean;
  views_count: number;
  user: UserBrief;
  skills: Skill[];
}

export interface ClientProfile {
  id: number;
  user_id: number;
  company_name?: string;
  website?: string;
  industry?: string;
}

export interface User extends UserBrief {
  email: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  is_active: boolean;
  created_at: string;
  developer_profile?: DeveloperProfile;
  client_profile?: ClientProfile;
  projects_count?: number;
}

export interface ProjectDeveloper {
  id: number;
  role_in_project: string;
  is_lead: boolean;
  developer: DeveloperProfileBrief;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  category: string;
  demo_url?: string;
  repo_url?: string;
  image_url?: string;
  status: string;
  client_name?: string;
  start_date?: string;
  completion_date?: string;
  created_at: string;
  developer_associations: ProjectDeveloper[];
  technologies: Technology[];
}

export interface ClientInquiry {
  id: number;
  client_id: number;
  developer_id: number;
  project_name: string;
  project_type?: string;
  budget_range?: string;
  timeline?: string;
  description: string;
  status: 'New' | 'Contacted' | 'In Discussion' | 'Proposal' | 'In Progress' | 'Completed' | 'Closed';
  created_at: string;
  client: UserBrief;
  developer: DeveloperProfileBrief;
}

export interface CommunityChannel {
  id: number;
  name: string;
  description?: string;
  is_locked: boolean;
  created_at: string;
}

export interface CommunityMessage {
  id: number;
  channel_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user: UserBrief;
}

export interface Conversation {
  id: number;
  inquiry_id?: number;
  created_at: string;
  updated_at: string;
  other_members: UserBrief[];
  last_message?: Message;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: UserBrief;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_developers: number;
  verified_developers: number;
  pending_applications: number;
  total_projects: number;
  total_clients: number;
  total_inquiries: number;
  active_channels: number;
}
