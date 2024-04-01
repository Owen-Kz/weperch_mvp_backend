const express = require('express')
const { connectToDatabase } = require('./routes/dbConfig')
const bodyParser = require('body-parser')

const app = express()
const server = require("http").Server(app)
const cookie = require("cookie-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(express.json());
console.log("Muffin")

connectToDatabase()


app.use("/", require("./routes/pages"))


server.listen(1487)