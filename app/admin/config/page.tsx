"use client";
import { useEffect, useState } from "react";
import { Settings, adm, useSettings } from "@/lib/utils";
export default function Config() {
  const s = useSettings(); const [f, setF] = useState<Settings | null>(null); const [m, setM] = useState("");
  useEffect(() => { if (s && !f) setF(s); }, [s, f]); if (!f) return <p className="text-cream/60">Carregando…</p>;
  const F = (k: keyof Settings, l: string, area = false) => <div><label className="lbl">{l}</label>{area ? <textarea className="input" rows={3} value={f[k] as string} onChange={(e) => setF({ ...f, [k]: e.target.value })} /> : <input className="input" value={f[k] as string} onChange={(e) => setF({ ...f, [k]: e.target.value })} />}</div>;
  return <div className="space-y-4"><h1 className="font-serif text-4xl">Configurações</h1><div className="card max-w-xl space-y-3">
    {F("name", "Nome do estabelecimento")}{F("whatsapp", "WhatsApp (com 55 e DDD, só números)")}{F("logo", "URL da logo (envie em Produtos e cole o link)")}{F("hours", "Horários de atendimento", true)}{F("info", "Informações comerciais", true)}
    {m && <p className="text-sm text-gold">{m}</p>}<button className="btn" onClick={async () => { await adm("set", "settings", "public", { ...f, whatsapp: f.whatsapp.replace(/\D/g, "") }); setM("Configurações salvas."); }}>Salvar</button></div></div>;
}
