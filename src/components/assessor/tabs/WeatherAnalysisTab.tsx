import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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

// Generate historical precipitation data for full year
const generatePrecipitationData = () => {
  const data = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  for (let m = 0; m < 12; m++) {
    for (let d = 1; d <= daysInMonth[m]; d += 7) {
      data.push({
        date: `${months[m]} ${d}`,
        precipitation: Math.random() * 35
      });
    }
  }
  return data;
};

// Generate historical temperature data for full year
const generateTemperatureData = () => {
  const data = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  for (let m = 0; m < 12; m++) {
    for (let d = 1; d <= daysInMonth[m]; d += 7) {
      const baseTemp = 20 + Math.sin((m / 12) * Math.PI * 2) * 8;
      data.push({
        date: `${months[m]} ${d}`,
        maxTemp: baseTemp + 5 + Math.random() * 5,
        minTemp: baseTemp - 5 + Math.random() * 5
      });
    }
  }
  return data;
};

const precipitationData = generatePrecipitationData();
const temperatureData = generateTemperatureData();

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

      {/* Historical Weather Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Weather Charts (Full Year)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Daily Precipitation Chart */}
          <div>
            <h3 className="text-sm font-medium mb-4">Daily precipitation, mm</h3>
            <ChartContainer
              config={{
                precipitation: {
                  label: "2025",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={precipitationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    label={{ value: 'Precipitation (mm)', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="precipitation" fill="hsl(var(--primary))" name="2025" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Daily Temperature Chart */}
          <div>
            <h3 className="text-sm font-medium mb-4">Daily temperatures, °C</h3>
            <ChartContainer
              config={{
                maxTemp: {
                  label: "2025 Max t°C",
                  color: "hsl(var(--destructive))",
                },
                minTemp: {
                  label: "2025 Min t°C",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                  <Line type="monotone" dataKey="maxTemp" stroke="hsl(var(--destructive))" name="2025 Max t°C" strokeWidth={2} />
                  <Line type="monotone" dataKey="minTemp" stroke="hsl(var(--chart-2))" name="2025 Min t°C" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
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
