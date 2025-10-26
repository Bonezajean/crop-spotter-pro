import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldMap } from "../FieldMap";
import { Sprout, MapPin, Calendar } from "lucide-react";

interface BasicInfoTabProps {
  fieldId: string;
  fieldName: string;
  farmerName: string;
  cropType: string;
  area: number;
  season: string;
  location: string;
}

export const BasicInfoTab = ({
  fieldId,
  fieldName,
  farmerName,
  cropType,
  area,
  season,
  location,
}: BasicInfoTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Field Information</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Field ID</p>
              <p className="font-medium">{fieldId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Field Name</p>
              <p className="font-medium">{fieldName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Farmer</p>
              <p className="font-medium">{farmerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Crop Type</p>
              <div className="flex items-center gap-2">
                <Sprout className="h-4 w-4 text-primary" />
                <p className="font-medium">{cropType}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Area</p>
              <p className="font-medium">{area} hectares</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Season</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="font-medium">Season {season}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Location</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="font-medium">{location}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline">Edit Info</Button>
              <Button variant="outline">View History</Button>
            </div>
          </div>
          <div className="h-[400px]">
            <FieldMap fieldId={fieldId} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
