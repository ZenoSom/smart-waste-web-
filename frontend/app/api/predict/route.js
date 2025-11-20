import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if(!file) return NextResponse.json({error:'no file'},{status:400});
    const buf = new Uint8Array(await file.arrayBuffer());
    const pythonUrl = process.env.PYTHON_API_URL;
    if(!pythonUrl) return NextResponse.json({error:'missing PYTHON_API_URL'},{status:500});
    const r = await fetch(`${pythonUrl.replace(/\/+$/,'')}/predict`, { method:'POST', headers: {'Content-Type':'application/octet-stream'}, body: buf });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch(e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
