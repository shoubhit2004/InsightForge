from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

# Request Schemas
class ResearchRequest(BaseModel):
    idea: str = Field(..., min_length=3, max_length=200, description="The business idea to research")

# Sub-components of the Analysis
class CompetitorSchema(BaseModel):
    name: str
    strength: str
    weakness: str

class OpportunitySchema(BaseModel):
    name: str
    description: str
    score: int = Field(..., ge=0, le=100)
    evidence: str

class RecommendationSchema(BaseModel):
    opportunity_name: str
    why: str

class SearchSourceSchema(BaseModel):
    title: str
    link: str
    snippet: str

# Structured Analysis Schema (Output from LLM Service)
class AnalysisResultSchema(BaseModel):
    market_summary: str
    competitors: List[CompetitorSchema]
    customer_pain_points: List[str]
    opportunities: List[OpportunitySchema]
    founder_recommendation: RecommendationSchema

# DB Report Response Schemas
class OpportunityReportResponse(BaseModel):
    id: int
    idea: str
    market_summary: str
    competitors: List[CompetitorSchema]
    customer_pain_points: List[str]
    opportunities: List[OpportunitySchema]
    founder_recommendation: RecommendationSchema
    search_sources: List[SearchSourceSchema]
    created_at: datetime

    # Pydantic v2 configuration for database serialization
    model_config = ConfigDict(from_attributes=True)

class OpportunityReportListItem(BaseModel):
    id: int
    idea: str
    market_summary: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
