"use client";

import React, { useState } from "react";
import { Search, Sparkles, Lightbulb } from "lucide-react";

interface ResearchFormProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

const SAMPLE_IDEAS = [
  "Premium specialty coffee shop in Jaipur",
  "AI-powered time-blocking calendar for ADHD students",
  "Eco-friendly mobile car wash service in Mumbai",
  "Subscription box for organic dog foods & treats",
];

export default function ResearchForm({ onSubmit, isLoading }: ResearchFormProps) {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isLoading) return;
    onSubmit(idea.trim());
  };

  const handleSuggestionClick = (suggestedIdea: string) => {
    setIdea(suggestedIdea);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>AI Startup Co-Founder & Mentor</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
          Uncover Your Next <span className="text-gradient">Venture Niche</span>
        </h1>
        
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Enter a rough business concept. InsightForge will conduct real-time research, audit competitors, map customer pain points, and engineer validated opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative glass-card rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all duration-300">
          <div className="flex-1 flex items-center px-4">
            <Search className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. Open a coffee shop in Jaipur..."
              disabled={isLoading}
              className="w-full bg-transparent border-0 text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-lg py-3"
            />
          </div>
          
          <button
            type="submit"
            disabled={!idea.trim() || isLoading}
            className="sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Forge Insights</span>
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Need inspiration? Try one of these ideas:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {SAMPLE_IDEAS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionClick(sample)}
              disabled={isLoading}
              className="px-4 py-2 rounded-full glass-card hover:bg-white/5 border border-white/5 text-gray-300 text-sm transition-all duration-200 cursor-pointer text-left"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
