import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudUpload, FileCheck, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import area from "@turf/area";

interface FieldUploadInterfaceProps {
  fieldId: string | null;
  farmerName: string;
  onBack: () => void;
}

export const FieldUploadInterface = ({ fieldId, farmerName, onBack }: FieldUploadInterfaceProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [geometry, setGeometry] = useState<any>(null);
  const [calculatedArea, setCalculatedArea] = useState<number | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const text = await file.text();
      let geoJSON;

      if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
        geoJSON = JSON.parse(text);
      } else if (file.name.endsWith('.kml') || file.name.endsWith('.kmz')) {
        toast({
          title: "KML/KMZ Upload",
          description: "KML/KMZ conversion will be handled by backend",
        });
        return;
      } else {
        throw new Error("Unsupported file format");
      }

      // Calculate area in hectares
      const areaInSqMeters = area(geoJSON);
      const areaInHectares = areaInSqMeters / 10000;

      setGeometry(geoJSON);
      setCalculatedArea(Number(areaInHectares.toFixed(2)));

      toast({
        title: "File Uploaded Successfully",
        description: `Field geometry captured. Area: ${areaInHectares.toFixed(2)} ha`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const handleProcessField = async () => {
    if (!geometry || !calculatedArea) {
      toast({
        title: "Missing Data",
        description: "Please upload a valid field geometry file",
        variant: "destructive",
      });
      return;
    }

    // TODO: Call EOSDA API to register field and get Field ID
    toast({
      title: "Processing Field",
      description: "Syncing with EOSDA API to generate Field ID...",
    });

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Field Processed Successfully",
        description: `Field ID: FLD-${Math.floor(Math.random() * 10000)}`,
      });
      navigate("/assessor/dashboard");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Back to Selection
      </Button>

      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-primary/50 hover:border-primary transition-all">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-fit p-6 bg-primary/10 rounded-full">
              <CloudUpload className="h-16 w-16 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {geometry ? "File Uploaded" : "Drop your field file here"}
              </h3>
              <p className="text-muted-foreground">
                or click to browse your files
              </p>
            </div>
            <Input
              type="file"
              accept=".geojson,.json,.kml,.kmz,.shp,.zip"
              onChange={handleFileUpload}
              disabled={uploading}
              className="max-w-md mx-auto cursor-pointer file:cursor-pointer"
            />
            {uploading && (
              <p className="text-sm text-primary animate-pulse">Processing file...</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Geometry Preview & Metadata */}
      {geometry && calculatedArea && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Geometry Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-success" />
                Geometry Captured
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Farmer</Label>
                <Input value={farmerName} disabled />
              </div>
              <div className="space-y-2">
                <Label>Calculated Area</Label>
                <Input value={`${calculatedArea} hectares`} disabled />
              </div>
              <div className="space-y-2">
                <Label>Season (Auto-filled)</Label>
                <Input value="Season B" disabled />
              </div>
            </CardContent>
          </Card>

          {/* Map Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Field Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border">
                <div className="text-center text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Map preview will render here</p>
                  <p className="text-xs mt-1">Mapbox GL JS integration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      {geometry && calculatedArea && (
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button 
            onClick={handleProcessField}
            className="bg-primary hover:bg-primary/90"
          >
            Sync & Process Field (EOSDA API)
          </Button>
        </div>
      )}
    </div>
  );
};
