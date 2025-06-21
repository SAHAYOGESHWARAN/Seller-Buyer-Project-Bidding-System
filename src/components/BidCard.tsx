
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bid } from '@/types';
import { DollarSign, Clock, User } from 'lucide-react';

interface BidCardProps {
  bid: Bid;
  onSelect?: () => void;
  showSelectButton?: boolean;
}

const BidCard = ({ bid, onSelect, showSelectButton = false }: BidCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <User className="w-5 h-5 mr-2" />
          {bid.sellerName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            <span className="font-semibold">${bid.bidAmount}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-600" />
            <span>{bid.estimatedTime}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{bid.message}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Bid placed: {new Date(bid.createdAt).toLocaleDateString()}
          </span>
          {showSelectButton && onSelect && (
            <Button onClick={onSelect} size="sm">
              Select Seller
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BidCard;
