import { backupAccountData } from "@/lib/mongodb/kanji"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export async function GET(request) {

    const response = await backupAccountData()

    return NextResponse.json({response})
  }