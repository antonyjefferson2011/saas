"use client";
import { useState } from "react";
import { adm, useSettings } from "@/lib/utils";
export default function Link() {
  const s = useSettings(); const [ok, setOk] = useState(false); if (!s) return <p className="text-cream/60">Carregando…</p>;
  const url = `${location.origin}/encomendas`;
  return <div className="space-y-4"><h1 className="font-serif text-4xl">Link de encomendas</h1><div className="card max-w-xl space-y-4">
    <input readOnly className="input" value={url} />
    <div className="flex flex-wrap gap-2"><button className="btn" onClick={() => { navigator.clipboard.writeText(url); setOk(true); setTimeout(() => setOk(false), 2000); }}>{ok ? "Copiado!" : "Copiar link"}</button><a className="btn-ghost" href={url} target="_blank">Abrir formulário</a></div>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={s.formEnabled} onChange={(e) => adm("set", "settings", "public", { ...s, formEnabled: e.target.checked })} />Formulário ativo (recebendo encomendas)</label></div></div>;
}
