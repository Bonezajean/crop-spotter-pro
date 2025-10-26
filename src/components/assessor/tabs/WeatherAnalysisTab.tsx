import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";

interface WeatherData {
  date: string;
  tempHigh: number;
  tempLow: number;
  rain: number;
  humidity: number;
  clouds: number;
  wind: number;
}

const mockWeatherForecast: WeatherData[] = [
  { date: "Oct 23", tempHigh: 27, tempLow: 16, rain: 5.9, humidity: 76, clouds: 68, wind: 2 },
  { date: "Oct 24", tempHigh: 30, tempLow: 16, rain: 9.1, humidity: 75, clouds: 66, wind: 2 },
  { date: "Oct 25", tempHigh: 24, tempLow: 16, rain: 29.1, humidity: 87, clouds: 75, wind: 3 },
  { date: "Oct 26", tempHigh: 26, tempLow: 17, rain: 3.2, humidity: 72, clouds: 60, wind: 2 },
  { date: "Oct 27", tempHigh: 28, tempLow: 18, rain: 0.5, humidity: 65, clouds: 45, wind: 1 },
  { date: "Oct 28", tempHigh: 29, tempLow: 18, rain: 0.0, humidity: 58, clouds: 30, wind: 1 },
  { date: "Oct 29", tempHigh: 30, tempLow: 19, rain: 0.2, humidity: 62, clouds: 40, wind: 2 },
];

interface WeatherAnalysisTabProps {
  fieldId: string;
  farmerName: string;
  cropType: string;
  location: string;
}

export const WeatherAnalysisTab = ({ fieldId, farmerName, cropType, location }: WeatherAnalysisTabProps) => {
  return (
    <div className="space-y-6">
      {/* Field Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Field Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Farmer</p>
            <p className="font-medium">{farmerName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Field ID</p>
            <p className="font-medium">{fieldId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Crop Type</p>
            <p className="font-medium">{cropType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{location}</p>
          </div>
        </CardContent>
      </Card>

      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-3">
            <Thermometer className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="text-lg font-semibold">23°C</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Droplets className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Precipitation</p>
              <p className="text-lg font-semibold">0.1 mm</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Droplets className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-lg font-semibold">61%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Cloud className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Clouds</p>
              <p className="text-lg font-semibold">75%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wind className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-lg font-semibold">1 m/s</p>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Temp (°C)</TableHead>
                <TableHead>Rain (mm)</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Clouds</TableHead>
                <TableHead>Wind</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWeatherForecast.map((day) => (
                <TableRow key={day.date}>
                  <TableCell className="font-medium">{day.date}</TableCell>
                  <TableCell>{day.tempHigh} / {day.tempLow}</TableCell>
                  <TableCell>{day.rain}</TableCell>
                  <TableCell>{day.humidity}%</TableCell>
                  <TableCell>{day.clouds}%</TableCell>
                  <TableCell>{day.wind} m/s</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span>Drought Risk</span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success"></span>
              <span className="font-medium">Low</span>
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span>Flood Risk</span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              <span className="font-medium">Moderate</span>
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span>Heat Stress</span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success"></span>
              <span className="font-medium">Low</span>
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span>Humidity Risk</span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-success"></span>
              <span className="font-medium">Normal</span>
            </span>
          </div>
          <div className="pt-4 mt-4 border-t">
            <p className="text-lg font-semibold">Overall Weather Score: <span className="text-success">1.5 / 5 (LOW)</span></p>
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
            placeholder="Add your weather analysis notes here..." 
            className="min-h-[100px]"
            defaultValue="Mild rains, normal temperature — no risk observed."
          />
          <div className="flex gap-2">
            <Button>Save Assessment</Button>
            <Button variant="outline">Refresh EOSDA Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
