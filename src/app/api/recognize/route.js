import { getRecognizedKanji } from "@/lib/recognize/recognize"
import { NextResponse } from 'next/server'

export async function POST(request) {
    //Get data URI from body of request
    const body = await request.json()
  
    const result = await getRecognizedKanji(body.data)
  
    return NextResponse.json(result)
  }