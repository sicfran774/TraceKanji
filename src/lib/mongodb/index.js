import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

if(!uri){
    throw new Error('Must add Mongo URI to .env.local')
}

let client = new MongoClient(uri, options)
let clientPromise

//If the client has already been made, use that one. Else make a new connection
if(process.env.NODE_ENV !== 'production'){
    if(!global._mongoClientPromise) {
        global._mongoClientPromise = client.connect()
    }

    clientPromise = global._mongoClientPromise
} else {
    clientPromise = client.connect()
}

export default clientPromise