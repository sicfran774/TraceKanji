import { dailyResets } from "@/lib/mongodb/kanji"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export async function GET(request) {

    const response = await dailyResets()

    return NextResponse.json({response})
  }