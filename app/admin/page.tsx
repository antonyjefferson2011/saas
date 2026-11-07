"use client";
import { Order, brl, useCol } from "@/lib/utils";
export default function Dash() {
  const o = useCol<Order>("orders", true); if (!o) return <p className="text-cream/60">Carregando…</p>;
  const day = (x: Order) => (x.createdAt?.seconds ? new Date(x.createdAt.seconds * 1000).toISOString().slice(0, 10) : "");
  const today = new Date().toISOString().slice(0, 10), live = o.filter((x) => x.status !== "Cancelado");
  const days = [...Array(7)].map((_, i) => { const d = new Date(Date.now() - (6 - i) * 864e5).toISOString().slice(0, 10); return { d, n: o.filter((x) => day(x) === d).length }; });
  const max = Math.max(1, ...days.map((x) => x.n)); const top: Record<string, number> = {};
  live.forEach((x) => x.items.forEach((i) => (top[i.name] = (top[i.name] || 0) + i.qty)));
  const cards = [["Total de pedidos", o.length], ["Hoje", o.filter((x) => day(x) === today).length], ["Pendentes", o.filter((x) => ["Novo", "Confirmado", "Em preparação"].includes(x.status)).length], ["Concluídos", o.filter((x) => x.status === "Entregue").length], ["Faturamento (pago)", brl(o.filter((x) => x.paid && x.status !== "Cancelado").reduce((s, x) => s + x.total, 0))]];
  const recent = [...o].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 6);
  return <div className="space-y-6"><h1 className="font-serif text-4xl">Dashboard</h1>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{cards.map(([l, v]) => <div key={l as string} className="card"><p className="text-xs text-cream/60">{l}</p><p className="mt-1 text-2xl font-semibold text-gold">{v}</p></div>)}</div>
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card"><h2 className="mb-4 font-medium">Pedidos nos últimos 7 dias</h2><div className="flex h-40 items-end gap-2">{days.map((x) => <div key={x.d} className="flex flex-1 flex-col items-center gap-1"><span className="text-xs">{x.n}</span><div className="w-full rounded-t bg-gold transition-all" style={{ height: `${(x.n / max) * 100}%`, minHeight: 2 }} /><span className="text-[10px] text-cream/50">{x.d.slice(8)}/{x.d.slice(5, 7)}</span></div>)}</div></div>
      <div className="card"><h2 className="mb-3 font-medium">Mais vendidos</h2>{Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n, q]) => <div key={n} className="flex justify-between border-b border-white/5 py-2 text-sm"><span>{n}</span><span className="text-gold">{q}</span></div>)}{!Object.keys(top).length && <p className="text-sm text-cream/50">Sem vendas ainda.</p>}</div></div>
    <div className="card"><h2 className="mb-3 font-medium">Atividade recente</h2>{recent.map((x) => <div key={x.id} className="flex justify-between border-b border-white/5 py-2 text-sm"><span>{x.number} · {x.name}</span><span className="text-cream/60">{x.status} · {brl(x.total)}</span></div>)}{!recent.length && <p className="text-sm text-cream/50">Nenhum pedido recebido.</p>}</div></div>;
}
