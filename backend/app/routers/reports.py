from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import OpportunityReport
from app.schemas import OpportunityReportListItem, OpportunityReportResponse

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("", response_model=List[OpportunityReportListItem])
def list_reports(db: Session = Depends(get_db)):
    """
    Returns list of all saved opportunity reports, ordered by creation date (newest first).
    """
    reports = db.query(OpportunityReport).order_by(OpportunityReport.created_at.desc()).all()
    return reports

@router.get("/{report_id}", response_model=OpportunityReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    """
    Retrieves full details of a specific report by its ID.
    """
    report = db.query(OpportunityReport).filter(OpportunityReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID {report_id} not found"
        )
    return report

@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(report_id: int, db: Session = Depends(get_db)):
    """
    Deletes a specific report by its ID from history.
    """
    report = db.query(OpportunityReport).filter(OpportunityReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID {report_id} not found"
        )
    
    try:
        db.delete(report)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete report: {str(e)}"
        )
