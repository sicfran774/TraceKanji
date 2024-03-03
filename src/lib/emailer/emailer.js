import { getAllSubscribedEmails } from "../mongodb/kanji";
import { sortByDueDate, cardCounts } from "@/app/util/interval";
import moment from "moment";

const nodeMailer = require('nodemailer')

let transporter = nodeMailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.APP_PASSWORD
    }
})

const emailHeader = `
    <div>
        <h1>Trace Kanji</h1>
        <h3>Don't forget to study your kanji today!</h3>
    </div>
`

const emailFooter = `
    <div>
        <h3>
            <a href="https://tracekanji.com">Click here to start studying!</a> がんばって！
        </h3> 
    </div>
`

export async function separateAccounts(){
    try{
        console.log("Fetching emails.")
        const emails = await getAllSubscribedEmails()
        
        emails.forEach(account => {
            const email = account.email
            const decks = account.decks.map(deck => {
                return [deck[0], sortByDueDate(deck)]
            })
            const counts = account.decks.map(deck => {
                return cardCounts(deck)
            })
            createEmailHTML(email, decks, counts)
        });


    } catch (e){
        console.log(e)
        return {error: 'Failed to separate accounts for email preparation'}
    }
}

async function createEmailHTML(email, decks, counts){
    try{
        console.log("Creating email HTMLs.")
        let deckString = "<div>"

        decks.forEach((deck, index) => {
            const sum = counts[index].reduce((acc, current) => acc + current, 0)
            const kanji = deck.slice(1, deck.length)
            if(sum > 0){
                deckString += `
                    <p>
                        You have <span style="color:green;">${sum}</span> kanji due in <span style="color:blue;">${deck[0]}</span>
                    </p>
                    <p>
                        ${kanji}
                    </p>
                `
            }
        })

        deckString += "</div>"

        const body = `
            <div>
                ${deckString}
            </div>
        `

        const html = `
            <div>
                ${emailHeader}
                ${body}
                ${emailFooter}
            </div>
        `

        //console.log(html)
        sendEmail(email, html)

    } catch (e){
        console.log(e)
        return {error: 'Failed to create email HTML'}
    }
}

async function sendEmail(email, htmlString){
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Don't forget to study your kanji!",
        html: htmlString
    }

    transporter.sendMail(mailOptions, function (e, info) {
        if (e) {
            console.log(e);
            return { error: 'Failed to send email' };
        } else {
            console.log("Email sent to " + email);
        }
    })
}