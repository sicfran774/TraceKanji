import { getRecognizedKanji } from "@/lib/recognize/recognize"
import { incrementRecognitionTimes } from "@/lib/mongodb/kanji"
import { NextResponse } from 'next/server'

export async function POST(request) {
    incrementRecognitionTimes()
    //Get data URI from body of request
    const body = await request.json()
  
    const result = await getRecognizedKanji(body.data)
  
    return NextResponse.json(result)
  }