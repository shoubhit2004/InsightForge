"use client";

import React from "react";
import { Plus, Trash2, Calendar, X } from "lucide-react";
import { OpportunityReportListItem } from "../lib/api";

interface HistorySidebarProps {
  reports: OpportunityReportListItem[];
  activeReportId: number | null;
  onSelectReport: (id: number) => void;
  onDeleteReport: (id: number, e: React.MouseEvent) => void;
  onNewResearch: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function HistorySidebar({
  reports,
  activeReportId,
  onSelectReport,
  onDeleteReport,
  onNewResearch,
  isOpen,
  onClose,
}: HistorySidebarProps) {
  
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown Date";
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#080c14] border-r border-white/5 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">
              IF
            </div>
            <span className="font-bold text-white text-lg tracking-wider">InsightForge</span>
          </div>
          
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewResearch();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>

        {/* List Section */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Research History ({reports.length})
          </div>

          {reports.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-600">
              No previous reports found. Run a new scan to start.
            </div>
          ) : (
            <div className="space-y-1">
              {reports.map((report) => {
                const isActive = activeReportId === report.id;
                return (
                  <div
                    key={report.id}
                    className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-500/10 text-indigo-300 border-l-2 border-indigo-500"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectReport(report.id);
                        onClose();
                      }}
                      className="flex flex-1 flex-col items-start text-left cursor-pointer overflow-hidden pr-6"
                    >
                      <span className="font-medium text-sm truncate w-full">
                        {report.idea}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(report.created_at)}
                      </span>
                    </button>

                    <button
                      onClick={(e) => onDeleteReport(report.id, e)}
                      title="Delete Report"
                      className="absolute right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#05080e] text-center">
          <span className="text-xs text-gray-500">InsightForge MVP v1.0</span>
        </div>
      </aside>
    </>
  );
}
