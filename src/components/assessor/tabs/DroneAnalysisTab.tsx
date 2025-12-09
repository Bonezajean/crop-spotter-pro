import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { FieldMapWithLayers } from "../FieldMapWithLayers";
import { Upload, Calendar, Satellite, UserCheck, FileText, Loader2, Image, Map } from "lucide-react";
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

interface StressLevel {
  name: string;
  percentage: number;
  hectares: number;
}

interface ParsedReportData {
  report_info: {
    crop: string;
    field_area_ha: number;
    growing_stage: string;
    survey_date: string;
    analysis_name: string;
  };
  stress_levels: StressLevel[];
  total_affected: {
    hectares: number;
    percentage: number;
  };
}

interface PdfExtractionResult {
  text: string;
  pageImages: string[];
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
  const [extractedImages, setExtractedImages] = useState<string[]>([]);
  const [showExtractedMap, setShowExtractedMap] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract text and images from PDF using pdfjs-dist
  const extractFromPdf = async (file: File): Promise<PdfExtractionResult> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = "";
    const pageImages: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      
      // Extract text
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
      
      // Render page to canvas for image extraction
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({ canvasContext: context, viewport }).promise;
      
      // For page 2 (map page), crop out header and footer branding
      if (i === 2) {
        const cropTop = Math.floor(viewport.height * 0.08); // Remove top 8%
        const cropBottom = Math.floor(viewport.height * 0.08); // Remove bottom 8%
        const croppedHeight = viewport.height - cropTop - cropBottom;
        
        const croppedCanvas = document.createElement('canvas');
        const croppedContext = croppedCanvas.getContext('2d')!;
        croppedCanvas.width = viewport.width;
        croppedCanvas.height = croppedHeight;
        
        croppedContext.drawImage(
          canvas,
          0, cropTop, viewport.width, croppedHeight,
          0, 0, viewport.width, croppedHeight
        );
        
        pageImages.push(croppedCanvas.toDataURL('image/png'));
      } else {
        pageImages.push(canvas.toDataURL('image/png'));
      }
    }
    
    return { text: fullText, pageImages };
  };

  // Parse extracted text to structured JSON
  const parseReportText = (text: string): ParsedReportData => {
    // Remove branding/metadata
    const cleanText = text
      .replace(/Powered by[:\s]*agremo/gi, "")
      .replace(/app\.agremo\.com/gi, "")
      .replace(/Walk through your map on/gi, "")
      .replace(/Agremo/gi, "");

    console.log("Cleaned PDF text:", cleanText);

    // Extract crop type
    const cropMatch = cleanText.match(/Crop[:\s]+([a-zA-Z\s]+?)(?:\s*Field area|\s*Growing|\s*Analysis|\s*\d|\n)/i);
    const crop = cropMatch ? cropMatch[1].trim() : "Unknown";

    // Extract field area
    const areaMatch = cleanText.match(/Field area[:\s]*(\d+\.?\d*)\s*(?:Hectare|ha)?/i);
    const fieldAreaHa = areaMatch ? parseFloat(areaMatch[1]) : 0;

    // Extract survey date
    const dateMatch = cleanText.match(/Survey date[:\s]*(\d{2}[-/]\d{2}[-/]\d{4})/i);
    const surveyDate = dateMatch ? dateMatch[1].replace(/\//g, "-") : "";

    // Extract growing stage (BBCH)
    const stageMatch = cleanText.match(/(?:Growing stage[:\s]*)?BBCH\s*(\d+)/i);
    const growingStage = stageMatch ? `BBCH ${stageMatch[1]}` : "Not specified";

    // Extract analysis name (e.g., "Plant Stress", "Weed Detection", etc.)
    const analysisMatch = cleanText.match(/Analysis name[:\s]*([a-zA-Z\s]+?)(?:\s*STRESS|\s*LEVEL|\s*TABLE|\n)/i);
    const analysisName = analysisMatch ? analysisMatch[1].trim() : "Analysis";

    // Extract stress level table - dynamic parsing
    // Look for patterns like "Fine 30.87% 9.84" or "Plant Stress 69.13% 22.04"
    const stressLevels: StressLevel[] = [];
    
    // Match all stress level rows: "Name Percentage% Hectares"
    const stressTableRegex = /(?:^|\s)(Fine|Potential\s*(?:Plant)?\s*Stress|Plant\s+Stress|Weed\s*(?:Area)?|Pest\s*(?:Area)?|Healthy|Moderate|Stressed|Low|Medium|High)\s+(\d+\.?\d*)\s*%?\s+(\d+\.?\d*)/gi;
    let match;
    while ((match = stressTableRegex.exec(cleanText)) !== null) {
      const name = match[1].trim().replace(/\s+/g, ' ');
      stressLevels.push({
        name,
        percentage: parseFloat(match[2]),
        hectares: parseFloat(match[3]),
      });
    }

    // Extract total affected area
    const totalMatch = cleanText.match(/Total\s*(?:area)?\s*(?:PLANT\s*STRESS|WEED|PEST|AFFECTED)[:\s]*(\d+\.?\d*)\s*ha\s*=?\s*(\d+\.?\d*)?\s*%?\s*field/i);
    const totalAffected = {
      hectares: totalMatch ? parseFloat(totalMatch[1]) : 0,
      percentage: totalMatch && totalMatch[2] ? parseFloat(totalMatch[2]) : 0,
    };

    // If no total found, calculate from non-Fine stress levels
    if (totalAffected.hectares === 0 && stressLevels.length > 0) {
      const nonFine = stressLevels.filter(s => s.name.toLowerCase() !== 'fine');
      totalAffected.hectares = nonFine.reduce((sum, s) => sum + s.hectares, 0);
      totalAffected.percentage = nonFine.reduce((sum, s) => sum + s.percentage, 0);
    }

    console.log("Parsed values:", { crop, fieldAreaHa, surveyDate, growingStage, analysisName, stressLevels, totalAffected });

    return {
      report_info: {
        crop,
        field_area_ha: fieldAreaHa,
        growing_stage: growingStage,
        survey_date: surveyDate,
        analysis_name: analysisName,
      },
      stress_levels: stressLevels,
      total_affected: totalAffected,
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
      const { text, pageImages } = await extractFromPdf(file);
      setRawPdfText(text);
      setExtractedImages(pageImages);
      
      const data = parseReportText(text);
      setParsedData(data);
      toast.success(`PDF parsed successfully - extracted ${pageImages.length} page(s)`);
    } catch (error) {
      console.error("PDF parsing error:", error);
      toast.error("Failed to parse PDF");
    } finally {
      setIsParsing(false);
    }
  };

  // Calculate values from parsed data
  const totalArea = parsedData?.report_info.field_area_ha ?? area;
  const fineLevel = parsedData?.stress_levels.find(s => s.name.toLowerCase() === 'fine');
  const healthyHa = fineLevel?.hectares ?? 2.8;
  const totalAffectedHa = parsedData?.total_affected.hectares ?? 0;
  const totalAffectedPercent = parsedData?.total_affected.percentage ?? 0;

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
                {parsedData ? parsedData.report_info.analysis_name : "Drone Metrics"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Info */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Crop</p>
                  <p className="text-xl font-bold">{parsedData?.report_info.crop || cropType}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Field Area</p>
                  <p className="text-xl font-bold">{totalArea} Hectare</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Growing Stage</p>
                  <p className="text-xl font-bold">{parsedData?.report_info.growing_stage || "N/A"}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Analysis Name</p>
                  <p className="text-xl font-bold">{parsedData?.report_info.analysis_name || "N/A"}</p>
                </div>
              </div>

              {/* Stress Level Table */}
              {parsedData && parsedData.stress_levels.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Stress Level Table</h4>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 text-sm font-medium">Stress Level</th>
                          <th className="text-right p-3 text-sm font-medium">%</th>
                          <th className="text-right p-3 text-sm font-medium">Hectare</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.stress_levels.map((level, idx) => (
                          <tr key={idx} className="border-t border-border">
                            <td className="p-3 flex items-center gap-2">
                              <div 
                                className={`w-3 h-3 rounded ${
                                  level.name.toLowerCase() === 'fine' ? 'bg-green-500' :
                                  level.name.toLowerCase().includes('potential') ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`} 
                              />
                              {level.name}
                            </td>
                            <td className="p-3 text-right font-medium">{level.percentage.toFixed(2)}%</td>
                            <td className="p-3 text-right font-medium">{level.hectares.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Total Affected Area */}
              {parsedData && parsedData.total_affected.hectares > 0 && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Area {parsedData.report_info.analysis_name.toUpperCase()}:
                  </p>
                  <p className="text-2xl font-bold text-destructive">
                    {parsedData.total_affected.hectares.toFixed(2)} ha = {parsedData.total_affected.percentage.toFixed(0)}% field
                  </p>
                </div>
              )}
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
              <CardTitle className="flex items-center justify-between">
                <span>Field Visualization</span>
                {extractedImages.length > 0 && (
                  <div className="flex gap-2">
                    <Button 
                      variant={showExtractedMap ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setShowExtractedMap(true)}
                    >
                      <Image className="h-4 w-4 mr-1" />
                      Drone Image
                    </Button>
                    <Button 
                      variant={!showExtractedMap ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setShowExtractedMap(false)}
                    >
                      <Map className="h-4 w-4 mr-1" />
                      Interactive Map
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showExtractedMap && extractedImages.length > 1 ? (
                <div className="space-y-4">
                  <img 
                    src={extractedImages[1]} 
                    alt="Extracted Stress Map from Drone Report"
                    className="w-full rounded-lg border border-border"
                  />
                  {parsedData && parsedData.stress_levels.length > 0 && (
                    <div className="flex flex-wrap gap-6 justify-center text-sm">
                      {parsedData.stress_levels.map((level, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div 
                            className={`w-4 h-4 rounded ${
                              level.name.toLowerCase() === 'fine' ? 'bg-green-500' :
                              level.name.toLowerCase().includes('potential') ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} 
                          />
                          <span className="text-muted-foreground">{level.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <FieldMapWithLayers fieldId={fieldId} />
              )}
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
