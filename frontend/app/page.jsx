import Link from 'next/link';
import Image from 'next/image';
import "../styles/globals.css";

export default function Home() {
  return (
    <main className="page">
      <header className="hero">
        <h1>Waste Wise — Smart Waste Classifier</h1>
        <p className="subtitle">Fast, simple classifier — Biodegradable vs Non‑Biodegradable</p>
        <div className="actions">
          <Link href='/upload'><button className="btn primary">Upload Image</button></Link>
          <Link href='/webcam'><button className="btn">Use Webcam</button></Link>
        </div>
      </header>

      <section className="features">
        <div className="card">
          <h3>Explainable</h3>
          <p>Grad-CAM ready heatmaps to inspect predictions.</p>
        </div>
        <div className="card">
          <h3>Lightweight</h3>
          <p>Optimized model and fast inference API (FastAPI backend).</p>
        </div>
        <div className="card">
          <h3>Deploy-ready</h3>
          <p>One repo for frontend + backend. Deploy backend on Railway and frontend on Vercel or Railway (Node).</p>
        </div>
      </section>

      <footer className="footer">
        <Image src="/assets/railway-error-screenshot.png" alt="screenshot" width={300} height={170} />
        <p>Ready to deploy — instructions in README.</p>
      </footer>
    </main>
  );
}
