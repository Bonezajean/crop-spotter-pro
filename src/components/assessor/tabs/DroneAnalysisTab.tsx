import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { FieldMapWithLayers } from "../FieldMapWithLayers";
import { Upload, Calendar, Satellite, UserCheck, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// Set worker for legacy build
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface DroneAnalysisTabProps {
  fieldId: string;
  farmerName: string;
  cropType: string;
  area: number;
}

interface ParsedReportData {
  report_info: {
    crop: string;
    field_area_ha: number;
    growing_stage: string;
    survey_date: string;
  };
  health_analysis: {
    fine: { percentage: number; hectares: number };
    potential_stress: { percentage: number; hectares: number };
    plant_stress: { percentage: number; hectares: number };
  };
}

export const DroneAnalysisTab = ({ fieldId, farmerName, cropType, area }: DroneAnalysisTabProps) => {
  const [dataSource, setDataSource] = useState<"drone" | "manual">("drone");
  const [manualStress, setManualStress] = useState([17.6]);
  const [manualMoisture, setManualMoisture] = useState([58]);
  const [manualWeed, setManualWeed] = useState([7.3]);
  const [manualPest, setManualPest] = useState([4.4]);
  
  // PDF parsing states
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedReportData | null>(null);
  const [rawPdfText, setRawPdfText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract text from PDF using pdfjs-dist
  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  };

  // Parse extracted text to structured JSON
  const parseReportText = (text: string): ParsedReportData => {
    // Remove branding/metadata
    const cleanText = text
      .replace(/Powered by Agremo/gi, "")
      .replace(/app\.agremo\.com/gi, "")
      .replace(/Agremo/gi, "");

    // Extract crop type
    const cropMatch = cleanText.match(/(?:PLANT STRESS ANALYSIS|ANALYSIS)\s+([a-zA-Z\s]+?)(?:\s+Field area|\s+Survey)/i);
    const crop = cropMatch ? cropMatch[1].trim() : "Unknown";

    // Extract field area
    const areaMatch = cleanText.match(/Field area[:\s]+(\d+\.?\d*)\s*(?:Hectare|ha)/i);
    const fieldAreaHa = areaMatch ? parseFloat(areaMatch[1]) : 0;

    // Extract survey date
    const dateMatch = cleanText.match(/Survey date[:\s]+(\d{2}[-/]\d{2}[-/]\d{4})/i);
    const surveyDate = dateMatch ? dateMatch[1].replace(/\//g, "-") : "";

    // Extract growing stage (BBCH)
    const stageMatch = cleanText.match(/BBCH\s*(\d+)/i);
    const growingStage = stageMatch ? `BBCH ${stageMatch[1]}` : "Not specified";

    // Extract stress levels
    const fineMatch = cleanText.match(/Fine\s+(\d+\.?\d*)%?\s+(\d+\.?\d*)\s*ha/i);
    const potentialMatch = cleanText.match(/Potential\s+(?:Plant\s+)?Stress\s+(\d+\.?\d*)%?\s+(\d+\.?\d*)\s*ha/i);
    const plantStressMatch = cleanText.match(/Plant\s+Stress\s+(\d+\.?\d*)%?\s+(\d+\.?\d*)\s*ha/i);

    return {
      report_info: {
        crop,
        field_area_ha: fieldAreaHa,
        growing_stage: growingStage,
        survey_date: surveyDate,
      },
      health_analysis: {
        fine: {
          percentage: fineMatch ? parseFloat(fineMatch[1]) : 0,
          hectares: fineMatch ? parseFloat(fineMatch[2]) : 0,
        },
        potential_stress: {
          percentage: potentialMatch ? parseFloat(potentialMatch[1]) : 0,
          hectares: potentialMatch ? parseFloat(potentialMatch[2]) : 0,
        },
        plant_stress: {
          percentage: plantStressMatch ? parseFloat(plantStressMatch[1]) : 0,
          hectares: plantStressMatch ? parseFloat(plantStressMatch[2]) : 0,
        },
      },
    };
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsParsing(true);
    try {
      const text = await extractTextFromPdf(file);
      setRawPdfText(text);
      
      const data = parseReportText(text);
      setParsedData(data);
      toast.success("PDF parsed successfully");
    } catch (error) {
      console.error("PDF parsing error:", error);
      toast.error("Failed to parse PDF");
    } finally {
      setIsParsing(false);
    }
  };

  // Calculate healthy area from parsed data
  const healthyHa = parsedData?.health_analysis.fine.hectares ?? 2.8;
  const stressPercent = parsedData?.health_analysis.plant_stress.percentage ?? 17.6;
  const totalArea = parsedData?.report_info.field_area_ha ?? area;

  return (
    <div className="space-y-6">
      {/* Field Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Field Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-sm text-muted-foreground">Farmer: </span>
            <span className="font-medium">{farmerName}</span>
          </div>
          <div className="h-6 w-px bg-border"></div>
          <div>
            <span className="text-sm text-muted-foreground">Crop: </span>
            <span className="font-medium">{parsedData?.report_info.crop || cropType}</span>
          </div>
          <div className="h-6 w-px bg-border"></div>
          <div>
            <span className="text-sm text-muted-foreground">Area: </span>
            <span className="font-medium">{totalArea} ha</span>
          </div>
          {parsedData?.report_info.growing_stage && (
            <>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <span className="text-sm text-muted-foreground">Stage: </span>
                <span className="font-medium">{parsedData.report_info.growing_stage}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Data Source Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Data Source</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={dataSource} onValueChange={(v) => setDataSource(v as "drone" | "manual")}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="drone" className="gap-2">
                <Satellite className="h-4 w-4" />
                Drone Upload
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2">
                <UserCheck className="h-4 w-4" />
                Manual Check
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* PATH 1: DRONE UPLOAD */}
      {dataSource === "drone" && (
        <>
          {/* PDF Report Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Drone Report (PDF)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {isParsing ? (
                  <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
                ) : (
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                )}
                <p className="text-sm font-medium mb-2">
                  {isParsing ? "Parsing PDF..." : "Upload PDF Report"}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supports plant stress analysis reports (Agremo format)
                </p>
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".pdf" 
                  className="hidden"
                  onChange={handlePdfUpload}
                />
                <Button variant="outline" size="sm" disabled={isParsing}>
                  Select PDF File
                </Button>
              </div>
              
              {parsedData && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-success mb-2">✓ Report Parsed Successfully</p>
                  <p className="text-xs text-muted-foreground">
                    Survey Date: {parsedData.report_info.survey_date} | 
                    Crop: {parsedData.report_info.crop} | 
                    Area: {parsedData.report_info.field_area_ha} ha
                  </p>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Flight Date:</span>
                <Input 
                  type="date" 
                  defaultValue={parsedData?.report_info.survey_date?.split("-").reverse().join("-") || "2025-10-22"} 
                  className="max-w-[200px]" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Parsed/Drone Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>
                {parsedData ? "Extracted Metrics" : "Drone Metrics"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Healthy Area (Fine)</p>
                <p className="text-2xl font-bold text-success">{healthyHa.toFixed(2)} ha</p>
                {parsedData && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ({parsedData.health_analysis.fine.percentage}%)
                  </p>
                )}
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Plant Stress</p>
                <p className="text-2xl font-bold text-destructive">{stressPercent}%</p>
                {parsedData && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ({parsedData.health_analysis.plant_stress.hectares} ha)
                  </p>
                )}
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Potential Stress</p>
                <p className="text-2xl font-bold text-warning">
                  {parsedData?.health_analysis.potential_stress.percentage ?? 0}%
                </p>
                {parsedData && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ({parsedData.health_analysis.potential_stress.hectares} ha)
                  </p>
                )}
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Field Area</p>
                <p className="text-2xl font-bold text-primary">{totalArea} ha</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Growing Stage</p>
                <p className="text-2xl font-bold text-primary">
                  {parsedData?.report_info.growing_stage || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Parsed JSON Output */}
          {parsedData && (
            <Card>
              <CardHeader>
                <CardTitle>Extracted JSON Data</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64">
                  {JSON.stringify(parsedData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Visual Map with Layer Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Field Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldMapWithLayers fieldId={fieldId} />
            </CardContent>
          </Card>
        </>
      )}

      {/* PATH 2: MANUAL CHECK */}
      {dataSource === "manual" && (
        <>
          {/* Manual Assessment Date */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Assessment Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Physical Check Date:</span>
                <Input type="date" defaultValue="2025-10-28" className="max-w-[200px]" />
              </div>
            </CardContent>
          </Card>

          {/* Manual Input Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Input Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Stress Detected</label>
                  <span className="text-sm text-primary font-semibold">{manualStress[0]}%</span>
                </div>
                <Slider
                  value={manualStress}
                  onValueChange={setManualStress}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Soil Moisture</label>
                  <span className="text-sm text-primary font-semibold">{manualMoisture[0]}%</span>
                </div>
                <Slider
                  value={manualMoisture}
                  onValueChange={setManualMoisture}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Weed Area (Estimated)</label>
                  <span className="text-sm text-primary font-semibold">{manualWeed[0]}%</span>
                </div>
                <Slider
                  value={manualWeed}
                  onValueChange={setManualWeed}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Pest Area (Estimated)</label>
                  <span className="text-sm text-primary font-semibold">{manualPest[0]}%</span>
                </div>
                <Slider
                  value={manualPest}
                  onValueChange={setManualPest}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Reference Map (No Layer Controls) */}
          <Card>
            <CardHeader>
              <CardTitle>Field Reference Map</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldMapWithLayers fieldId={fieldId} showLayerControls={false} />
            </CardContent>
          </Card>
        </>
      )}

      {/* Assessor Notes (Common to both paths) */}
      <Card>
        <CardHeader>
          <CardTitle>Assessor Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Add your analysis notes here..." 
            className="min-h-[100px]"
            defaultValue="Weed clusters in north. Pest minimal."
          />
          <div className="flex gap-2">
            <Button>Save Analysis</Button>
            <Button 
              variant="outline"
              onClick={() => {
                if (parsedData) {
                  const blob = new Blob([JSON.stringify(parsedData, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `field-${fieldId}-analysis.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("JSON downloaded");
                } else {
                  toast.info("No parsed data to download");
                }
              }}
            >
              Download Summary JSON
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
