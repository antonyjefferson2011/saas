"use client";
import { useMemo, useState } from "react";
import { Check, Clock, MapPin, MessageCircle, Minus, Plus, ShoppingBag, Store, Truck, Trash2, Star } from "lucide-react";
import { Product, brl, useCol, useSettings } from "@/lib/utils";
import { createOrder } from "@/lib/order";
const mask = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 11); return d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d; };
const Seg = ({ opts, v, on }: { opts: [string, any][]; v: string; on: (x: string) => void }) => <div className="grid grid-cols-2 gap-2">{opts.map(([o, I]) => <button key={o} type="button" onClick={() => on(o)} className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${v === o ? "border-gold bg-gold/15 text-gold" : "border-white/10 text-cream/70 hover:bg-white/5"}`}><I className="h-4 w-4" />{o}</button>)}</div>;
export default function Encomendas() {
  const prods = useCol<Product>("products"); const st = useSettings();
  const [cart, setCart] = useState<Record<string, number>>({}); const [cat, setCat] = useState("Todos");
  const [f, setF] = useState({ name: "", phone: "", date: "", period: "Tarde", delivery: "Retirada", address: "", notes: "" });
  const [key] = useState(() => crypto.randomUUID()); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const [done, setDone] = useState<{ number: string; url: string; total: number } | null>(null);
  const list = (prods || []).filter((p) => p.available).sort((a, b) => Number(b.featured) - Number(a.featured));
  const cats = ["Todos", ...Array.from(new Set(list.map((p) => p.category).filter(Boolean)))];
  const shown = list.filter((p) => cat === "Todos" || p.category === cat);
  const lines = useMemo(() => list.filter((p) => cart[p.id]), [list, cart]);
  const total = lines.reduce((s, p) => s + p.price * cart[p.id], 0), count = lines.reduce((s, p) => s + cart[p.id], 0);
  const set = (id: string, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, Math.min(100, (c[id] || 0) + d)) }));
  const ok = lines.length && f.name.trim().length > 1 && f.phone.replace(/\D/g, "").length >= 10 && f.date && (f.delivery === "Retirada" || f.address.trim().length > 5);
  const U = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }));
  async function send() {
    setErr(""); setBusy(true);
    try { setDone(await createOrder(key, { ...f, name: f.name.trim(), address: f.delivery === "Entrega" ? f.address.trim() : "" }, lines.map((p) => ({ id: p.id, qty: cart[p.id] })), st?.whatsapp || "5586999294401")); window.scrollTo({ top: 0 }); }
    catch (e: any) { setErr(e.message || "Não foi possível enviar. Tente novamente."); } finally { setBusy(false); }
  }
  const logo = <img src="/logo.png" alt="Moisés Gourmet" className="mx-auto h-28 w-28 rounded-full object-cover shadow-2xl ring-2 ring-gold/60 sm:h-32 sm:w-32" />;
  if (st && !st.formEnabled) return <main className="grid min-h-screen place-items-center px-4 text-center"><div className="space-y-4">{logo}<h1 className="font-serif text-4xl text-gold">Encomendas pausadas</h1><p className="text-cream/70">Estamos sem receber pedidos no momento. Volte em breve!</p></div></main>;
  if (done) return <main className="grid min-h-screen place-items-center px-4"><div className="card w-full max-w-md space-y-5 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-gold"><Check className="h-8 w-8" /></div>
    <div><p className="text-xs uppercase tracking-widest text-cream/50">Pedido registrado</p><h1 className="font-serif text-5xl text-gold">{done.number}</h1><p className="mt-1 text-cream/70">Total {brl(done.total)}</p></div>
    <p className="rounded-lg bg-white/5 p-3 text-sm text-cream/80">Último passo: abra o WhatsApp e toque em <b>enviar</b> para a gente confirmar seu pedido.</p>
    <a href={done.url} target="_blank" className="btn w-full !py-3.5 !text-base"><MessageCircle className="h-5 w-5" />Enviar pelo WhatsApp</a>
    <button className="text-sm text-cream/60 underline" onClick={() => { location.reload(); }}>Fazer outro pedido</button></div></main>;
  return <main className="pb-28">
    <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden text-center">
      <video autoPlay muted loop playsInline preload="auto" poster="/poster.jpg" className="absolute inset-0 -z-20 h-full w-full object-cover"><source src="/hero.mp4" type="video/mp4" /></video>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/55 to-ink" />
      <div className="mx-auto max-w-2xl space-y-5 px-5 pt-8">{logo}
        <h1 className="font-serif text-5xl leading-[1.05] sm:text-7xl">Bolos no pote que <span className="text-gold">adoçam</span> seus melhores momentos</h1>
        <p className="mx-auto max-w-md text-cream/80">Feito com amor, ingredientes de qualidade e sabor que aconchega. Escolha, monte seu pedido e finalize pelo WhatsApp.</p>
        <a href="#cardapio" className="btn !px-7 !py-3.5 !text-base">Fazer minha encomenda</a></div></section>
    <section id="cardapio" className="mx-auto max-w-5xl scroll-mt-4 px-4 pt-10">
      <div className="mb-5 flex items-end justify-between"><h2 className="font-serif text-4xl">Cardápio</h2><span className="text-xs text-cream/50">Toque em + para adicionar</span></div>
      {cats.length > 2 && <div className="mb-5 flex gap-2 overflow-x-auto pb-1">{cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${cat === c ? "border-gold bg-gold text-ink" : "border-white/15 text-cream/70 hover:bg-white/5"}`}>{c}</button>)}</div>}
      {!prods ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{[...Array(6)].map((_, i) => <div key={i} className="card h-64 animate-pulse !bg-white/5" />)}</div>
        : !shown.length ? <div className="card py-10 text-center text-cream/60">Cardápio em atualização. Volte em instantes!</div>
        : <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">{shown.map((p) => <div key={p.id} className={`group overflow-hidden rounded-2xl border bg-panel transition ${cart[p.id] ? "border-gold/70" : "border-white/10"}`}>
          <div className="relative aspect-[4/3] overflow-hidden bg-white/5">{p.image ? <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <img src="/logo.png" alt="" className="mx-auto h-full object-contain p-4 opacity-30" />}
            {p.featured && <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-ink"><Star className="h-3 w-3" />Destaque</span>}</div>
          <div className="space-y-2 p-3 sm:p-4"><h3 className="font-serif text-xl leading-tight sm:text-2xl">{p.name}</h3><p className="line-clamp-2 min-h-[2rem] text-xs text-cream/60">{p.description}</p>
            <div className="flex items-center justify-between pt-1"><span className="text-lg font-semibold text-gold">{brl(p.price)}</span>
              {cart[p.id] ? <div className="flex items-center gap-2"><button aria-label="Diminuir" className="btn-ghost !p-1.5" onClick={() => set(p.id, -1)}><Minus className="h-4 w-4" /></button><span className="w-5 text-center text-sm">{cart[p.id]}</span><button aria-label="Aumentar" className="btn !p-1.5" onClick={() => set(p.id, 1)}><Plus className="h-4 w-4" /></button></div>
                : <button className="btn !px-3 !py-1.5" onClick={() => set(p.id, 1)}><Plus className="h-4 w-4" />Adicionar</button>}</div></div></div>)}</div>}</section>
    <section id="pedido" className="mx-auto mt-14 max-w-2xl scroll-mt-4 space-y-4 px-4">
      <h2 className="font-serif text-4xl">Finalizar pedido</h2>
      <div className="card space-y-3"><h3 className="flex items-center gap-2 font-medium"><ShoppingBag className="h-4 w-4 text-gold" />Seu carrinho</h3>
        {lines.length ? lines.map((p) => <div key={p.id} className="flex items-center justify-between gap-2 text-sm"><span className="flex-1">{cart[p.id]}x {p.name}</span><span>{brl(p.price * cart[p.id])}</span><button aria-label="Remover" onClick={() => set(p.id, -100)} className="text-cream/40 hover:text-red-400"><Trash2 className="h-4 w-4" /></button></div>) : <p className="text-sm text-cream/60">Seu carrinho está vazio. Escolha algo no cardápio.</p>}
        <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-semibold"><span>Total</span><span className="text-gold">{brl(total)}</span></div></div>
      <div className="card space-y-4"><h3 className="font-medium">Seus dados</h3>
        <div className="grid gap-3 sm:grid-cols-2"><div><label className="lbl">Nome</label><input className="input" value={f.name} onChange={(e) => U("name", e.target.value)} /></div><div><label className="lbl">WhatsApp</label><input className="input" inputMode="tel" placeholder="(86) 99999-9999" value={f.phone} onChange={(e) => U("phone", mask(e.target.value))} /></div></div>
        <div className="grid gap-3 sm:grid-cols-2"><div><label className="lbl">Data desejada</label><input type="date" className="input" min={new Date().toISOString().slice(0, 10)} value={f.date} onChange={(e) => U("date", e.target.value)} /></div><div><label className="lbl">Período</label><select className="input" value={f.period} onChange={(e) => U("period", e.target.value)}><option>Manhã</option><option>Tarde</option><option>Noite</option></select></div></div>
        <div><label className="lbl">Como prefere receber?</label><Seg v={f.delivery} on={(x) => U("delivery", x)} opts={[["Retirada", Store], ["Entrega", Truck]]} /></div>
        {f.delivery === "Entrega" && <div><label className="lbl flex items-center gap-1"><MapPin className="h-3 w-3" />Endereço de entrega</label><input className="input" placeholder="Rua, número, bairro" value={f.address} onChange={(e) => U("address", e.target.value)} /></div>}
        <div><label className="lbl">Observações</label><textarea className="input" rows={3} placeholder="Sabores, recado, alergias…" value={f.notes} onChange={(e) => U("notes", e.target.value)} /></div></div>
      {err && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{err}</p>}
      <button className="btn w-full !py-4 !text-base" disabled={!ok || busy} onClick={send}>{busy ? "Enviando pedido…" : "Confirmar pedido"}</button>
      {!ok && <p className="text-center text-xs text-cream/50">Preencha carrinho, nome, WhatsApp, data{f.delivery === "Entrega" ? " e endereço" : ""} para confirmar.</p>}</section>
    <footer className="mx-auto mt-14 max-w-2xl space-y-1 px-4 text-center text-sm text-cream/60">{st?.hours && <p className="flex items-center justify-center gap-2"><Clock className="h-4 w-4" />{st.hours}</p>}{st?.info && <p>{st.info}</p>}<p className="pt-2 text-xs">Moisés Gourmet · feito com amor</p></footer>
    {count > 0 && <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-ink/90 p-3 backdrop-blur"><a href="#pedido" className="btn mx-auto flex max-w-2xl !py-3.5"><ShoppingBag className="h-4 w-4" />Ver pedido · {count} {count > 1 ? "itens" : "item"} · {brl(total)}</a></div>}
  </main>;
}
