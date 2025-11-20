"use client";
import { useState } from 'react';
import '../../styles/globals.css';

export default function UploadPage() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append('file', file);
    try {
      setLoading(true);
      const res = await fetch('/api/predict', { method: 'POST', body: fd });
      if (!res.ok) {
        const text = await res.text();
        setResult({label:null,confidence:0,error:`Server ${res.status}: ${text}`});
      } else {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      setResult({label:null,confidence:0,error:err.message});
    } finally { setLoading(false); }
  };

  return (
    <main className="page">
      <h2>Upload Image</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {loading && <p>Processing...</p>}
      {preview && <img src={preview} className="preview" alt="preview" />}
      {result && <div className="result"><strong>Prediction:</strong> {result.label} <br/> <strong>Confidence:</strong> {(Number(result.confidence)*100).toFixed(2)}% {result.error && <div className="error">{result.error}</div>}</div>}
    </main>
  );
}
