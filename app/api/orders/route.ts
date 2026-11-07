import { NextResponse } from "next/server";
import { adminDb } from "@/lib/admin";
import { FieldValue } from "firebase-admin/firestore";
export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    const b = await req.json();
    const key = String(b.key || "");
    const name = String(b.name || "").trim().slice(0, 80);
    const phone = String(b.phone || "").replace(/\D/g, "");
    const date = String(b.date || "");
    const notes = String(b.notes || "").slice(0, 500);
    const cart = Array.isArray(b.items) ? b.items.slice(0, 40) : [];
    if (!/^[a-zA-Z0-9-]{16,64}$/.test(key) || name.length < 2 || phone.length < 10 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !cart.length)
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    const st = (await adminDb.doc("settings/public").get()).data();
    if (st && st.formEnabled === false) return NextResponse.json({ error: "Encomendas indisponíveis no momento." }, { status: 403 });
    const orderRef = adminDb.doc(`orders/${key}`); // chave idempotente = sem duplicidade
    const result = await adminDb.runTransaction(async (tx) => {
      const ex = await tx.get(orderRef);
      if (ex.exists) return ex.data()!;
      const items: any[] = []; let total = 0;
      for (const c of cart) {
        const qty = Math.floor(Number(c.qty));
        if (!(qty >= 1 && qty <= 100)) throw new Error("Quantidade inválida.");
        const p = (await tx.get(adminDb.doc(`products/${String(c.id)}`))).data();
        if (!p || !p.available) throw new Error("Produto indisponível.");
        items.push({ id: String(c.id), name: p.name, price: p.price, qty }); total += p.price * qty; // preço sempre do servidor
      }
      const cRef = adminDb.doc("meta/counters");
      const n = ((await tx.get(cRef)).data()?.orders || 0) + 1;
      const order = { number: `MG-${String(n).padStart(4, "0")}`, name, phone, date, notes, items, total, status: "Novo", paid: false, createdAt: FieldValue.serverTimestamp() };
      tx.set(cRef, { orders: n }); tx.set(orderRef, order);
      return order;
    });
    const r: any = result;
    const [y, m, d] = r.date.split("-");
    const msg = `Olá! Fiz uma encomenda no Moisés Gourmet.\n\nPedido: ${r.number}\nNome: ${r.name}\nData desejada: ${d}/${m}/${y}\n\n` +
      r.items.map((i: any) => `${i.qty}x ${i.name} - R$ ${(i.price * i.qty).toFixed(2).replace(".", ",")}`).join("\n") +
      `\n\nTotal: R$ ${r.total.toFixed(2).replace(".", ",")}` + (r.notes ? `\nObs: ${r.notes}` : "");
    const wa = String(st?.whatsapp || "5586999294401").replace(/\D/g, "");
    return NextResponse.json({ number: r.number, total: r.total, url: `https://wa.me/${wa}?text=${encodeURIComponent(msg)}` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro ao salvar o pedido." }, { status: 500 });
  }
}
