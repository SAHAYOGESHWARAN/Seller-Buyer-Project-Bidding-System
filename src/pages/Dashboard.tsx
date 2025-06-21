
import { useApp } from '@/contexts/AppContext';
import ProjectCard from '@/components/ProjectCard';
import BidCard from '@/components/BidCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, Clock, FileText } from 'lucide-react';

const Dashboard = () => {
  const { projects, bids, deliverables, currentUser } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-600">Please login to view your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userProjects = currentUser.type === 'buyer' 
    ? projects.filter(p => p.buyerEmail === currentUser.email)
    : projects.filter(p => {
        const projectBids = bids.filter(b => b.projectId === p.id && b.sellerEmail === currentUser.email);
        return projectBids.length > 0 || p.selectedSellerId;
      });

  const userBids = currentUser.type === 'seller' 
    ? bids.filter(b => b.sellerEmail === currentUser.email)
    : [];

  const stats = {
    totalProjects: userProjects.length,
    activeProjects: userProjects.filter(p => p.status === 'in_progress').length,
    completedProjects: userProjects.filter(p => p.status === 'completed').length,
    totalBids: userBids.length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser.name}!
        </h1>
        <p className="text-gray-600">
          {currentUser.type === 'buyer' ? 'Manage your projects and bids' : 'Track your bids and active projects'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completedProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentUser.type === 'seller' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Bids</p>
                  <p className="text-2xl font-bold">{stats.totalBids}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Projects Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {currentUser.type === 'buyer' ? 'Your Projects' : 'Projects You\'re Working On'}
          </h2>
          {userProjects.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No projects found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Bids Section (for sellers) */}
        {currentUser.type === 'seller' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Recent Bids</h2>
            {userBids.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No bids placed yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userBids.slice(0, 3).map((bid) => (
                  <BidCard key={bid.id} bid={bid} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Activity for buyers */}
        {currentUser.type === 'buyer' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {userProjects.slice(0, 5).map((project) => {
                    const projectBids = bids.filter(b => b.projectId === project.id);
                    return (
                      <div key={project.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-sm text-gray-500">{projectBids.length} bids received</p>
                        </div>
                        <Badge className={
                          project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
