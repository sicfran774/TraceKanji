import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export async function GET(request) {

    const response = await fetch(process.env.FLASK_ENDPOINT + "api/emailer")

    return NextResponse.json({response})
  }