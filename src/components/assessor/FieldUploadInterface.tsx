import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudUpload, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import area from "@turf/area";
import { kml } from "@tmcw/togeojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  // Initialize map when geometry is available
  useEffect(() => {
    if (!geometry || !mapContainerRef.current) return;

    // Initialize map if not already done
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);
      
      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    // Remove existing GeoJSON layer if any
    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }

    // Add new GeoJSON layer with NDVI-style coloring
    geoJsonLayerRef.current = L.geoJSON(geometry, {
      style: {
        color: "#10b981",
        weight: 3,
        fillColor: "#22c55e",
        fillOpacity: 0.4
      }
    }).addTo(mapRef.current);

    // Fit map to the geometry bounds
    const bounds = geoJsonLayerRef.current.getBounds();
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [geometry]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const text = await file.text();
      let geoJSON;

      if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
        geoJSON = JSON.parse(text);
      } else if (file.name.endsWith('.kml')) {
        // Parse KML using togeojson library
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(text, "text/xml");
        geoJSON = kml(kmlDoc);
        
        if (!geoJSON.features || geoJSON.features.length === 0) {
          throw new Error("No valid geometry found in KML file");
        }
      } else if (file.name.endsWith('.kmz')) {
        toast({
          title: "KMZ Not Supported",
          description: "Please extract the KML file from the KMZ archive and upload it directly",
          variant: "destructive",
        });
        setUploading(false);
        return;
      } else {
        throw new Error("Unsupported file format. Please use .geojson, .json, or .kml");
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
                Supported formats: .geojson, .json, .kml
              </p>
            </div>
            <Input
              type="file"
              accept=".geojson,.json,.kml"
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
          {/* Map Preview */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Field Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={mapContainerRef}
                className="aspect-square rounded-lg border border-border overflow-hidden"
                style={{ minHeight: "300px" }}
              />
            </CardContent>
          </Card>

          {/* Geometry Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-500" />
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
              <div className="space-y-2">
                <Label>Features Count</Label>
                <Input value={`${geometry.features?.length || 1} feature(s)`} disabled />
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
