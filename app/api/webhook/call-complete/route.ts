import { NextRequest, NextResponse } from "next/server";

interface CallCompleteBody {
  secret: string;
  call_sid: string;
  caller: string;
  called: string;
  business_name: string;
  industry: string;
  duration: number;
  timestamp: string;
}

export async function POST(req: NextRequest) {
  let body: CallCompleteBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (!expectedSecret || body.secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[call-complete]", {
    call_sid: body.call_sid,
    caller: body.caller,
    called: body.called,
    business_name: body.business_name,
    industry: body.industry,
    duration: body.duration,
    timestamp: body.timestamp,
  });

  return NextResponse.json({ status: "received" }, { status: 200 });
}
