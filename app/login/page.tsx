"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
export default function Login() {
  const r = useRouter(); const [e, setE] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState(""); const [b, setB] = useState(false);
  async function go(ev: React.FormEvent) { ev.preventDefault(); setB(true); setErr(""); try { await signInWithEmailAndPassword(auth, e, p); r.push("/admin"); } catch { setErr("E-mail ou senha incorretos."); setB(false); } }
  return <main className="grid min-h-screen place-items-center px-4"><form onSubmit={go} className="card w-full max-w-sm space-y-4"><h1 className="text-center font-serif text-4xl text-gold">Moisés Gourmet</h1><p className="text-center text-xs uppercase tracking-widest text-cream/50">Painel administrativo</p>
    <input className="input" type="email" placeholder="E-mail" value={e} onChange={(x) => setE(x.target.value)} required /><input className="input" type="password" placeholder="Senha" value={p} onChange={(x) => setP(x.target.value)} required />
    {err && <p className="text-sm text-red-400">{err}</p>}<button className="btn w-full" disabled={b}>{b ? "Entrando…" : "Entrar"}</button></form></main>;
}
