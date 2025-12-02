import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AssessorLayout from "./components/layouts/AssessorLayout";
import Dashboard from "./pages/assessor/Dashboard";
import RiskAssessment from "./pages/assessor/RiskAssessment";
import CropMonitoring from "./pages/assessor/CropMonitoring";
import LossAssessment from "./pages/assessor/LossAssessment";
import FieldDetail from "./pages/assessor/FieldDetail";
import FieldProcessing from "./pages/assessor/FieldProcessing";
import FarmersList from "./pages/assessor/FarmersList";
import FarmerFieldsList from "./pages/assessor/FarmerFieldsList";
import FarmerDashboard from "./pages/farmer/Dashboard";
import FarmerFieldDetail from "./pages/farmer/FieldDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Assessor Portal - Farmers List & Field Management */}
          <Route path="/assessor/dashboard" element={<FarmersList />} />
          <Route path="/assessor/farmer/:farmerId/fields" element={<FarmerFieldsList />} />
          <Route path="/assessor/field-processing" element={<FieldProcessing />} />
          
          {/* Assessor Portal - Field Analysis (with Layout) */}
          <Route path="/assessor" element={<AssessorLayout />}>
            <Route path="fields" element={<Dashboard />} />
            <Route path="risk-assessment" element={<RiskAssessment />} />
            <Route path="risk-assessment/:farmerId" element={<RiskAssessment />} />
            <Route path="risk-assessment/:farmerId/:fieldId" element={<RiskAssessment />} />
            <Route path="crop-monitoring" element={<CropMonitoring />} />
            <Route path="crop-monitoring/:farmerId" element={<CropMonitoring />} />
            <Route path="crop-monitoring/:farmerId/:fieldId" element={<CropMonitoring />} />
            <Route path="loss-assessment" element={<LossAssessment />} />
            <Route path="field/:id" element={<FieldDetail />} />
          </Route>
          
          {/* Farmer Portal */}
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/field/:fieldId" element={<FarmerFieldDetail />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
