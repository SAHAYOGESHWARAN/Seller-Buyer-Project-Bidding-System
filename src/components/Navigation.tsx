
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { User, Briefcase, FileText, Star } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const { currentUser, setCurrentUser } = useApp();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              ProjectBid
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/projects">
              <Button variant={isActive('/projects') ? 'default' : 'ghost'}>
                <Briefcase className="w-4 h-4 mr-2" />
                Projects
              </Button>
            </Link>
            
            {currentUser?.type === 'buyer' && (
              <Link to="/create-project">
                <Button variant={isActive('/create-project') ? 'default' : 'ghost'}>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            )}
            
            <Link to="/dashboard">
              <Button variant={isActive('/dashboard') ? 'default' : 'ghost'}>
                <Star className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {currentUser.name} ({currentUser.type})
                </span>
                <Button variant="outline" onClick={() => setCurrentUser(null)}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
