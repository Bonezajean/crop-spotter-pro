import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudUpload, FileCheck, Layers, Map as MapIcon, Loader2 } from "lucide-react";
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

type TerrainType = "osm" | "satellite" | "terrain" | "topo";
type IndexType = "none" | "ndvi" | "msavi" | "evi" | "ndwi";

const terrainOptions: Record<TerrainType, { label: string; url: string; attribution: string }> = {
  osm: {
    label: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  satellite: {
    label: "Satellite (ESRI)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">ESRI</a>'
  },
  terrain: {
    label: "Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
  },
  topo: {
    label: "Topo (Stamen)",
    url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="http://stamen.com">Stamen Design</a>'
  }
};

const indexOptions: Record<IndexType, { label: string; description: string; colors: string[] }> = {
  none: {
    label: "No Index",
    description: "Field boundary only",
    colors: []
  },
  ndvi: {
    label: "NDVI",
    description: "Normalized Difference Vegetation Index",
    colors: ["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850"]
  },
  msavi: {
    label: "MSAVI",
    description: "Modified Soil Adjusted Vegetation Index",
    colors: ["#8c510a", "#bf812d", "#dfc27d", "#80cdc1", "#35978f", "#01665e"]
  },
  evi: {
    label: "EVI",
    description: "Enhanced Vegetation Index",
    colors: ["#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837"]
  },
  ndwi: {
    label: "NDWI",
    description: "Normalized Difference Water Index",
    colors: ["#a50026", "#f46d43", "#fdae61", "#fee090", "#abd9e9", "#74add1", "#313695"]
  }
};

export const FieldUploadInterface = ({ fieldId, farmerName, onBack }: FieldUploadInterfaceProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [geometry, setGeometry] = useState<any>(null);
  const [calculatedArea, setCalculatedArea] = useState<number | null>(null);
  const [terrain, setTerrain] = useState<TerrainType>("osm");
  const [selectedIndex, setSelectedIndex] = useState<IndexType>("none");
  const [indexData, setIndexData] = useState<Record<IndexType, any>>({} as any);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const indexLayerRef = useRef<L.GeoJSON | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);
    
    // Add initial tile layer
    const terrainConfig = terrainOptions[terrain];
    tileLayerRef.current = L.tileLayer(terrainConfig.url, {
      attribution: terrainConfig.attribution
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update tile layer when terrain changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    const terrainConfig = terrainOptions[terrain];
    tileLayerRef.current = L.tileLayer(terrainConfig.url, {
      attribution: terrainConfig.attribution
    }).addTo(mapRef.current);
  }, [terrain]);

  // Update geometry layer
  useEffect(() => {
    if (!geometry || !mapRef.current) return;

    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }

    geoJsonLayerRef.current = L.geoJSON(geometry, {
      style: {
        color: "#10b981",
        weight: 3,
        fillColor: "#22c55e",
        fillOpacity: selectedIndex === "none" ? 0.3 : 0.1
      }
    }).addTo(mapRef.current);

    const bounds = geoJsonLayerRef.current.getBounds();
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geometry, selectedIndex]);

  // Update index layer
  useEffect(() => {
    if (!mapRef.current) return;

    if (indexLayerRef.current) {
      mapRef.current.removeLayer(indexLayerRef.current);
      indexLayerRef.current = null;
    }

    if (selectedIndex === "none" || !indexData[selectedIndex]) return;

    const data = indexData[selectedIndex];
    indexLayerRef.current = L.geoJSON(data, {
      style: (feature) => {
        const value = feature?.properties?.value || 0;
        const colors = indexOptions[selectedIndex].colors;
        const colorIndex = Math.min(Math.floor(value * colors.length), colors.length - 1);
        return {
          color: colors[colorIndex],
          weight: 1,
          fillColor: colors[colorIndex],
          fillOpacity: 0.7
        };
      }
    }).addTo(mapRef.current);
  }, [selectedIndex, indexData]);

  // Simulate EOSDA API to generate index data
  const simulateEOSDAProcessing = useCallback(async (geom: any) => {
    setProcessing(true);
    
    toast({
      title: "Processing with EOSDA API",
      description: "Generating vegetation indices...",
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate simulated index data by creating grid cells within the geometry
    const bounds = L.geoJSON(geom).getBounds();
    const gridSize = 0.001; // ~100m cells
    const indices: IndexType[] = ["ndvi", "msavi", "evi", "ndwi"];
    const generatedData: Record<IndexType, any> = {} as any;

    indices.forEach(index => {
      const features: any[] = [];
      const lat1 = bounds.getSouth();
      const lat2 = bounds.getNorth();
      const lng1 = bounds.getWest();
      const lng2 = bounds.getEast();

      for (let lat = lat1; lat < lat2; lat += gridSize) {
        for (let lng = lng1; lng < lng2; lng += gridSize) {
          // Generate random value with spatial correlation (simulate real index patterns)
          const baseValue = 0.5 + Math.sin(lat * 1000) * 0.2 + Math.cos(lng * 1000) * 0.2;
          const noise = (Math.random() - 0.5) * 0.3;
          const value = Math.max(0, Math.min(1, baseValue + noise));

          features.push({
            type: "Feature",
            properties: { value, index },
            geometry: {
              type: "Polygon",
              coordinates: [[
                [lng, lat],
                [lng + gridSize, lat],
                [lng + gridSize, lat + gridSize],
                [lng, lat + gridSize],
                [lng, lat]
              ]]
            }
          });
        }
      }

      generatedData[index] = {
        type: "FeatureCollection",
        features
      };
    });

    setIndexData(generatedData);
    setProcessing(false);

    toast({
      title: "Processing Complete",
      description: "All vegetation indices generated. Select an index to view.",
    });
  }, [toast]);

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
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(text, "text/xml");
        
        // Check for XML parsing errors
        const parseError = kmlDoc.querySelector("parsererror");
        if (parseError) {
          throw new Error("Invalid KML file: XML parsing failed");
        }
        
        geoJSON = kml(kmlDoc);
        
        // Check if kml() returned null
        if (!geoJSON) {
          throw new Error("Failed to parse KML file - no valid geometry found");
        }
        
        // Normalize to FeatureCollection if needed
        if (geoJSON.type === "Feature") {
          geoJSON = {
            type: "FeatureCollection",
            features: [geoJSON]
          };
        } else if (geoJSON.type !== "FeatureCollection") {
          geoJSON = {
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              properties: {},
              geometry: geoJSON
            }]
          };
        }
        
        // Filter out features without valid geometry
        const validFeatures = geoJSON.features?.filter(
          (f: any) => f.geometry && f.geometry.type
        ) || [];
        
        if (validFeatures.length === 0) {
          throw new Error("No valid polygon geometry found in KML file");
        }
        
        geoJSON.features = validFeatures;
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

      const areaInSqMeters = area(geoJSON);
      const areaInHectares = areaInSqMeters / 10000;

      setGeometry(geoJSON);
      setCalculatedArea(Number(areaInHectares.toFixed(2)));
      setSelectedIndex("none");
      setIndexData({} as any);

      toast({
        title: "File Uploaded Successfully",
        description: `Field geometry captured. Area: ${areaInHectares.toFixed(2)} ha`,
      });

      // Auto-process with EOSDA simulation
      await simulateEOSDAProcessing(geoJSON);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [toast, simulateEOSDAProcessing]);

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
              disabled={uploading || processing}
              className="max-w-md mx-auto cursor-pointer file:cursor-pointer"
            />
            {(uploading || processing) && (
              <div className="flex items-center justify-center gap-2 text-sm text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploading ? "Processing file..." : "Generating indices..."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map Preview with Controls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            Field Preview
          </CardTitle>
          <div className="flex gap-3">
            {/* Terrain Selector */}
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <Select value={terrain} onValueChange={(v) => setTerrain(v as TerrainType)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(terrainOptions).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Index Selector */}
            {Object.keys(indexData).length > 0 && (
              <Select value={selectedIndex} onValueChange={(v) => setSelectedIndex(v as IndexType)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(indexOptions).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            ref={mapContainerRef}
            className="h-[400px] rounded-lg border border-border overflow-hidden"
          />
          
          {/* Index Legend */}
          {selectedIndex !== "none" && indexOptions[selectedIndex].colors.length > 0 && (
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">{indexOptions[selectedIndex].label}:</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Low</span>
                {indexOptions[selectedIndex].colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-4 first:rounded-l last:rounded-r"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <span className="text-xs text-muted-foreground">High</span>
              </div>
              <span className="text-xs text-muted-foreground ml-auto">
                {indexOptions[selectedIndex].description}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Geometry Info */}
      {geometry && calculatedArea && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-green-500" />
              Geometry Captured
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {geometry && calculatedArea && (
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button 
            onClick={handleProcessField}
            disabled={processing}
            className="bg-primary hover:bg-primary/90"
          >
            Sync & Process Field (EOSDA API)
          </Button>
        </div>
      )}
    </div>
  );
};
