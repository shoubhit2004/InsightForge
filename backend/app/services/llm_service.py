import os
import json
import logging
from typing import Dict, Any, List
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from app.config import settings

logger = logging.getLogger(__name__)

# Pydantic schemas for Structured JSON Output from Gemini
class Competitor(BaseModel):
    name: str = Field(description="Name of the competitor or competitor type")
    strength: str = Field(description="Key competitive advantage or strength")
    weakness: str = Field(description="Vulnerability, gap, or area they neglect")

class Opportunity(BaseModel):
    name: str = Field(description="Descriptive, unique title for the business opportunity")
    description: str = Field(description="Details of the opportunity, target audience, and business model")
    score: int = Field(description="Opportunity Score between 0 and 100 based on feasibility, demand, and profitability", ge=0, le=100)
    evidence: str = Field(description="Supporting evidence from market/search data justifying the opportunity")

class Recommendation(BaseModel):
    opportunity_name: str = Field(description="The name of the recommended best opportunity")
    why: str = Field(description="Detailed rationale of why this is the best path forward, citing specific research facts")

class AnalysisResult(BaseModel):
    market_summary: str = Field(description="A concise executive summary of the target market, size, trends, and growth factors")
    competitors: List[Competitor] = Field(description="List of 3-4 key competitors or categories of competitors in this space")
    customer_pain_points: List[str] = Field(description="List of 3-5 major problems, inefficiencies, or frustrations customers face")
    opportunities: List[Opportunity] = Field(description="List of 3-5 distinct, concrete business opportunities identified in this market")
    founder_recommendation: Recommendation = Field(description="The primary recommended opportunity with strategic advice and 'why'")

class LLMService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.is_mock = (
            not self.api_key 
            or self.api_key == "your_gemini_api_key_here" 
            or "mock" in self.api_key.lower()
        )
        
        if self.is_mock:
            logger.warning("Gemini API key is not configured or is placeholder. Falling back to MOCK mode.")
            self.client = None
        else:
            try:
                # Initialize Gemini Client using google-genai SDK
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Gemini Client: {e}")
                self.is_mock = True
                self.client = None

    def analyze_market(self, idea: str, search_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Takes a business idea and web search data, runs it through Gemini,
        and returns a structured market analysis matching the AnalysisResult schema.
        """
        if self.is_mock:
            return self._generate_mock_analysis(idea)

        # Prepare search context
        search_context = ""
        if search_data:
            search_context = "\n".join([
                f"Source: {item['title']} ({item['link']})\nSnippet: {item['snippet']}\n"
                for item in search_data
            ])
        else:
            search_context = "No live web search data available."

        prompt = f"""
You are an experienced startup mentor, venture capitalist, and technical product co-founder.
Analyze the following business idea and suggest the most lucrative, feasible, and high-potential opportunities.

Business Idea: "{idea}"

Supporting Web Search Research:
{search_context}

Task:
1. Summarize the market based on the search data and your knowledge. Keep it factual and avoid empty buzzwords.
2. List key competitors (or competitor types) along with their strengths and weaknesses.
3. Detail the specific customer pain points discovered from the market search and reviews.
4. Synthesize 3 to 5 distinct, highly actionable business opportunities/niches.
5. Score each opportunity from 0 to 100.
6. Provide a recommendation for the absolute best opportunity to pursue, detailing "why" with evidence.

Ensure all outputs strictly match the requested JSON schema. Be encouraging yet realistic, like a startup mentor.
"""
        import time
        attempts = 3
        for attempt in range(attempts):
            try:
                logger.info(f"Calling Gemini API (Attempt {attempt+1}/{attempts})...")
                response = self.client.models.generate_content(
                    model='gemini-3.1-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=AnalysisResult,
                        temperature=0.2
                    )
                )
                # The response text will be a validated JSON string
                return json.loads(response.text)
            except Exception as e:
                logger.error(f"Error calling Gemini API on attempt {attempt+1}: {e}", exc_info=True)
                if attempt < attempts - 1:
                    time.sleep(2)  # Wait 2 seconds before retrying
                else:
                    logger.warning("All Gemini API attempts failed. Falling back to mock analysis.")
                    return self._generate_mock_analysis(idea)

    def _generate_mock_analysis(self, idea: str) -> Dict[str, Any]:
        """
        Generates structured dummy data for development/testing when API key is missing.
        """
        logger.info(f"Generating mock analysis for idea: {idea}")
        # Standard mockup customized to search query
        idea_normalized = idea.strip().lower()
        
        if "coffee" in idea_normalized:
            return {
                "market_summary": f"The specialty coffee and café market in India is experiencing rapid growth, driven by rising disposable incomes, urbanization, and a growing appreciation for premium experiences. Jaipur, as a major tourist hub and student center, presents distinct market dynamics.",
                "competitors": [
                    {"name": "Starbucks & Cafe Coffee Day", "strength": "Massive brand presence and established supply chains.", "weakness": "High prices, generic taste profiles, and lack of localized cultural connection."},
                    {"name": "Tapri The Tea House", "strength": "Extremely popular local brand with high student/youth engagement and scenic rooftop setup.", "weakness": "Primarily focused on tea/chai, overcrowded, and slow service during peak times."},
                    {"name": "Local Independent Cafés", "strength": "Charming aesthetics and niche community focus.", "weakness": "Low marketing budget, inconsistent quality, and poor inventory management."}
                ],
                "customer_pain_points": [
                    "Lack of quiet, high-speed internet work spaces for remote freelancers and digital nomads.",
                    "Sourcing high-quality single-origin beans locally is difficult for connoisseurs.",
                    "Inconsistent beverage temperature and taste profiles across visits in independent cafés."
                ],
                "opportunities": [
                    {
                        "name": "Co-Working Specialty Hub",
                        "description": "A café designed specifically for digital professionals, featuring soundproof booths, charging docks at every seat, and high-speed Wi-Fi alongside curated espresso drinks.",
                        "score": 85,
                        "evidence": "Jaipur has seen an increase in freelance and IT workers, but local cafes like Tapri are too loud for video calls."
                    },
                    {
                        "name": "Rajasthani Infused Specialty Brews",
                        "description": "A themed craft coffee shop pairing premium single-origin beans with subtle local flavors (e.g., cardamom, rose-water cold brews) targeting premium tourists.",
                        "score": 78,
                        "evidence": "Jaipur receives over 1.5 million foreign and domestic tourists annually looking for unique cultural experiences."
                    },
                    {
                        "name": "Coffee Crafting Workshops & Subscription",
                        "description": "Conducting weekend barista workshops and selling beans directly to homes on a monthly subscription.",
                        "score": 65,
                        "evidence": "Rising interest in home brewing across major tier-2 Indian cities, but lack of educational resources."
                    }
                ],
                "founder_recommendation": {
                    "opportunity_name": "Co-Working Specialty Hub",
                    "why": f"This opportunity has the highest feasibility and immediate cash flow. Freelancers in Jaipur currently struggle to find locations that welcome long-stay laptop workers. By catering to them with reliable infrastructure and subscription-based drink passes, you secure recurring customer lifetime value."
                }
            }
        else:
            # Fallback general mock
            return {
                "market_summary": f"The market for '{idea}' is highly fragmented with emerging niches. Growth is driven by digital transformation, shifts in consumer purchasing behavior, and interest in customized experiences.",
                "competitors": [
                    {"name": "Traditional Industry Giants", "strength": "Deep pockets, large scale, and strong distribution.", "weakness": "Slow to adapt to niche requirements, outdated digital interfaces, and poor customer service."},
                    {"name": "Direct-to-Consumer Startups", "strength": "Agile, modern branding, and strong social media presence.", "weakness": "High customer acquisition costs and supply chain constraints."}
                ],
                "customer_pain_points": [
                    "High setup or onboarding friction for standard products.",
                    "Lack of personalization and personalized support.",
                    "Inefficient service delivery and long wait times."
                ],
                "opportunities": [
                    {
                        "name": f"Premium Niche Play for '{idea}'",
                        "description": "A premium service targeted at high-value clients, solving personalization issues using automated onboarding.",
                        "score": 82,
                        "evidence": "Friction in customer onboarding is the primary driver of churn across competitor products."
                    },
                    {
                        "name": f"Mobile-First On-Demand '{idea}'",
                        "description": "Delivering services instantly via an on-demand app with subscription options.",
                        "score": 75,
                        "evidence": "Mobile internet usage is rising, yet traditional competitors operate mostly via desktop or physical outlets."
                    }
                ],
                "founder_recommendation": {
                    "opportunity_name": f"Premium Niche Play for '{idea}'",
                    "why": f"Focusing on a premium niche reduces initial customer acquisition costs and yields higher margins, allowing the business to bootstrap growth effectively."
                }
            }
