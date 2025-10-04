import { getSettings, updateSettings, updateLastLoggedIn, getPremadeDeck } from '@/lib/mongodb/kanji'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    const parameters = await params
    const slug = parameters.params
    
    //Get deck in database based on name of deck
    const deck = await getPremadeDeck(slug[0])
  
    return NextResponse.json({deck})
}
  
export async function POST(request, { params }) {
    const parameters = await params
    const slug = parameters.params
    const email = slug[0]

    //Get deck from body of request
    const body = await request.json()

    const result = await addPremadeToAccount(body.deck, email)
    
    return NextResponse.json({result})
}