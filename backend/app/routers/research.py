from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import OpportunityReport
from app.schemas import ResearchRequest, OpportunityReportResponse
from app.services.analysis_service import AnalysisService

router = APIRouter(prefix="/api/research", tags=["Research"])

@router.post("", response_model=OpportunityReportResponse, status_code=status.HTTP_201_CREATED)
def trigger_research(payload: ResearchRequest, db: Session = Depends(get_db)):
    """
    Triggers market research for a business idea. Runs web queries,
    evaluates using Gemini API, persists to SQLite DB, and returns the analysis.
    """
    try:
        analysis_service = AnalysisService()
        result = analysis_service.run_analysis(payload.idea)
        
        analysis_data = result.get("analysis", {})
        search_sources = result.get("search_sources", [])
        
        # Create database record
        db_report = OpportunityReport(
            idea=payload.idea,
            market_summary=analysis_data.get("market_summary", ""),
            competitors=analysis_data.get("competitors", []),
            customer_pain_points=analysis_data.get("customer_pain_points", []),
            opportunities=analysis_data.get("opportunities", []),
            founder_recommendation=analysis_data.get("founder_recommendation", {}),
            search_sources=search_sources
        )
        
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        
        return db_report
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the opportunity report: {str(e)}"
        )
