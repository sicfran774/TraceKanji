import { getSettings, updateSettings, updateLastLoggedIn } from '@/lib/mongodb/kanji'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    const slug = params.params
    
    //Get account in database based on email
    const accountInfo = await getSettings(slug[0])
    
    const settings = accountInfo.settings;
  
    return NextResponse.json({settings})
}
  
export async function POST(request, { params }) {
    const slug = params.params
    const email = slug[0]

    //Get updated settings from body of request
    const body = await request.json()
    let result

    if(body.lastLoggedIn){
        const date = body.lastLoggedIn
        result = await updateLastLoggedIn(date, email)
    } else {
        const settings = body.updatedSettings
        result = await updateSettings(settings, email)
    }
    

    return NextResponse.json({result})
}