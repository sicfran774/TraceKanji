export async function sendEmails(){
    const result = await fetch(process.env.FLASK_ENDPOINT + "api/emailer", {
        method: "GET"
    })
    console.log(result)
    return result
}