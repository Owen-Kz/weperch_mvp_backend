const { client } = require("../routes/dbConfig");

const dotenv = require("dotenv").config();

const database = client.db(process.env.DB_NAME)


module.exports ={
     database
}
