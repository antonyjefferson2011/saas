import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
export type OrderForm = { name: string; phone: string; date: string; period: string; delivery: string; address: string; notes: string };
const R = (v: number) => "R$ " + v.toFixed(2).replace(".", ",");
export async function createOrder(key: string, f: OrderForm, lines: { id: string; qty: number }[], wa: string) {
  const r: any = await runTransaction(db, async (tx) => {
    const ref = doc(db, "orders", key), cRef = doc(db, "meta", "counters");
    const [ex, c, ...ps] = await Promise.all([tx.get(ref), tx.get(cRef), ...lines.map((l) => tx.get(doc(db, "products", l.id)))]);
    if (ex.exists()) return ex.data();
    const items = lines.map((l, i) => {
      const p: any = ps[i].data();
      if (!p || !p.available) throw new Error("Um produto ficou indisponível. Atualize a página.");
      return { id: l.id, name: p.name, price: p.price, qty: l.qty };
    });
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const n = ((c.data() as any)?.orders || 0) + 1;
    const o = { number: `MG-${String(n).padStart(4, "0")}`, ...f, items, total, status: "Novo", paid: false, createdAt: serverTimestamp() };
    tx.set(cRef, { orders: n }); tx.set(ref, o); return o;
  });
  const [y, m, d] = r.date.split("-");
  const msg = [
    "*🍰 NOVA ENCOMENDA — MOISÉS GOURMET*", "━━━━━━━━━━━━━━━",
    `*Pedido:* ${r.number}`, `*Cliente:* ${r.name}`, `*Telefone:* ${r.phone}`,
    `*Data:* ${d}/${m}/${y} (${r.period})`,
    `*Recebimento:* ${r.delivery}${r.delivery === "Entrega" ? ` — ${r.address}` : ""}`, "",
    "*🧾 Itens*", ...r.items.map((i: any) => `• ${i.qty}x ${i.name} — ${R(i.price * i.qty)}`), "",
    `*💰 Total: ${R(r.total)}*`, ...(r.notes ? ["", `📝 *Obs:* ${r.notes}`] : []),
    "━━━━━━━━━━━━━━━", "Aguardo a confirmação do pedido. Obrigado(a)! 💛",
  ].join("\n");
  return { number: r.number as string, total: r.total as number, url: `https://wa.me/${wa.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}` };
}
