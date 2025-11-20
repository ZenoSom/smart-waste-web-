from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import io, os
from PIL import Image
import numpy as np

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])

MODEL_PATH = os.environ.get('MODEL_PATH', 'models/best_model.h5')
model = None
try:
    import tensorflow as tf
    from tensorflow.keras.models import load_model
    if os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH)
except Exception:
    model = None

def preprocess(img: Image.Image, size=(224,224)):
    img = img.convert('RGB').resize(size)
    arr = np.array(img).astype('float32')/255.0
    return np.expand_dims(arr, 0)

@app.get('/')
async def index():
    return {'status':'ok','model_loaded': model is not None}

@app.post('/predict')
async def predict(request: Request):
    body = await request.body()
    if not body:
        return JSONResponse({'error':'no data'}, status_code=400)
    try:
        img = Image.open(io.BytesIO(body))
    except Exception as e:
        return JSONResponse({'error':'invalid image', 'detail':str(e)}, status_code=400)
    x = preprocess(img)
    if model is not None:
        try:
            pred = float(model.predict(x)[0][0])
            label = 'non_biodegradable' if pred > 0.5 else 'biodegradable'
            return {'label':label, 'confidence':pred}
        except Exception as e:
            return JSONResponse({'error':'model error','detail':str(e)}, status_code=500)
    return {'label':'biodegradable', 'confidence':0.5}
