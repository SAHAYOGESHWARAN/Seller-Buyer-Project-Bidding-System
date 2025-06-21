
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [deadline, setDeadline] = useState('');
  
  const { addProject, currentUser } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || currentUser.type !== 'buyer') {
      toast({
        title: "Error",
        description: "Only buyers can create projects",
        variant: "destructive",
      });
      return;
    }

    if (!title || !description || !budgetMin || !budgetMax || !deadline) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const projectData = {
      title,
      description,
      budgetMin: parseFloat(budgetMin),
      budgetMax: parseFloat(budgetMax),
      deadline,
      status: 'pending' as const,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
    };

    addProject(projectData);
    
    toast({
      title: "Success",
      description: "Project created successfully!",
    });
    
    navigate('/projects');
  };

  if (!currentUser || currentUser.type !== 'buyer') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-600">Only buyers can create projects. Please login as a buyer.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project in detail"
                className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budgetMin">Minimum Budget ($)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="1000"
                />
              </div>
              <div>
                <Label htmlFor="budgetMax">Maximum Budget ($)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="5000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">Project Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Create Project
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProject;
