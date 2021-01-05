const express = require('express');
const bodyParser = require('body-parser');
const client = require('./connection');

const { dbInit } = require("./db/db");
const config = require("./config");

const app = express();

//Connect to db
client.connect();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

// Handle db connection and db creation here
dbInit(client)
    .then(() => console.log("Db connect success"))
    .catch((err) => {
        console.log("Error in connecting to db",err);
        process.exit(1);
    });

require('./routes').router(app);

app.listen(config.port, () => {
    console.log('Server is running on port ', config.port);
});

module.exports = app;