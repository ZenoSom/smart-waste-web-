Backend (FastAPI) quick start:
1) cd backend
2) python -m pip install -r requirements.txt
3) uvicorn server:app --reload --port 8000
4) Test: curl -X POST --data-binary @path_to_image.jpg http://localhost:8000/predict
