"use client";
import { useState } from "react";
import { Product, adm, brl, useCol } from "@/lib/utils";
const empty = { name: "", description: "", price: 0, image: "", category: "Bolo no pote", available: true, featured: false };
export default function Produtos() {
  const list = useCol<Product>("products", true); const [f, setF] = useState<any>(empty); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function upload(file?: File) {
    if (!file) return; setBusy(true); setMsg("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await r.json(); if (!r.ok) throw new Error(j.error); setF((x: any) => ({ ...x, image: j.url }));
    } catch (e: any) { setMsg(e.message); } setBusy(false);
  }
  async function save() {
    if (!f.name.trim() || !(Number(f.price) > 0)) return setMsg("Informe nome e um preço maior que zero.");
    const { id, ...d } = f; d.price = Number(d.price);
    await adm(id ? "update" : "add", "products", id, d);
    setF(empty); setMsg("Produto salvo.");
  }
  return <div className="space-y-4"><h1 className="font-serif text-4xl">Produtos</h1><div className="grid gap-4 lg:grid-cols-2">
    <div className="card space-y-3"><h2 className="font-medium">{f.id ? "Editar produto" : "Novo produto"}</h2>
      <input className="input" placeholder="Nome" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <textarea className="input" placeholder="Descrição" rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
      <div className="grid grid-cols-2 gap-2"><input className="input" type="number" step="0.01" placeholder="Preço" value={f.price || ""} onChange={(e) => setF({ ...f, price: e.target.value })} /><input className="input" placeholder="Categoria" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></div>
      <div className="flex items-center gap-3">{f.image && <img src={f.image} alt="" className="h-16 w-16 rounded-lg object-cover" />}<input type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" onChange={(e) => upload(e.target.files?.[0])} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.available} onChange={(e) => setF({ ...f, available: e.target.checked })} />Disponível</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.featured} onChange={(e) => setF({ ...f, featured: e.target.checked })} />Destaque na vitrine</label>
      {msg && <p className="text-sm text-gold">{msg}</p>}<div className="flex gap-2"><button className="btn" disabled={busy} onClick={save}>{busy ? "Enviando imagem…" : "Salvar"}</button>{f.id && <button className="btn-ghost" onClick={() => setF(empty)}>Cancelar</button>}</div></div>
    <div className="space-y-2">{!list ? <p className="text-cream/60">Carregando…</p> : !list.length ? <div className="card text-center text-cream/60">Cadastre o primeiro produto ao lado.</div> : list.map((p) => <div key={p.id} className="card flex items-center gap-3 !p-3">{p.image ? <img src={p.image} alt="" className="h-14 w-14 rounded-lg object-cover" /> : <div className="h-14 w-14 rounded-lg bg-white/5" />}<div className="flex-1"><p className="text-sm font-medium">{p.name}{p.featured ? " ★" : ""}</p><p className="text-xs text-cream/60">{brl(p.price)} · {p.available ? "Disponível" : "Indisponível"}</p></div><button className="btn-ghost !px-3 !py-1.5" onClick={() => setF(p)}>Editar</button><button className="btn-ghost !px-3 !py-1.5" onClick={() => confirm(`Excluir "${p.name}"?`) && adm("delete", "products", p.id)}>Excluir</button></div>)}</div></div></div>;
}
