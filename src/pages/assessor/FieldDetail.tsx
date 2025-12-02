import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, Sprout } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { FieldMapWithLayers } from "@/components/assessor/FieldMapWithLayers";

const FieldDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock field data
  const field = {
    id: "FLD-001",
    name: "North Maize Plot",
    farmer: "Mugabo John",
    crop: "Maize",
    area: 3.4,
    season: "Season B",
    location: "Gatsibo, Eastern Province, Rwanda",
    sowingDate: "2025-09-15",
    status: "healthy" as const,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-3xl font-bold mb-2">Field Detail: {id}</h1>
        <p className="text-muted-foreground">{field.farmer} - {field.crop}</p>
      </div>

      {/* Full Width Map with NDVI Heatmap */}
      <div className="mb-6">
        <FieldMapWithLayers fieldId={id || field.id} showLayerControls={true} />
      </div>

      {/* Basic Info Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Field Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Field ID</span>
              <span className="font-medium">{field.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Field Name</span>
              <span className="font-medium">{field.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Farmer</span>
              <span className="font-medium">{field.farmer}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Crop Type</span>
              <span className="font-medium flex items-center gap-2">
                <Sprout className="h-4 w-4 text-primary" />
                {field.crop}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Area</span>
              <span className="font-medium">{field.area} hectares</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Season</span>
              <span className="font-medium">{field.season}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Sowing Date</span>
              <span className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {field.sowingDate}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {field.location}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status & Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Field Status</p>
              <StatusBadge status={field.status} />
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">NDVI Health Score</p>
              <p className="text-2xl font-bold text-primary">78%</p>
              <p className="text-xs text-muted-foreground mt-1">Last updated: 2 days ago</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Stress Level</p>
              <p className="text-2xl font-bold text-warning">12%</p>
              <p className="text-xs text-muted-foreground mt-1">Moderate stress detected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 mt-6">
        <Button variant="outline">Edit Info</Button>
        <Button variant="outline">View History</Button>
        <Button>Generate Report</Button>
      </div>
    </div>
  );
};

export default FieldDetail;
