import { separateAccounts } from "@/lib/emailer/emailer"
import { NextResponse } from "next/server"

export async function GET(request) {

    const response = separateAccounts()

    return NextResponse.json({response})
  }