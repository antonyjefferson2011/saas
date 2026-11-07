import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const f = (await req.formData()).get("file") as File | null;
  if (!f || !["image/jpeg", "image/png", "image/webp"].includes(f.type)) return NextResponse.json({ error: "Use JPG, PNG ou WEBP." }, { status: 400 });
  if (f.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Máximo de 5 MB." }, { status: 400 });
  const fd = new FormData();
  fd.append("image", Buffer.from(await f.arrayBuffer()).toString("base64"));
  const r = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, { method: "POST", body: fd });
  const j = await r.json();
  if (!r.ok || !j?.data?.url) return NextResponse.json({ error: "Falha no ImgBB." }, { status: 502 });
  return NextResponse.json({ url: j.data.url });
}
