"use client";
import { useState } from "react";
import { Order, STATUSES, adm, brl, useCol } from "@/lib/utils";
export default function Pedidos() {
  const all = useCol<Order>("orders", true); const [q, setQ] = useState(""); const [s, setS] = useState(""); const [per, setPer] = useState("all"); const [sel, setSel] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  if (!all) return <p className="text-cream/60">Carregando…</p>;
  const lim = per === "all" ? 0 : Date.now() / 1000 - Number(per) * 86400;
  const list = all.filter((o) => (!s || o.status === s) && (!lim || (o.createdAt?.seconds || 0) >= lim) && `${o.number} ${o.name} ${o.phone}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  const o = all.find((x) => x.id === sel); const up = (d: Partial<Order>) => adm("update", "orders", o!.id, d);
  return <div className="space-y-4"><h1 className="font-serif text-4xl">Pedidos</h1>
    <div className="flex flex-wrap gap-2"><input className="input max-w-xs" placeholder="Buscar número, nome ou telefone" value={q} onChange={(e) => setQ(e.target.value)} />
      <select className="input w-auto" value={s} onChange={(e) => setS(e.target.value)}><option value="">Todos os status</option>{STATUSES.map((x) => <option key={x}>{x}</option>)}</select>
      <select className="input w-auto" value={per} onChange={(e) => setPer(e.target.value)}><option value="all">Todo o período</option><option value="1">Hoje</option><option value="7">7 dias</option><option value="30">30 dias</option></select></div>
    <div className="grid gap-4 lg:grid-cols-2"><div className="space-y-2">{list.map((x) => <button key={x.id} onClick={() => { setSel(x.id); setNote(null); }} className={`card w-full text-left transition hover:border-gold/50 ${sel === x.id ? "!border-gold" : ""}`}><div className="flex justify-between"><b>{x.number}</b><span className="text-gold">{brl(x.total)}</span></div><p className="text-sm text-cream/70">{x.name} · {x.status}{x.paid ? " · Pago" : ""}</p></button>)}{!list.length && <div className="card text-center text-cream/60">Nenhum pedido encontrado.</div>}</div>
      {o && <div className="card h-fit space-y-3"><h2 className="font-serif text-3xl">{o.number}</h2><p className="text-sm">{o.name} · {o.phone}<br />Data: {o.date.split("-").reverse().join("/")}{(o as any).period ? ` · ${(o as any).period}` : ""}<br />{(o as any).delivery}{(o as any).address ? ` — ${(o as any).address}` : ""}</p>
        {o.items.map((i) => <div key={i.id} className="flex justify-between text-sm"><span>{i.qty}x {i.name}</span><span>{brl(i.price * i.qty)}</span></div>)}<p className="border-t border-white/10 pt-2 font-semibold">Total {brl(o.total)}</p>{o.notes && <p className="text-sm text-cream/70">Obs. do cliente: {o.notes}</p>}
        <div><label className="lbl">Status</label><select className="input" value={o.status} onChange={(e) => { if (e.target.value !== "Cancelado" || confirm("Cancelar este pedido?")) up({ status: e.target.value }); }}>{STATUSES.map((x) => <option key={x}>{x}</option>)}</select></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={o.paid} onChange={(e) => up({ paid: e.target.checked })} />Pagamento registrado</label>
        <div><label className="lbl">Observação interna</label><textarea className="input" rows={3} value={note ?? o.internalNote ?? ""} onChange={(e) => setNote(e.target.value)} /><button className="btn mt-2" onClick={() => up({ internalNote: note ?? "" })}>Salvar observação</button></div></div>}</div></div>;
}
