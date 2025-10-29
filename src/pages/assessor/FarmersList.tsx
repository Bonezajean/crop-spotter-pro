import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Search, Users } from "lucide-react";

interface Farmer {
  id: string;
  name: string;
  totalFields: number;
  fieldsProcessed: number;
  location: string;
}

const FarmersList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data
  const farmers: Farmer[] = [
    { id: "F001", name: "Mugabo John", totalFields: 5, fieldsProcessed: 3, location: "Musanze" },
    { id: "F002", name: "Uwase Marie", totalFields: 8, fieldsProcessed: 8, location: "Kayonza" },
    { id: "F003", name: "Habimana Paul", totalFields: 3, fieldsProcessed: 1, location: "Nyagatare" },
    { id: "F004", name: "Mukamana Grace", totalFields: 6, fieldsProcessed: 4, location: "Huye" },
    { id: "F005", name: "Niyonzima Eric", totalFields: 4, fieldsProcessed: 4, location: "Rwamagana" },
  ];

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFarmers = farmers.length;
  const totalFields = farmers.reduce((sum, f) => sum + f.totalFields, 0);
  const totalProcessed = farmers.reduce((sum, f) => sum + f.fieldsProcessed, 0);
  const pendingFields = totalFields - totalProcessed;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Assessor Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Platform Overview & Farmer Management
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Farmers Registered</CardDescription>
              <CardTitle className="text-3xl text-primary">{totalFarmers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Active farmers in system</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Fields Pending Processing</CardDescription>
              <CardTitle className="text-3xl text-warning">{pendingFields}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Requires geometry capture
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Area Monitored</CardDescription>
              <CardTitle className="text-3xl text-success">{totalProcessed * 3.2} ha</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Across {totalProcessed} processed fields
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farmers Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Registered Farmers</CardTitle>
                <CardDescription>View and manage farmer accounts</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search farmers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farmer Name</TableHead>
                    <TableHead className="text-center">Total Fields</TableHead>
                    <TableHead className="text-center">Fields Processed</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFarmers.map((farmer) => (
                    <TableRow key={farmer.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{farmer.name}</TableCell>
                      <TableCell className="text-center">{farmer.totalFields}</TableCell>
                      <TableCell className="text-center">
                        <span className={farmer.fieldsProcessed === farmer.totalFields ? "text-success" : "text-warning"}>
                          {farmer.fieldsProcessed}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {farmer.location}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/assessor/farmer/${farmer.id}/fields`)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmersList;
