export async function sendEmails(){
    return await fetch(process.env.FLASK_ENDPOINT + "api/emailer")
}