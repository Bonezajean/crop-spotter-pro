import { Card, CardContent } from "@/components/ui/card";
import { Satellite } from "lucide-react";

const CropMonitoring = () => {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Crop Monitoring</h1>
        <p className="text-muted-foreground">Satellite-based crop health and NDVI analysis</p>
      </div>

      <Card>
        <CardContent className="py-16">
          <div className="text-center text-muted-foreground">
            <Satellite className="h-16 w-16 mx-auto mb-4" />
            <p className="text-lg mb-2">Crop Monitoring Portal</p>
            <p>EOSDA integration with NDVI maps and satellite imagery</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CropMonitoring;
