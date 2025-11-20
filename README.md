Waste Wise — Final combined repo (Frontend + Backend)

Structure:
- frontend/  (Next.js app)
- backend/   (FastAPI inference API)

Quick local run:
1) Start backend:
   cd backend
   python -m pip install -r requirements.txt
   uvicorn server:app --reload --port 8000

2) Start frontend:
   cd frontend
   npm install
   create .env.local with PYTHON_API_URL=http://localhost:8000
   npm run dev

Deploy notes:
- Deploy backend to Railway (it will detect Dockerfile / Python).
- Deploy frontend to Vercel (or Railway as Node app). Set PYTHON_API_URL to the backend URL.
