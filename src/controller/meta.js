const express = require('express');
const jwt = require("jsonwebtoken");

const router = express.Router();

const meta = require("../db/meta");
const user = require("../db/user");

const jwtSecret = process.env.JWT_SECRET;

router.get('/:tableName', async (req, res) => {
    //validations
    if (!req.params) {
        res.status(400).send({"message": `Invalid param name. Please use a value from ${meta.metaTableNames}`});
        return
    }
    try {
        //check if token is valid    
        let token = req.headers["authorization"];
        let decodedToken;
        if (token) {
            token = token.split(' ')[1];
            decodedToken = jwt.verify(token, jwtSecret);
        }
        if (!decodedToken) {
            res.status(400).send({ "message": "Invalid token" });
            return;
        }
        //verify userid from decodedtoken
        const userFound = await user.checkIfUserExists(decodedToken.userid);
        if (!userFound) {
            res.status(401).send({ "message": "Invalid token" });
            return;
        }
        const data = await meta.getAllRecords(req.params.tableName);
        res.send(data);
    } catch (err) {
        console.log(err)
        if (err.name === "JsonWebTokenError") {
            res.status(401).send(err);
            return;
        }
        if (err.code && err.code === "42P01") {
            res.status(404).send({
                "message": `Table not found. Please use a value from ${meta.metaTableNames}`,
                error: err
            });
            return;
        }
        res.status(500).send(err);
        
    }
});


module.exports = router;