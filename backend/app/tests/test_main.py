import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db

# Create an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(name="session")
def session_fixture():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(name="client")
def client_fixture(session):
    def override_get_db():
        try:
            yield session
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]

def test_health_check(client):
    """
    Test the health check endpoint.
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"

def test_trigger_research_coffee(client):
    """
    Test triggering research with a coffee-themed idea (forces mock coffee response or live analysis).
    """
    payload = {"idea": "Specialty coffee shop in Jaipur"}
    response = client.post("/api/research", json=payload)
    assert response.status_code == 201
    
    data = response.json()
    assert "id" in data
    assert data["idea"] == payload["idea"]
    assert "market_summary" in data
    assert isinstance(data["competitors"], list)
    assert len(data["competitors"]) > 0
    assert isinstance(data["customer_pain_points"], list)
    assert isinstance(data["opportunities"], list)
    assert "founder_recommendation" in data
    assert "opportunity_name" in data["founder_recommendation"]

def test_trigger_research_general(client):
    """
    Test triggering research with a general idea.
    """
    payload = {"idea": "B2B SaaS for automated inventory forecasting"}
    response = client.post("/api/research", json=payload)
    assert response.status_code == 201
    
    data = response.json()
    assert "id" in data
    assert data["idea"] == payload["idea"]
    assert "market_summary" in data
    assert isinstance(data["competitors"], list)
    
def test_list_and_get_reports(client):
    """
    Test creating, listing, and retrieving reports.
    """
    # Create two reports
    client.post("/api/research", json={"idea": "Coffee Shop"})
    client.post("/api/research", json={"idea": "SaaS Platform"})
    
    # List reports
    response = client.get("/api/reports")
    assert response.status_code == 200
    reports = response.json()
    assert len(reports) == 2
    assert reports[0]["idea"] == "SaaS Platform" # Sorted by newest first
    assert reports[1]["idea"] == "Coffee Shop"
    
    # Retrieve the first report
    report_id = reports[0]["id"]
    response = client.get(f"/api/reports/{report_id}")
    assert response.status_code == 200
    report_data = response.json()
    assert report_data["idea"] == "SaaS Platform"
    
    # Retrieve non-existing report
    response = client.get("/api/reports/99999")
    assert response.status_code == 404

def test_delete_report(client):
    """
    Test deleting a report.
    """
    # Create a report
    response = client.post("/api/research", json={"idea": "Delete Me"})
    report_id = response.json()["id"]
    
    # Verify it exists
    response = client.get("/api/reports")
    assert len(response.json()) == 1
    
    # Delete report
    response = client.delete(f"/api/reports/{report_id}")
    assert response.status_code == 204
    
    # Verify it is deleted
    response = client.get("/api/reports")
    assert len(response.json()) == 0
    
    # Delete non-existing report
    response = client.delete(f"/api/reports/{report_id}")
    assert response.status_code == 404
