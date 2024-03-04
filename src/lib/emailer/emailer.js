import { getAllSubscribedEmails } from "../mongodb/kanji";
import { sortByDueDate, cardCounts } from "@/app/util/interval";
import moment from "moment";
import { resolve } from "styled-jsx/css";

const nodeMailer = require('nodemailer')

let transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    secure: true,
    port: process.env.EMAIL_PORT,
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
        
        emails.forEach(async account => {
            const email = account.email
            const decks = account.decks.map(deck => {
                return [deck[0], sortByDueDate(deck)]
            })
            const counts = account.decks.map(deck => {
                return cardCounts(deck)
            })
            await createEmailHTML(email, decks, counts)
        });
    } catch (e){
        console.log(e)
        return {error: 'Failed to separate accounts for email preparation'}
    }
}

async function createEmailHTML(email, decks, counts){
    try{
        console.log(email, decks, counts)
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
        return 

    } catch (e){
        console.log(e)
        return {error: 'Failed to create email HTML'}
    }
}

async function verifyConnection(email, html){
    let attempts = 0, maxAttempts = 10;
    await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);

                if (attempts < maxAttempts - 1){
                    setTimeout(() => {
                        verifyConnection(email, html).then(resolve).catch(reject);
                    }, 3000); // Add a delay of 3000 milliseconds (3 seconds)
                } else {
                    reject(new Error(`Max attempts (${maxAttempts}) reached. Unable to verify connection.`));
                }
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });

    await sendEmail(email, html)
}

async function sendEmail(email, htmlString){
    console.log("Sending to " + email)
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Don't forget to study your kanji!",
        html: htmlString
    }

    const result = await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if(err){
                console.error(err)
                reject(err)
            } else {
                console.log(info)
                resolve(info)
            }
        })
    })

    return result
}