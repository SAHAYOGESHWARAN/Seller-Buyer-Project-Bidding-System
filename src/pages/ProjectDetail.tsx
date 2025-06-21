
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BidCard from '@/components/BidCard';
import { useToast } from '@/hooks/use-toast';
import { Clock, DollarSign, User, Upload } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, bids, currentUser, addBid, selectSeller, updateProjectStatus, addDeliverable } = useApp();
  const { toast } = useToast();

  const [bidAmount, setBidAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const project = projects.find(p => p.id === id);
  const projectBids = bids.filter(b => b.projectId === id);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-600">Project not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || currentUser.type !== 'seller') {
      toast({
        title: "Error",
        description: "Only sellers can place bids",
        variant: "destructive",
      });
      return;
    }

    if (!bidAmount || !estimatedTime || !bidMessage) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const bidData = {
      projectId: id!,
      sellerName: currentUser.name,
      sellerEmail: currentUser.email,
      bidAmount: parseFloat(bidAmount),
      estimatedTime,
      message: bidMessage,
    };

    addBid(bidData);
    
    toast({
      title: "Success",
      description: "Bid submitted successfully!",
    });

    setBidAmount('');
    setEstimatedTime('');
    setBidMessage('');
  };

  const handleSelectSeller = (bid: any) => {
    selectSeller(project.id, bid.id);
    toast({
      title: "Success",
      description: `${bid.sellerName} has been selected for this project!`,
    });
  };

  const handleMarkCompleted = () => {
    updateProjectStatus(project.id, 'completed');
    toast({
      title: "Success",
      description: "Project marked as completed!",
    });
  };

  const handleFileUpload = () => {
    if (!fileName) {
      toast({
        title: "Error",
        description: "Please enter a file name",
        variant: "destructive",
      });
      return;
    }

    addDeliverable({
      projectId: project.id,
      fileName,
      fileUrl: `#mock-file-url-${fileName}`,
    });

    toast({
      title: "Success",
      description: "Deliverable uploaded successfully!",
    });

    setFileName('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isBuyer = currentUser?.type === 'buyer' && currentUser.email === project.buyerEmail;
  const isSeller = currentUser?.type === 'seller';
  const selectedBid = projectBids.find(b => b.id === project.selectedSellerId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Project Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">{project.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-semibold">${project.budgetMin} - ${project.budgetMax}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Deadline</p>
                    <p className="font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <User className="w-5 h-5 mr-2 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Posted by</p>
                  <p className="font-semibold">{project.buyerName}</p>
                </div>
              </div>

              {/* Project Actions */}
              {isBuyer && project.status === 'in_progress' && (
                <Button onClick={handleMarkCompleted} className="mb-4">
                  Mark as Completed
                </Button>
              )}

              {/* File Upload for Selected Seller */}
              {isSeller && project.selectedSellerId && selectedBid?.sellerEmail === currentUser?.email && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Deliverables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="File name (e.g., final-design.zip)"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                      />
                      <Button onClick={handleFileUpload}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Bids Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Bids ({projectBids.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {projectBids.length === 0 ? (
                <p className="text-gray-500">No bids yet.</p>
              ) : (
                <div className="space-y-4">
                  {projectBids.map((bid) => (
                    <BidCard 
                      key={bid.id} 
                      bid={bid} 
                      showSelectButton={isBuyer && project.status === 'pending'}
                      onSelect={() => handleSelectSeller(bid)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* Bid Form for Sellers */}
          {isSeller && project.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle>Place Your Bid</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitBid} className="space-y-4">
                  <div>
                    <Label htmlFor="bidAmount">Bid Amount ($)</Label>
                    <Input
                      id="bidAmount"
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="2500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimatedTime">Estimated Time</Label>
                    <Input
                      id="estimatedTime"
                      type="text"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                      placeholder="2 weeks"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bidMessage">Why you're the right fit</Label>
                    <textarea
                      id="bidMessage"
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      placeholder="Explain your experience and approach..."
                      className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Bid
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Selected Seller Info */}
          {project.selectedSellerId && selectedBid && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Selected Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <BidCard bid={selectedBid} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
