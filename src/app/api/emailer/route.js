import { separateAccounts } from "@/lib/emailer/emailer"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export async function GET(request) {

    const response = await separateAccounts()

    return NextResponse.json({response})
  }