import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home as HomeIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Helmet>
        <title>Page Not Found | CompressYourPhoto</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            The page you're looking for doesn't exist or may have moved.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild data-testid="btn-404-home">
              <Link to="/">
                <HomeIcon className="w-4 h-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" data-testid="btn-404-compress">
              <Link to="/compress">Compress Images</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
