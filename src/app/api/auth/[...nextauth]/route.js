import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId:process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_SECRET,
        }),
    ],
    secret: process.env.OAUTH_SECRET
})

export { handler as GET, handler as POST }