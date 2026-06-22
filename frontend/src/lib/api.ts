const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

// TypeScript Interfaces matching FastAPI schemas
export interface Competitor {
  name: string;
  strength: string;
  weakness: string;
}

export interface Opportunity {
  name: string;
  description: string;
  score: number;
  evidence: string;
}

export interface Recommendation {
  opportunity_name: string;
  why: string;
}

export interface SearchSource {
  title: string;
  link: string;
  snippet: string;
}

export interface OpportunityReport {
  id: number;
  idea: string;
  market_summary: string;
  competitors: Competitor[];
  customer_pain_points: string[];
  opportunities: Opportunity[];
  founder_recommendation: Recommendation;
  search_sources: SearchSource[];
  created_at: string;
}

export interface OpportunityReportListItem {
  id: number;
  idea: string;
  market_summary: string;
  created_at: string;
}

export class ApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const parsed = JSON.parse(errorText);
          errorMessage = parsed.detail || errorMessage;
        } catch {
          // Keep default if JSON parse fails
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  static async checkHealth(): Promise<{ status: string; database: string }> {
    return this.request<{ status: string; database: string }>("/api/health");
  }

  static async triggerResearch(idea: string): Promise<OpportunityReport> {
    return this.request<OpportunityReport>("/api/research", {
      method: "POST",
      body: JSON.stringify({ idea }),
    });
  }

  static async listReports(): Promise<OpportunityReportListItem[]> {
    return this.request<OpportunityReportListItem[]>("/api/reports");
  }

  static async getReport(id: number): Promise<OpportunityReport> {
    return this.request<OpportunityReport>(`/api/reports/${id}`);
  }

  static async deleteReport(id: number): Promise<void> {
    return this.request<void>(`/api/reports/${id}`, {
      method: "DELETE",
    });
  }
}
