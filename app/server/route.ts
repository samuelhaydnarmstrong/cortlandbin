import { kv } from "@vercel/kv";

export async function GET() {
  const status = await kv.get("status");
  const lastUpdated = await kv.get("lastUpdated");
  return Response.json({ status, lastUpdated });
}

export async function POST(request: Request) {
  const body = await request.text();
  if (body === "BLOCKED") {
    kv.set("status", "BLOCKED");
    kv.set("lastUpdated", new Date().toLocaleString());
  } else if (body === "CLEAR") {
    kv.set("status", "CLEAR");
    kv.set("lastUpdated", new Date().toLocaleString());
  }
  return Response.json("OK");
}
