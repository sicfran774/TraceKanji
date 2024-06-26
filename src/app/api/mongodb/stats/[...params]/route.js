import { getStats, updateStats, updateLastLoggedIn } from '@/lib/mongodb/kanji'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    const slug = params.params
    
    //Get account in database based on email
    const accountInfo = await getStats(slug[0])
    
    const stats = accountInfo.stats;
  
    return NextResponse.json({stats})
}

export async function POST(request, { params }) {
    const slug = params.params
    const email = slug[0]

    //Get updated settings from body of request
    const body = await request.json()
    let result


    const stats = body.updatedStats
    result = await updateStats(stats, email)
    

    return NextResponse.json({result})
}