import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, Home } from 'lucide-react';
import { usePageTitle } from '@/hooks/use-page-title';

const NotFound = () => {
  usePageTitle('Page Not Found');

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Zap className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-display text-foreground">404</h1>
          <p className="text-lg text-muted-foreground">This page doesn't exist on the blockchain</p>
          <p className="text-sm text-muted-foreground">The route you're looking for couldn't be found.</p>
        </div>
        <Link to="/">
          <Button size="lg" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
