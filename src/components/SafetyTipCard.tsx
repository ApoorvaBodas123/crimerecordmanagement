
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart } from 'lucide-react';
import { SafetyTip } from '@/models/types';
import { Button } from '@/components/ui/button';

interface SafetyTipCardProps {
  tip: SafetyTip;
}

const SafetyTipCard: React.FC<SafetyTipCardProps> = ({ tip }) => {
  const [liked, setLiked] = React.useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="overflow-hidden border-t-4 border-t-green-500 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-green-800">{tip.title}</CardTitle>
          <Badge className="bg-green-100 text-green-800 border-green-200">{tip.category}</Badge>
        </div>
        <CardDescription className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-1 inline" />
          {formatDate(tip.datePosted)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <p className="text-sm text-gray-700">{tip.content}</p>
        
        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center ${liked ? 'text-red-500' : 'text-gray-500'}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
            {liked ? 'Liked' : 'Like'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyTipCard;
