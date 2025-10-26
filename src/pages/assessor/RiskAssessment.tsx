import { Card, CardContent } from "@/components/ui/card";
import { Scan } from "lucide-react";

const RiskAssessment = () => {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Risk Assessment</h1>
        <p className="text-muted-foreground">Drone-based crop analysis and risk evaluation</p>
      </div>

      <Card>
        <CardContent className="py-16">
          <div className="text-center text-muted-foreground">
            <Scan className="h-16 w-16 mx-auto mb-4" />
            <p className="text-lg mb-2">Risk Assessment Portal</p>
            <p>Similar interface to Field Detail with drone analysis capabilities</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessment;
