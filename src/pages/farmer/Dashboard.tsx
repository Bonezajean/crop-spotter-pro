import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, MapPin, Calendar, TrendingUp, Eye } from "lucide-react";

interface Field {
  id: string;
  name: string;
  crop: string;
  area: number;
  season: string;
  healthStatus: "Healthy" | "Moderate" | "At Risk";
  healthPercent: number;
  stressPercent: number;
  lastAssessment: string;
}

const FarmerDashboard = () => {
  const navigate = useNavigate();

  const fields: Field[] = [
    {
      id: "FLD-2847",
      name: "South Rice Field",
      crop: "Rice",
      area: 4.2,
      season: "B",
      healthStatus: "Healthy",
      healthPercent: 87,
      stressPercent: 13,
      lastAssessment: "2025-10-25",
    },
    {
      id: "FLD-2891",
      name: "East Wheat Plot",
      crop: "Wheat",
      area: 3.1,
      season: "A",
      healthStatus: "Moderate",
      healthPercent: 68,
      stressPercent: 32,
      lastAssessment: "2025-10-24",
    },
    {
      id: "FLD-2920",
      name: "Central Soybean",
      crop: "Soybean",
      area: 2.8,
      season: "B",
      healthStatus: "Healthy",
      healthPercent: 91,
      stressPercent: 9,
      lastAssessment: "2025-10-26",
    },
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-success/20 text-success border-success/30";
      case "Moderate":
        return "bg-warning/20 text-warning border-warning/30";
      case "At Risk":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            My Fields Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor your crop health and field performance
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Fields</CardDescription>
              <CardTitle className="text-3xl text-primary">{fields.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Area</CardDescription>
              <CardTitle className="text-3xl text-foreground">
                {fields.reduce((sum, f) => sum + f.area, 0).toFixed(1)} ha
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Healthy Fields</CardDescription>
              <CardTitle className="text-3xl text-success">
                {fields.filter((f) => f.healthStatus === "Healthy").length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Health</CardDescription>
              <CardTitle className="text-3xl text-success">
                {Math.round(
                  fields.reduce((sum, f) => sum + f.healthPercent, 0) / fields.length
                )}
                %
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Fields Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Your Fields</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fields.map((field) => (
              <Card key={field.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{field.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Sprout className="h-4 w-4" />
                        {field.crop} • Season {field.season}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={getHealthColor(field.healthStatus)}>
                      {field.healthStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Field Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Area
                      </div>
                      <div className="font-semibold">{field.area} ha</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Last Check
                      </div>
                      <div className="font-semibold">{field.lastAssessment}</div>
                    </div>
                  </div>

                  {/* Health Metrics */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Healthy Area</span>
                        <span className="font-semibold text-success">
                          {field.healthPercent}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success"
                          style={{ width: `${field.healthPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Stress Detected</span>
                        <span className="font-semibold text-destructive">
                          {field.stressPercent}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-destructive"
                          style={{ width: `${field.stressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full gap-2"
                    onClick={() => navigate(`/farmer/field/${field.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                    View Detailed Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
