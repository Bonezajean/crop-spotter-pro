import { Card, CardContent } from "@/components/ui/card";
import { FileWarning } from "lucide-react";

const LossAssessment = () => {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Loss Assessment</h1>
        <p className="text-muted-foreground">Document and evaluate crop loss events</p>
      </div>

      <Card>
        <CardContent className="py-16">
          <div className="text-center text-muted-foreground">
            <FileWarning className="h-16 w-16 mx-auto mb-4" />
            <p className="text-lg mb-2">Loss Assessment Portal</p>
            <p>Comprehensive loss documentation and validation system</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LossAssessment;
