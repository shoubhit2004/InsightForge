import logging
from typing import List, Dict, Any
from duckduckgo_search import DDGS

logger = logging.getLogger(__name__)

class SearchService:
    @staticmethod
    def search(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """
        Searches the web using DuckDuckGo Search API.
        Returns a list of dictionaries with title, link, and snippet.
        """
        print(f"[SEARCH_DEBUG] Searching web for query: '{query}'")
        try:
            with DDGS() as ddgs:
                raw_results = ddgs.text(query, max_results=max_results)
                results = list(raw_results)
                print(f"[SEARCH_DEBUG] Raw search results count: {len(results)}")
                
                formatted_results = []
                for item in results:
                    formatted_results.append({
                        "title": item.get("title", ""),
                        "link": item.get("href", ""),
                        "snippet": item.get("body", "")
                    })
                
                print(f"[SEARCH_DEBUG] Formatted results count: {len(formatted_results)}")
                logger.info(f"Found {len(formatted_results)} results for query: {query}")
                return formatted_results
        except Exception as e:
            print(f"[SEARCH_DEBUG] Search Exception: {e}")
            logger.error(f"Error executing search query '{query}': {e}", exc_info=True)
            # Return empty search list if API fails, so we degrade gracefully
            return []
