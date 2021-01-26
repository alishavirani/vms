const express = require('express');
const bodyParser = require('body-parser');

const { dbInit } = require("./src/db/db");

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

// Handle db connection and db creation here
dbInit()
    .then(() => console.log("Db connect success"))
    .catch((err) => {
        console.log("Error in connecting to db",err);
        process.exit(1);
    });

require('./src/routes').router(app);

app.listen(process.env.PORT, () => {
  console.log('Server is running on port ', process.env.PORT);
});

module.exports = app;