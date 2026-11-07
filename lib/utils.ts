"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, addDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
export type Product = { id: string; name: string; description: string; price: number; image?: string; category: string; available: boolean; featured: boolean };
export type Order = { id: string; number: string; name: string; phone: string; date: string; notes: string; total: number; status: string; paid: boolean; internalNote?: string; createdAt: any; items: { id: string; name: string; price: number; qty: number }[] };
export type Settings = { name: string; whatsapp: string; hours: string; info: string; logo: string; formEnabled: boolean };
export const STATUSES = ["Novo", "Confirmado", "Em preparação", "Pronto", "Entregue", "Cancelado"];
export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export function useCol<T>(name: string, _admin = false) {
  const [d, setD] = useState<T[] | null>(null);
  useEffect(() => onSnapshot(collection(db, name), (s) => setD(s.docs.map((x) => ({ id: x.id, ...x.data() }) as T)), () => setD([])), [name]);
  return d;
}
export async function adm(op: string, col: string, id?: string, data?: any) {
  if (data) { data = { ...data }; delete data.id; }
  if (op === "add") await addDoc(collection(db, col), data);
  else if (op === "set") await setDoc(doc(db, col, id!), data);
  else if (op === "update") await updateDoc(doc(db, col, id!), data);
  else if (op === "delete") await deleteDoc(doc(db, col, id!));
}
export function useSettings() {
  const [s, setS] = useState<Settings | null>(null);
  useEffect(() => onSnapshot(doc(db, "settings", "public"), (x) => setS({ name: "Moisés Gourmet", whatsapp: "5586999294401", hours: "", info: "", logo: "", formEnabled: true, ...(x.data() as any) }), () => {}), []);
  return s;
}
