import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Layers } from "lucide-react";

interface FieldMapWithLayersProps {
  fieldId: string;
  showLayerControls?: boolean;
}

type LayerType = "ndvi" | "weed" | "pest";

const layerConfig = {
  ndvi: {
    label: "🌱 Plant Health (NDVI)",
    legend: [
      { color: "hsl(var(--success))", label: "Healthy" },
      { color: "hsl(var(--warning))", label: "Moderate" },
      { color: "hsl(var(--destructive))", label: "Stress" },
    ],
  },
  weed: {
    label: "🟣 Weed Detection",
    legend: [
      { color: "hsl(var(--success))", label: "Clean" },
      { color: "hsl(142 76% 50%)", label: "Low Weed" },
      { color: "hsl(38 92% 50%)", label: "Moderate Weed" },
      { color: "hsl(280 75% 55%)", label: "High Weed" },
    ],
  },
  pest: {
    label: "🔴 Pest Areas",
    legend: [
      { color: "hsl(var(--success))", label: "Clean" },
      { color: "hsl(38 92% 50%)", label: "Low Pest" },
      { color: "hsl(14 85% 58%)", label: "Moderate Pest" },
      { color: "hsl(0 85% 45%)", label: "High Pest" },
    ],
  },
};

export const FieldMapWithLayers = ({ fieldId, showLayerControls = true }: FieldMapWithLayersProps) => {
  const [selectedLayer, setSelectedLayer] = useState<LayerType>("ndvi");

  const currentLayerConfig = layerConfig[selectedLayer];

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-border">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
        <div className="text-center space-y-2">
          <MapPin className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Map View</p>
          <p className="text-xs text-muted-foreground/70">Field ID: {fieldId}</p>
          {showLayerControls && (
            <p className="text-xs text-primary/70">Layer: {currentLayerConfig.label}</p>
          )}
        </div>
      </div>

      {/* Layer Control Overlay (Bottom-Center) */}
      {showLayerControls && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <Card className="bg-card/95 backdrop-blur-sm border-border shadow-lg">
            <div className="px-4 py-3 flex items-center gap-3">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Layer:</span>
              <Select value={selectedLayer} onValueChange={(v) => setSelectedLayer(v as LayerType)}>
                <SelectTrigger className="w-[220px] h-9 bg-background/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ndvi">
                    <span className="flex items-center gap-2">
                      🌱 Plant Health (NDVI) ⭐
                    </span>
                  </SelectItem>
                  <SelectItem value="weed">
                    <span className="flex items-center gap-2">
                      🟣 Weed Detection
                    </span>
                  </SelectItem>
                  <SelectItem value="pest">
                    <span className="flex items-center gap-2">
                      🔴 Pest Areas
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>
      )}

      {/* Dynamic Legend */}
      {showLayerControls && (
        <div className="absolute top-6 right-6 z-10">
          <Card className="bg-card/95 backdrop-blur-sm border-border shadow-lg">
            <div className="px-4 py-3 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Legend
              </p>
              {currentLayerConfig.legend.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-sm border border-border/50"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
