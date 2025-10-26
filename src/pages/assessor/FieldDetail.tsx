import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Calendar, Sprout, Thermometer, CloudRain, Droplets, Wind, Cloud } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

const FieldDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessorNotes, setAssessorNotes] = useState("");

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

  // Mock weather data
  const currentWeather = {
    temperature: 23,
    precipitation: 0.1,
    humidity: 61,
    clouds: 75,
    wind: 1,
  };

  const forecast = [
    { date: "Oct 23", tempHigh: 27, tempLow: 16, rain: 5.9, humidity: 76, clouds: 68, wind: 2 },
    { date: "Oct 24", tempHigh: 30, tempLow: 16, rain: 9.1, humidity: 75, clouds: 66, wind: 2 },
    { date: "Oct 25", tempHigh: 24, tempLow: 16, rain: 29.1, humidity: 87, clouds: 75, wind: 3 },
    { date: "Oct 26", tempHigh: 26, tempLow: 17, rain: 3.2, humidity: 72, clouds: 60, wind: 2 },
    { date: "Oct 27", tempHigh: 28, tempLow: 18, rain: 0.5, humidity: 65, clouds: 45, wind: 1 },
    { date: "Oct 28", tempHigh: 29, tempLow: 18, rain: 0.0, humidity: 58, clouds: 30, wind: 1 },
    { date: "Oct 29", tempHigh: 30, tempLow: 19, rain: 0.2, humidity: 62, clouds: 40, wind: 2 },
  ];

  const riskAssessment = {
    drought: { level: "low", score: 1 },
    flood: { level: "moderate", score: 2 },
    heat: { level: "low", score: 1 },
    humidity: { level: "normal", score: 1 },
    overall: 1.5,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-3xl font-bold mb-2">Field Detail View: {field.id}</h1>
        <p className="text-muted-foreground">{field.farmer} - {field.crop}</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">📋 Basic Info</TabsTrigger>
          <TabsTrigger value="weather">🌦️ Weather Analysis</TabsTrigger>
          <TabsTrigger value="crop">🌿 Crop Analysis</TabsTrigger>
          <TabsTrigger value="overview">📝 Overview</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Field Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Field ID</span>
                  <span className="font-medium">{field.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Field Name</span>
                  <span className="font-medium">{field.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Farmer</span>
                  <span className="font-medium">{field.farmer}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Crop Type</span>
                  <span className="font-medium flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-primary" />
                    {field.crop}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Area</span>
                  <span className="font-medium">{field.area} hectares</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Season</span>
                  <span className="font-medium">{field.season}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
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
                <CardTitle>Field Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Map Integration</p>
                    <p className="text-sm">Field boundary visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">Edit Info</Button>
            <Button variant="outline">View History</Button>
          </div>
        </TabsContent>

        {/* Weather Analysis Tab */}
        <TabsContent value="weather" className="space-y-6">
          {/* Field Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Field Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Farmer</p>
                <p className="font-medium">{field.farmer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Field ID</p>
                <p className="font-medium">{field.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Crop Type</p>
                <p className="font-medium">{field.crop}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Area</p>
                <p className="font-medium">{field.area} ha</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-medium">Gatsibo, Rwanda</p>
              </div>
            </CardContent>
          </Card>

          {/* Current Weather */}
          <Card>
            <CardHeader>
              <CardTitle>Current Weather (EOSDA)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Thermometer className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="text-xl font-bold">{currentWeather.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <CloudRain className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Precipitation</p>
                    <p className="text-xl font-bold">{currentWeather.precipitation} mm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Droplets className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className="text-xl font-bold">{currentWeather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-500/10 rounded-lg">
                    <Cloud className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clouds</p>
                    <p className="text-xl font-bold">{currentWeather.clouds}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-500/10 rounded-lg">
                    <Wind className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Wind</p>
                    <p className="text-xl font-bold">{currentWeather.wind} m/s</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Temp (°C)</th>
                      <th className="text-left py-3 px-2">Rain (mm)</th>
                      <th className="text-left py-3 px-2">Humidity</th>
                      <th className="text-left py-3 px-2">Clouds</th>
                      <th className="text-left py-3 px-2">Wind</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecast.map((day, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-medium">{day.date}</td>
                        <td className="py-3 px-2">{day.tempHigh} / {day.tempLow}</td>
                        <td className="py-3 px-2">{day.rain}</td>
                        <td className="py-3 px-2">{day.humidity}%</td>
                        <td className="py-3 px-2">{day.clouds}%</td>
                        <td className="py-3 px-2">{day.wind} m/s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Risk Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Summary (Auto-Generated)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Drought Risk</span>
                  <StatusBadge status="healthy" label="Low" />
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Flood Risk</span>
                  <StatusBadge status="moderate" />
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Heat Stress</span>
                  <StatusBadge status="healthy" label="Low" />
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span>Humidity Risk</span>
                  <StatusBadge status="healthy" label="Normal" />
                </div>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-lg font-medium">Overall Weather Score: <span className="text-primary">{riskAssessment.overall} / 5</span> (LOW)</p>
              </div>
            </CardContent>
          </Card>

          {/* Assessor Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Assessor Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add your assessment notes here..."
                value={assessorNotes}
                onChange={(e) => setAssessorNotes(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button>Save Assessment</Button>
                <Button variant="outline">Refresh EOSDA Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crop Analysis Tab */}
        <TabsContent value="crop" className="space-y-6">
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Sprout className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg mb-2">Crop Analysis - Satellite/Drone Data</p>
                <p>This section will display NDVI maps, health metrics, and crop analysis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Field Status</p>
                  <StatusBadge status="healthy" />
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Weather Risk</p>
                  <p className="text-lg font-bold text-primary">Low (1.5/5)</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Recommendation</p>
                  <p className="font-medium">Continue monitoring</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write comprehensive feedback for this field assessment..."
                rows={6}
              />
              <div className="flex gap-2">
                <Button>Save Feedback</Button>
                <Button variant="outline">Generate Full Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FieldDetail;
