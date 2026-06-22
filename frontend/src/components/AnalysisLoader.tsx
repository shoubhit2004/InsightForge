"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, Circle } from "lucide-react";

interface LoaderStep {
  id: number;
  label: string;
}

const STEPS: LoaderStep[] = [
  { id: 0, label: "Searching web for market indicators, size, and trends..." },
  { id: 1, label: "Auditing competitor offerings, strengths, and vulnerabilities..." },
  { id: 2, label: "Aggregating customer frustrations, reviews, and pain points..." },
  { id: 3, label: "Synthesizing 3-5 distinct, concrete business opportunities..." },
  { id: 4, label: "Calculating feasibility, demand, and final founder recommendation..." },
];

export default function AnalysisLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Advance steps every 3.5 seconds, capped at step 4
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto py-16 px-4">
      <div className="glass-card rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Glow behind loader */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Venture Concept</h2>
          <p className="text-gray-400 text-sm">
            Please wait. Our research agents are surveying the landscape...
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step List */}
        <div className="space-y-5">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 transition-all duration-300 ${
                  isActive ? "text-white scale-[1.02] font-medium" : "text-gray-500"
                } ${isCompleted ? "text-indigo-300" : ""}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-700" />
                  )}
                </div>
                
                <div className="text-sm sm:text-base">
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
