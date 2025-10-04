import { getDecks, getKanji, updateDecks } from '@/lib/mongodb/kanji'
import { NextResponse } from 'next/server'
 
export async function GET(request, { params }) {
  const parameters = await params
  const slug = parameters.params //Should be email, then deck
  
  //Get account in database based on email
  const accountInfo = await getDecks(slug[0])
  
  const decks = accountInfo.decks;

  return NextResponse.json({decks})
}

export async function POST(request, { params }) {
  const parameters = await params
  const slug = parameters.params //Should be email, then deck
  const email = slug[0]

  //Get updated decks from body of request
  const body = await request.json()
  const decks = body.updatedDecks

  const result = await updateDecks(decks, email)

  return NextResponse.json({result})
}