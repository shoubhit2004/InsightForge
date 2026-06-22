import logging
from typing import Dict, Any, List
from app.services.search_service import SearchService
from app.services.llm_service import LLMService

logger = logging.getLogger(__name__)

class AnalysisService:
    def __init__(self):
        self.search_service = SearchService()
        self.llm_service = LLMService()

    def run_analysis(self, idea: str) -> Dict[str, Any]:
        """
        Executes the analysis workflow:
        1. Query web search for market information, competitors, and pain points.
        2. Format search results.
        3. Pass search context and original idea to the LLM (Gemini) for opportunity mapping.
        """
        logger.info(f"Starting orchestration analysis for business idea: '{idea}'")
        
        # Determine search queries based on the idea
        # We perform two queries to capture both market/trends and competitor/pain-point signals.
        queries = [
            f"{idea} market size growth trends",
            f"{idea} competitors reviews customer pain points"
        ]
        
        raw_search_results = []
        
        # Gather search data in both live and mock modes so the user always sees real evidence
        for q in queries:
            try:
                results = self.search_service.search(q, max_results=3)
                raw_search_results.extend(results)
            except Exception as e:
                logger.error(f"Search failed for query '{q}': {e}")
            
        logger.info(f"Total search results accumulated: {len(raw_search_results)}")
        
        # Analyze using LLM service (handles both mock and live Gemini API calls)
        analysis = self.llm_service.analyze_market(idea, raw_search_results)
        
        # Return a payload that includes search results (for metadata / evidence checking) 
        # and the structured analysis result itself.
        return {
            "search_sources": raw_search_results,
            "analysis": analysis
        }
