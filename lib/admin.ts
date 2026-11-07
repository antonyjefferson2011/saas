import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
const app = getApps()[0] ?? initializeApp({ credential: cert({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
}) });
export const adminDb = getFirestore(app);
export async function requireAdmin(req: Request) {
  const t = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!t) return false;
  try {
    const u = await getAuth(app).verifyIdToken(t);
    return (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim()).includes(u.email || "");
  } catch { return false; }
}
