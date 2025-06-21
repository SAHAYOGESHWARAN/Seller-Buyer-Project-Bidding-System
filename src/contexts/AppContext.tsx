
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, Bid, User, Deliverable } from '@/types';

interface AppContextType {
  projects: Project[];
  bids: Bid[];
  deliverables: Deliverable[];
  currentUser: User | null;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  addBid: (bid: Omit<Bid, 'id' | 'createdAt'>) => void;
  selectSeller: (projectId: string, sellerId: string) => void;
  updateProjectStatus: (projectId: string, status: Project['status']) => void;
  addDeliverable: (deliverable: Omit<Deliverable, 'id' | 'uploadedAt'>) => void;
  setCurrentUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const addBid = (bidData: Omit<Bid, 'id' | 'createdAt'>) => {
    const newBid: Bid = {
      ...bidData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setBids(prev => [...prev, newBid]);
  };

  const selectSeller = (projectId: string, sellerId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, selectedSellerId: sellerId, status: 'in_progress' as const }
        : project
    ));
  };

  const updateProjectStatus = (projectId: string, status: Project['status']) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, status } : project
    ));
  };

  const addDeliverable = (deliverableData: Omit<Deliverable, 'id' | 'uploadedAt'>) => {
    const newDeliverable: Deliverable = {
      ...deliverableData,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString(),
    };
    setDeliverables(prev => [...prev, newDeliverable]);
  };

  return (
    <AppContext.Provider value={{
      projects,
      bids,
      deliverables,
      currentUser,
      addProject,
      addBid,
      selectSeller,
      updateProjectStatus,
      addDeliverable,
      setCurrentUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};
