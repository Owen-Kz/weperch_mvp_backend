// const { MongoClient, ServerApiVersion } = require('mongodb');

const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv").config();

// const uri = 'mongodb+srv://bensonmichaelowen:6OYIaNt7FT0EBQ52@marketplace.nnwmcci.mongodb.net/?retryWrites=true&w=majority&appName=marketplace';
const uri = process.env.CONNECTION_STRING;

const serverApiOptions = {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
};
  
const client = new MongoClient(uri, { serverApi: serverApiOptions });

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB server");
        // return client.db('market_dev');
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Re-throw the error for the caller to handle
    }
} 
 
module.exports = {
    client, 
    connectToDatabase
}
