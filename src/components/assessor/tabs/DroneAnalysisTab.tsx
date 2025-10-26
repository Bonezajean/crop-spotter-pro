import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldMap } from "../FieldMap";
import { Upload, Calendar } from "lucide-react";

interface DroneAnalysisTabProps {
  fieldId: string;
  farmerName: string;
  cropType: string;
  area: number;
}

export const DroneAnalysisTab = ({ fieldId, farmerName, cropType, area }: DroneAnalysisTabProps) => {
  return (
    <div className="space-y-6">
      {/* Field Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Field Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div>
            <span className="text-sm text-muted-foreground">Farmer: </span>
            <span className="font-medium">{farmerName}</span>
          </div>
          <div className="h-6 w-px bg-border"></div>
          <div>
            <span className="text-sm text-muted-foreground">Crop: </span>
            <span className="font-medium">{cropType}</span>
          </div>
          <div className="h-6 w-px bg-border"></div>
          <div>
            <span className="text-sm text-muted-foreground">Area: </span>
            <span className="font-medium">{area} ha</span>
          </div>
        </CardContent>
      </Card>

      {/* Drone Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Drone Data Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">Upload JSON or GeoJSON</p>
            <p className="text-xs text-muted-foreground mb-4">Drag file here or click to browse</p>
            <Input type="file" accept=".json,.geojson" className="max-w-xs mx-auto" />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Flight Date:</span>
            <Input type="date" defaultValue="2025-10-22" className="max-w-[200px]" />
          </div>
        </CardContent>
      </Card>

      {/* Drone Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Drone Metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Healthy Area</p>
            <p className="text-2xl font-bold text-success">2.8 ha</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Stress Detected</p>
            <p className="text-2xl font-bold text-warning">17.6%</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Soil Moisture</p>
            <p className="text-2xl font-bold text-primary">58%</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Weed Area</p>
            <p className="text-2xl font-bold text-destructive">0.25 ha</p>
            <p className="text-xs text-muted-foreground mt-1">(7.3%)</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Pest Area</p>
            <p className="text-2xl font-bold text-warning">0.15 ha</p>
            <p className="text-xs text-muted-foreground mt-1">(4.4%)</p>
          </div>
        </CardContent>
      </Card>

      {/* Visual Map */}
      <Card>
        <CardHeader>
          <CardTitle>Field Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldMap fieldId={fieldId} showLegend={true} overlayType="ndvi" />
        </CardContent>
      </Card>

      {/* Assessor Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Assessor Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Add your drone analysis notes here..." 
            className="min-h-[100px]"
            defaultValue="Weed clusters in north. Pest minimal."
          />
          <div className="flex gap-2">
            <Button>Save Analysis</Button>
            <Button variant="outline">Download Summary JSON</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
