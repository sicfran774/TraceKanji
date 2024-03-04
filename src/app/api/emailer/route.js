import { NextResponse } from "next/server"
import { sendEmails } from "@/lib/emailer/emailer"

export const dynamic = 'force-dynamic'
export async function GET(request) {

    const response = await sendEmails()

    return NextResponse.json({response})
  }