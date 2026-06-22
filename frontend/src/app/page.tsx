"use client";

import React, { useState, useEffect } from "react";
import { Menu, AlertCircle } from "lucide-react";
import { 
  ApiService, 
  OpportunityReport, 
  OpportunityReportListItem 
} from "../lib/api";

import HistorySidebar from "../components/HistorySidebar";
import ResearchForm from "../components/ResearchForm";
import AnalysisLoader from "../components/AnalysisLoader";
import ReportDashboard from "../components/ReportDashboard";

export default function Home() {
  const [reports, setReports] = useState<OpportunityReportListItem[]>([]);
  const [activeReport, setActiveReport] = useState<OpportunityReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports on mount
  useEffect(() => {
    fetchReportsHistory();
  }, []);

  const fetchReportsHistory = async () => {
    try {
      const list = await ApiService.listReports();
      setReports(list);
    } catch (err) {
      console.error("Failed to load reports history:", err);
      // Don't show hard block, just log it. If server is offline, user will see health warning
    }
  };

  const handleSelectReport = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await ApiService.getReport(id);
      setActiveReport(details);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load report details.";
      setError(errorMessage);
      setActiveReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReport = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this report from history?")) return;
    
    try {
      await ApiService.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      if (activeReport?.id === id) {
        setActiveReport(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete report.";
      alert(errorMessage);
    }
  };

  const handleTriggerResearch = async (idea: string) => {
    setIsLoading(true);
    setError(null);
    setActiveReport(null);
    try {
      const newReport = await ApiService.triggerResearch(idea);
      setActiveReport(newReport);
      // Refresh sidebar list
      await fetchReportsHistory();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process business concept. Check backend connection.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewResearch = () => {
    setActiveReport(null);
    setError(null);
  };

  return (
    <div className="flex h-screen bg-[#030712] overflow-hidden text-gray-100 bg-grid-pattern">
      {/* Sidebar history */}
      <HistorySidebar
        reports={reports}
        activeReportId={activeReport?.id ?? null}
        onSelectReport={handleSelectReport}
        onDeleteReport={handleDeleteReport}
        onNewResearch={handleNewResearch}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-white/5 bg-[#080c14]/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-bold text-white text-base sm:text-lg">
              {activeReport ? `Report: ${activeReport.idea}` : "Workspace"}
            </h2>
          </div>
        </header>

        {/* Dynamic Inner Workspace Panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-300 flex items-start gap-3 shadow-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Action Failed</h4>
                <p className="text-xs mt-1 text-red-200">{error}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <AnalysisLoader />
          ) : activeReport ? (
            <ReportDashboard report={activeReport} onBack={handleNewResearch} />
          ) : (
            <ResearchForm onSubmit={handleTriggerResearch} isLoading={isLoading} />
          )}
        </main>
      </div>
    </div>
  );
}
