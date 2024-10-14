import { kv } from "@vercel/kv";
import { addHours, differenceInHours, isSameMinute } from "date-fns";

export async function GET() {
  const chuteStatus = await kv.get("chuteStatus");
  const chuteUpdated = await kv.get("chuteUpdated");

  let gymStatus = await kv.get("gymStatus");
  const gymUpdated: string | null = await kv.get("gymUpdated");

  // If the gym was set as busy over an hour ago switch it to quiet.
  if (gymUpdated) {
    const isUpdatedWithinHour = differenceInHours(new Date().toString(), gymUpdated) <= 1;
    if (gymStatus === "BUSY" && !isUpdatedWithinHour) {
      kv.set("gymStatus", "QUIET");
      kv.set("gymUpdated", addHours(gymUpdated, 1));
      gymStatus = "QUIET";
    }
  }

  return Response.json({ chuteStatus, chuteUpdated, gymStatus, gymUpdated });
}

export async function POST(request: Request) {
  const body = await request.text();

  // Chute
  if (body === "BLOCKED" || body === "CLEAR") {
    const chuteUpdated: string | null = await kv.get("chuteUpdated");
    if (!chuteUpdated || (chuteUpdated && !isSameMinute(new Date().toString(), chuteUpdated))) {
      kv.set("chuteStatus", body);
      kv.set("chuteUpdated", new Date().toString());
    } else {
      console.log("Tried to update chute status within cooldown");
    }
  }

  // Gym
  else if (body === "QUIET" || body === "BUSY") {
    const gymUpdated: string | null = await kv.get("gymUpdated");
    if (!gymUpdated || (gymUpdated && !isSameMinute(new Date().toString(), gymUpdated))) {
      kv.set("gymStatus", body);
      kv.set("gymUpdated", new Date().toString());
    } else {
      console.log("Tried to update gym status within cooldown");
    }
  }

  return Response.json("OK");
}
