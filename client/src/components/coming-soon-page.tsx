import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, Clock } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Construction className="h-16 w-16 text-blue-500" />
              <Clock className="h-6 w-6 text-gray-400 absolute -bottom-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            {title}
          </CardTitle>
          <p className="text-lg text-gray-600">
            Coming Soon
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-6">
            {description || `The ${title} module is currently under development and will be available soon.`}
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              This feature is part of our comprehensive hospital management system and will include advanced functionality for managing hospital operations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}