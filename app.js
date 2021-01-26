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

let server;
module.exports = {
  start(port) {
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    return app;
  },
  stop() {
    server.close();
  }
};