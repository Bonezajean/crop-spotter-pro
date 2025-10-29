import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Sprout,
  MapPin,
  Calendar,
  Droplets,
  Wind,
  ThermometerSun,
  AlertTriangle,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FarmerFieldDetail = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();

  // Mock field data
  const field = {
    id: fieldId,
    name: "South Rice Field",
    crop: "Rice",
    area: 4.2,
    season: "B",
    sowingDate: "2025-09-20",
    healthStatus: "Healthy",
    healthPercent: 87,
    stressPercent: 13,
    soilMoisture: 68,
    location: "Kayonza District",
  };

  // Mock NDVI trend data
  const ndviTrend = [
    { date: "Oct 10", ndvi: 0.65 },
    { date: "Oct 12", ndvi: 0.68 },
    { date: "Oct 14", ndvi: 0.71 },
    { date: "Oct 16", ndvi: 0.73 },
    { date: "Oct 18", ndvi: 0.76 },
    { date: "Oct 20", ndvi: 0.78 },
    { date: "Oct 22", ndvi: 0.81 },
    { date: "Oct 24", ndvi: 0.83 },
    { date: "Oct 26", ndvi: 0.85 },
  ];

  // Mock weather data
  const currentWeather = {
    temperature: 24,
    humidity: 72,
    precipitation: 5.2,
    windSpeed: 12,
  };

  // Mock assessor note
  const assessorNote =
    "Field shows excellent growth progress. NDVI values indicate healthy vegetation. Slight stress detected in northwest corner—recommend monitoring irrigation. Overall crop condition is strong for this stage.";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/farmer/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {field.name}
              </h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <Sprout className="h-5 w-5" />
                {field.crop} • Season {field.season}
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-success/20 text-success border-success/30 text-lg px-4 py-2"
            >
              {field.healthStatus}
            </Badge>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Field Info Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Field Information</CardTitle>
              <CardDescription>Basic field details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Field ID</span>
                  </div>
                  <span className="font-mono text-sm">{field.id}</span>
                </div>

                <div className="flex items-start justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Location</span>
                  </div>
                  <span className="text-sm">{field.location}</span>
                </div>

                <div className="flex items-start justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Area</span>
                  </div>
                  <span className="text-sm font-semibold">{field.area} hectares</span>
                </div>

                <div className="flex items-start justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Sowing Date</span>
                  </div>
                  <span className="text-sm">{field.sowingDate}</span>
                </div>

                <div className="flex items-start justify-between py-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplets className="h-4 w-4" />
                    <span className="text-sm">Soil Moisture</span>
                  </div>
                  <span className="text-sm font-semibold">{field.soilMoisture}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Health Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Health Status</CardTitle>
              <CardDescription>Latest crop health metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Healthy Area</span>
                    <span className="text-2xl font-bold text-success">
                      {field.healthPercent}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success"
                      style={{ width: `${field.healthPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(field.area * (field.healthPercent / 100)).toFixed(2)} ha in good condition
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Stress Detected</span>
                    <span className="text-2xl font-bold text-destructive">
                      {field.stressPercent}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-destructive"
                      style={{ width: `${field.stressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(field.area * (field.stressPercent / 100)).toFixed(2)} ha needs attention
                  </p>
                </div>
              </div>

              {/* Current Weather */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                  Current Weather Conditions
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-lg font-semibold">{currentWeather.temperature}°C</div>
                      <div className="text-xs text-muted-foreground">Temperature</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-lg font-semibold">{currentWeather.humidity}%</div>
                      <div className="text-xs text-muted-foreground">Humidity</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-lg font-semibold">{currentWeather.precipitation} mm</div>
                      <div className="text-xs text-muted-foreground">Rain (24h)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-lg font-semibold">{currentWeather.windSpeed} km/h</div>
                      <div className="text-xs text-muted-foreground">Wind</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NDVI Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>NDVI Trend (Vegetation Health)</CardTitle>
            <CardDescription>
              Normalized Difference Vegetation Index over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ndviTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, 1]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ndvi"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Map Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Field Map (NDVI Overlay)</CardTitle>
            <CardDescription>Visual representation of crop health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Interactive map with NDVI heatmap overlay</p>
                <p className="text-xs mt-1">Green = Healthy | Yellow = Moderate | Red = Stress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessor Note */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Latest Assessor Note
            </CardTitle>
            <CardDescription>Professional assessment from field expert</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground">{assessorNote}</p>
            <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
              Last updated: October 26, 2025 • Assessed by: Field Assessor Team
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerFieldDetail;
