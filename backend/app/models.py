from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from app.database import Base

class OpportunityReport(Base):
    __tablename__ = "opportunity_reports"

    id = Column(Integer, primary_key=True, index=True)
    idea = Column(String, index=True, nullable=False)
    
    # Store LLM analysis components
    market_summary = Column(Text, nullable=False)
    competitors = Column(JSON, nullable=False)  # List of competitors
    customer_pain_points = Column(JSON, nullable=False)  # List of pain points
    opportunities = Column(JSON, nullable=False)  # List of opportunities
    founder_recommendation = Column(JSON, nullable=False)  # Recommendation object
    
    # Store source audit data
    search_sources = Column(JSON, nullable=False)  # List of search sources used
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
