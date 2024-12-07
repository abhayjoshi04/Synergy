import { User } from './auth';

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketCategory = 'technical' | 'account' | 'policy' | 'other';

export interface SupportTicket {
  _id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  creator: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  comments: TicketComment[];
  content?: string;
  resources?: Array<{
    title: string;
    url: string;
  }>;
  checkpoints?: Array<{
    title: string;
    completed: boolean;
  }>;
}

export interface TicketComment {
  _id: string;
  content: string;
  author: User;
  user: string;
  createdAt: string;
  attachments?: string[];
}

export interface CreateTicketData {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  attachments?: File[];
}

export interface TrainingTopic {
  id: string;
  title: string;
  videoId: string;
}

export interface UpdateTicketData {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  topics: TrainingTopic[];
  duration: string;
  level: 'basic' | 'intermediate' | 'advanced';
  completionRate?: number;
}

export interface CreateCommentData {
  content: string;
  attachments?: File[];
}