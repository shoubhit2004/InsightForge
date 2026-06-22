import time
import requests

# URL of the deployed backend health check
# Update this URL if your Render backend has a different unique subdomain!
URL = "https://insightforge-backend.onrender.com/api/health"
INTERVAL = 600  # 10 minutes (Render free tier services spin down after 15 minutes of inactivity)

print(f"Starting keep-awake pinger for {URL}...")
print("Keep this script running to prevent your Render free-tier server from sleeping.")

while True:
    try:
        response = requests.get(URL, timeout=10)
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ping status: {response.status_code} - Server is active.")
    except Exception as e:
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Ping failed: {e}")
    
    time.sleep(INTERVAL)
