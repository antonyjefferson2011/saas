"use client";
import { Order, brl, useCol } from "@/lib/utils";
export default function Clientes() {
  const o = useCol<Order>("orders", true); if (!o) return <p className="text-cream/60">Carregando…</p>;
  const m = new Map<string, { name: string; phone: string; n: number; total: number; nums: string[] }>();
  o.forEach((x) => { const k = x.phone.replace(/\D/g, ""); const c = m.get(k) || { name: x.name, phone: x.phone, n: 0, total: 0, nums: [] }; c.n++; c.nums.push(x.number); if (x.status !== "Cancelado") c.total += x.total; m.set(k, c); });
  return <div className="space-y-4"><h1 className="font-serif text-4xl">Clientes</h1>{!m.size && <div className="card text-center text-cream/60">Os clientes aparecem aqui após o primeiro pedido.</div>}
    {[...m.values()].sort((a, b) => b.total - a.total).map((c) => <div key={c.phone} className="card flex flex-wrap justify-between gap-2"><div><p className="font-medium">{c.name}</p><p className="text-sm text-cream/60">{c.phone} · Pedidos: {c.nums.join(", ")}</p></div><div className="text-right"><p className="text-gold">{brl(c.total)}</p><p className="text-xs text-cream/60">{c.n} pedido(s)</p></div></div>)}</div>;
}
