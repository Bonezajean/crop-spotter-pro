import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Eye, Edit, Plus } from "lucide-react";

interface Field {
  id: string | null;
  fieldName: string;
  crop: string;
  area: number;
  season: string;
  status: "Processing Needed" | "Processed";
  sowingDate: string;
}

const FarmerFieldsList = () => {
  const navigate = useNavigate();
  const { farmerId } = useParams();

  // Mock farmer data
  const farmerName = farmerId === "F001" ? "Mugabo John" : "Unknown Farmer";

  // Sample fields data
  const [fields] = useState<Field[]>([
    {
      id: null,
      fieldName: "North Maize Plot",
      crop: "Maize",
      area: 0,
      season: "B",
      status: "Processing Needed",
      sowingDate: "2025-10-15",
    },
    {
      id: "FLD-2847",
      fieldName: "South Rice Field",
      crop: "Rice",
      area: 4.2,
      season: "B",
      status: "Processed",
      sowingDate: "2025-09-20",
    },
    {
      id: "FLD-2891",
      fieldName: "East Wheat Plot",
      crop: "Wheat",
      area: 3.1,
      season: "A",
      status: "Processed",
      sowingDate: "2025-08-10",
    },
    {
      id: null,
      fieldName: "West Cassava Field",
      crop: "Cassava",
      area: 0,
      season: "B",
      status: "Processing Needed",
      sowingDate: "2025-10-20",
    },
    {
      id: "FLD-2920",
      fieldName: "Central Soybean",
      crop: "Soybean",
      area: 2.8,
      season: "B",
      status: "Processed",
      sowingDate: "2025-09-15",
    },
  ]);

  const processedCount = fields.filter((f) => f.status === "Processed").length;
  const pendingCount = fields.filter((f) => f.status === "Processing Needed").length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/assessor/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Farmers List
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {farmerName}'s Fields
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage and monitor field data
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Fields</CardDescription>
              <CardTitle className="text-3xl text-foreground">{fields.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Processed Fields</CardDescription>
              <CardTitle className="text-3xl text-success">{processedCount}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Processing</CardDescription>
              <CardTitle className="text-3xl text-warning">{pendingCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Fields Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Field Management</CardTitle>
                <CardDescription>View, edit, and process field data</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Field
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field ID</TableHead>
                    <TableHead>Field Name</TableHead>
                    <TableHead className="hidden md:table-cell">Crop</TableHead>
                    <TableHead className="text-center">Area (ha)</TableHead>
                    <TableHead className="hidden lg:table-cell text-center">Season</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">
                        {field.id || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="font-medium">{field.fieldName}</TableCell>
                      <TableCell className="hidden md:table-cell">{field.crop}</TableCell>
                      <TableCell className="text-center">
                        {field.area > 0 ? field.area.toFixed(1) : "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-center">
                        Season {field.season}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={field.status === "Processed" ? "default" : "secondary"}
                          className={
                            field.status === "Processed"
                              ? "bg-success/20 text-success border-success/30"
                              : "bg-warning/20 text-warning border-warning/30"
                          }
                        >
                          {field.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {field.status === "Processing Needed" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/assessor/field-processing?fieldId=${field.fieldName}&farmer=${farmerName}`
                                )
                              }
                              className="gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden sm:inline">Process</span>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/assessor/field/${field.id}`)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          )}
                        </div>
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

export default FarmerFieldsList;
