let status = "CLEAR";
let lastUpdated = new Date().toLocaleString();

export async function GET() {
  return Response.json({ status, lastUpdated });
}

export async function POST(request: Request) {
  const body = await request.text();
  if (body === "BLOCKED") {
    status = "BLOCKED";
    lastUpdated = new Date().toLocaleString();
  } else if (body === "CLEAR") {
    status = "CLEAR";
    lastUpdated = new Date().toLocaleString();
  }
  return Response.json("OK");
}
