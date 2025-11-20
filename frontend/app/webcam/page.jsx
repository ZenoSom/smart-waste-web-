"use client";
import { useEffect, useRef, useState } from 'react';
import '../../styles/globals.css';

export default function WebcamPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let mounted=true;
    (async ()=>{
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        if(!mounted) return;
        streamRef.current = s;
        if(videoRef.current) videoRef.current.srcObject = s;
        setReady(true);
      } catch(e) { setError(e?.message||'Cannot access webcam'); }
    })();
    return ()=>{ mounted=false; if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop()); }
  },[]);

  const capture = async ()=>{
    if(!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width=224; canvas.height=224;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current,0,0,224,224);
    canvas.toBlob(async (blob)=>{
      if(!blob) return;
      const fd=new FormData(); fd.append('file', blob, 'frame.jpg');
      try {
        const res = await fetch('/api/predict',{method:'POST', body: fd});
        if(!res.ok){ const text = await res.text(); setResult({label:null,confidence:0,error:`Server ${res.status}: ${text}`}); }
        else { setResult(await res.json()); }
      } catch(e){ setResult({label:null,confidence:0,error:e.message}); }
    }, 'image/jpeg');
  };

  return (
    <main className="page">
      <h2>Webcam</h2>
      <video ref={videoRef} autoPlay playsInline muted className="video" />
      <div><button onClick={capture} disabled={!ready}>Capture & Predict</button></div>
      {error && <p className="error">{error}</p>}
      {result && <div className="result"><strong>{result.label}</strong> — {(Number(result.confidence)*100).toFixed(2)}% {result.error && <div className="error">{result.error}</div>}</div>}
    </main>
  );
}
