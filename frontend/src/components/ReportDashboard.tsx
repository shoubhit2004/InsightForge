"use client";

import React, { useState } from "react";
import { 
  Award, 
  Target, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  ExternalLink, 
  Clock, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  FileText
} from "lucide-react";
import { OpportunityReport } from "../lib/api";

interface ReportDashboardProps {
  report: OpportunityReport;
  onBack: () => void;
}

export default function ReportDashboard({ report, onBack }: ReportDashboardProps) {
  const [showSources, setShowSources] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (score >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    return "text-indigo-400 bg-indigo-500/10 border-indigo-500/30";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-indigo-500";
  };

  // Sort opportunities so the highest scored or recommended is highlighted
  const sortedOpportunities = [...report.opportunities].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-8 pb-16">
      
      {/* Back button and Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Workspace</span>
        </button>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          <Clock className="w-3.5 h-3.5" />
          <span>Analyzed on {new Date(report.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="border-b border-white/5 pb-6">
        <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Opportunity Report</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
          {report.idea}
        </h1>
      </div>

      {/* Founder Recommendation Block (Startup Mentor Tone) */}
      <div className="relative glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
          <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 flex-shrink-0">
            <Award className="w-10 h-10" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                Founder&apos;s Recommendation
              </span>
              <span className="text-xs text-gray-500">Startup Mentor Verdict</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Pursue: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                {report.founder_recommendation.opportunity_name}
              </span>
            </h3>
            
            <p className="text-gray-300 text-base leading-relaxed italic">
              &quot;{report.founder_recommendation.why}&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Market Overview & Pain Points Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Market Summary */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Market Summary</h3>
          </div>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {report.market_summary}
          </p>
        </div>

        {/* Customer Pain Points */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Customer Pain Points</h3>
          </div>
          
          <ul className="space-y-3.5">
            {report.customer_pain_points.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Competitors Section */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <Target className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Competitor Landscape</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.competitors.map((comp, idx) => (
            <div 
              key={idx} 
              className="rounded-xl bg-white/[0.02] border border-white/5 p-5 hover:border-white/10 transition-all duration-200"
            >
              <h4 className="font-bold text-white text-base mb-3 border-b border-white/5 pb-2">
                {comp.name}
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-emerald-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">
                    Strength
                  </span>
                  <p className="text-gray-300">{comp.strength}</p>
                </div>
                <div>
                  <span className="text-indigo-400 font-semibold block uppercase tracking-wider text-[10px] mb-1">
                    Vulnerability / Gap
                  </span>
                  <p className="text-gray-300">{comp.weakness}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunity Matrix */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white">Identified Venture Opportunities</h3>
          <p className="text-gray-400 text-sm mt-1">
            We evaluated the market data and engineered these high-potential niches:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedOpportunities.map((opp, idx) => {
            const isRecommended = opp.name === report.founder_recommendation.opportunity_name;
            return (
              <div 
                key={idx} 
                className={`glass-card rounded-2xl p-6 border relative transition-all duration-300 ${
                  isRecommended 
                    ? "border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-indigo-950/20 shadow-2xl" 
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Recommended Path</span>
                  </span>
                )}

                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h4 className="font-bold text-white text-lg pr-12">
                      {opp.name}
                    </h4>
                  </div>
                  
                  {/* Score Indicator */}
                  <div className={`px-2.5 py-1 rounded-lg border text-sm font-semibold flex-shrink-0 ${getScoreColor(opp.score)}`}>
                    Score: {opp.score}
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {opp.description}
                </p>

                {/* Score Progress Bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                    <span>Feasibility & Demand Score</span>
                    <span>{opp.score}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getScoreProgressColor(opp.score)}`} 
                      style={{ width: `${opp.score}%` }}
                    />
                  </div>
                </div>

                {/* Evidence Callout */}
                <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Supporting Research Fact</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {opp.evidence}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sources Audit (Collapsible) */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <button
          onClick={() => setShowSources(!showSources)}
          className="flex w-full items-center justify-between px-6 py-4 text-sm font-semibold text-gray-300 hover:bg-white/[0.02] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span>Audited Search Evidence ({report.search_sources.length} sources scanned)</span>
          </div>
          {showSources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSources && (
          <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 bg-black/10">
            {report.search_sources.length === 0 ? (
              <p className="text-gray-500 text-xs italic">No search sources recorded (Mock fallback loaded).</p>
            ) : (
              <div className="divide-y divide-white/5 space-y-4">
                {report.search_sources.map((source, idx) => (
                  <div key={idx} className="pt-4 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <h5 className="font-bold text-white text-xs truncate max-w-lg">
                        {source.title}
                      </h5>
                      {source.link && (
                        <a
                          href={source.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex-shrink-0"
                        >
                          <span>Visit link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {source.snippet}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
