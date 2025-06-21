
export interface Project {
  id: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  buyerName: string;
  buyerEmail: string;
  selectedSellerId?: string;
  createdAt: string;
}

export interface Bid {
  id: string;
  projectId: string;
  sellerName: string;
  sellerEmail: string;
  bidAmount: number;
  estimatedTime: string;
  message: string;
  createdAt: string;
}

export interface Deliverable {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'buyer' | 'seller';
}
