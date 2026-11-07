"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, Users, Link2, Settings } from "lucide-react";
const nav = [["/admin", "Dashboard", LayoutDashboard], ["/admin/pedidos", "Pedidos", ShoppingBag], ["/admin/produtos", "Produtos", Package], ["/admin/clientes", "Clientes", Users], ["/admin/link", "Link de encomendas", Link2], ["/admin/config", "Configurações", Settings]] as const;
export default function A({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return <div className="min-h-screen md:flex">
    <aside className="border-b border-white/10 bg-panel md:min-h-screen md:w-60 md:border-b-0 md:border-r"><div className="px-5 py-4 font-serif text-2xl text-gold">Moisés Gourmet</div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">{nav.map(([h, l, I]) => <Link key={h} href={h} className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${path === h ? "bg-gold/15 text-gold" : "text-cream/70 hover:bg-white/5"}`}><I className="h-4 w-4" />{l}</Link>)}</nav></aside>
    <main className="flex-1 p-4 md:p-8">{children}</main></div>;
}
