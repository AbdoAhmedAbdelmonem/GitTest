import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const res = await fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSccLnBUzkM_m-vynoPJCK7YQm6I1UrHDOwpfBSY13itquf5hw/formResponse",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }
    )
    
    return NextResponse.json({ ok: res.ok, status: res.status })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
