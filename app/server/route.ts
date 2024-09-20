let status = "UNBLOCKED";

export async function GET(request: Request) {
  return Response.json({ status: status });
}

export async function POST(request: Request) {
  const body = await request.text();
  if (body === "BLOCKED") {
    status = "BLOCKED";
  } else if (body === "UNBLOCKED") {
    status = "UNBLOCKED";
  }
  return Response.json("OK");
}
