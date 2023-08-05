import { getDecks, getKanji } from '@/lib/mongodb/kanji'
import { NextResponse } from 'next/server'
 
export async function GET(request, { params }) {
  const slug = params.params //Should be email, then deck
  
  //Get account in database based on email
  const accountInfo = await getDecks(slug[0])
  
  const decks = accountInfo.decks;

  return NextResponse.json({decks})
}