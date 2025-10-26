import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, MapPin, Calendar, Sprout } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";

interface Farmer {
  id: string;
  name: string;
  location: string;
  fields: number;
  totalArea: number;
}

interface Field {
  id: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  area: number;
  season: string;
  status: "active" | "moderate" | "healthy";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"farmers" | "fields">("farmers");
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  // Mock data
  const farmers: Farmer[] = [
    { id: "F-001", name: "Mugabo John", location: "Gatsibo, Eastern Province", fields: 3, totalArea: 7.3 },
    { id: "F-002", name: "Kamali Peace", location: "Bugesera, Eastern Province", fields: 2, totalArea: 4.5 },
    { id: "F-003", name: "Uwase Marie", location: "Nyagatare, Eastern Province", fields: 4, totalArea: 9.2 },
  ];

  const allFields: Field[] = [
    { id: "FLD-001", farmerId: "F-001", farmerName: "Mugabo John", crop: "Maize", area: 3.4, season: "B", status: "healthy" },
    { id: "FLD-002", farmerId: "F-002", farmerName: "Kamali Peace", crop: "Wheat", area: 2.1, season: "A", status: "moderate" },
    { id: "FLD-003", farmerId: "F-003", farmerName: "Uwase Marie", crop: "Soybean", area: 1.8, season: "B", status: "active" },
    { id: "FLD-004", farmerId: "F-001", farmerName: "Mugabo John", crop: "Rice", area: 2.5, season: "A", status: "healthy" },
    { id: "FLD-005", farmerId: "F-001", farmerName: "Mugabo John", crop: "Beans", area: 1.4, season: "B", status: "active" },
  ];

  const fields = selectedFarmer 
    ? allFields.filter(f => f.farmerId === selectedFarmer.id)
    : allFields;

  const farmerColumns = [
    { key: "id", label: "Farmer ID" },
    { key: "name", label: "Farmer Name" },
    { 
      key: "location", 
      label: "Location",
      render: (farmer: Farmer) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {farmer.location}
        </div>
      )
    },
    { key: "fields", label: "Total Fields" },
    { 
      key: "totalArea", 
      label: "Total Area (ha)",
      render: (farmer: Farmer) => `${farmer.totalArea} ha`
    },
  ];

  const fieldColumns = [
    { key: "id", label: "Field ID" },
    { key: "farmerName", label: "Farmer" },
    { 
      key: "crop", 
      label: "Crop",
      render: (field: Field) => (
        <div className="flex items-center gap-2">
          <Sprout className="h-4 w-4 text-primary" />
          {field.crop}
        </div>
      )
    },
    { 
      key: "area", 
      label: "Area (ha)",
      render: (field: Field) => `${field.area} ha`
    },
    { key: "season", label: "Season" },
    { 
      key: "status", 
      label: "Status",
      render: (field: Field) => <StatusBadge status={field.status} />
    },
    { 
      key: "actions", 
      label: "Actions",
      render: (field: Field) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(`/assessor/field-detail/${field.id}`)}
          >
            View
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Field Management</h1>
        <p className="text-muted-foreground">Manage farmers and their field registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Farmers" value={farmers.length} icon={MapPin} />
        <StatCard title="Total Fields" value={allFields.length} icon={Sprout} />
        <StatCard title="Total Area" value={`${allFields.reduce((sum, f) => sum + f.area, 0)} ha`} icon={MapPin} />
        <StatCard title="Active Assessments" value="12" icon={Calendar} />
      </div>

      {/* View Selector & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button
            variant={view === "farmers" ? "default" : "outline"}
            onClick={() => {
              setView("farmers");
              setSelectedFarmer(null);
            }}
          >
            View Farmers
          </Button>
          <Button
            variant={view === "fields" ? "default" : "outline"}
            onClick={() => setView("fields")}
          >
            View All Fields
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 w-64" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      {selectedFarmer && (
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setSelectedFarmer(null)}
            className="text-primary hover:underline"
          >
            All Farmers
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">{selectedFarmer.name}</span>
        </div>
      )}

      {/* Table */}
      {view === "farmers" && !selectedFarmer ? (
        <DataTable
          data={farmers}
          columns={farmerColumns}
          onRowClick={(farmer) => {
            setSelectedFarmer(farmer);
            setView("fields");
          }}
        />
      ) : (
        <DataTable data={fields} columns={fieldColumns} />
      )}
    </div>
  );
};

export default Dashboard;
