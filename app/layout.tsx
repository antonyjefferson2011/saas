import "./globals.css";
import { Cormorant_Garamond, Inter } from "next/font/google";
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "700"], variable: "--serif" });
const sans = Inter({ subsets: ["latin"], variable: "--sans" });
export const metadata = { title: "Moisés Gourmet", description: "Encomendas de bolos no pote e na travessa" };
export default function L({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body className={`${serif.variable} ${sans.variable}`}>{children}</body></html>;
}
