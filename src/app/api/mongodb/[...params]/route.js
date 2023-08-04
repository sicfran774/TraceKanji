import { getKanji } from '@/lib/mongodb/kanji'
import { NextResponse } from 'next/server'
 
export async function GET(request, { params }) {
  const slug = params.slug //Should be email, then deck
  const res = await getKanji([], [])
 
  return NextResponse.json({ res })
}