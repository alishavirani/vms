const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const user = require("../db/user");
const config = require("../config");

const saltRounds = config.saltRounds;
const regionalCouncils = ["Western India", "Southern India", "CNEI", "NEG", "NS", "SS"];

router.post('/signup', async (req, res) => {
    //validations
    if (req.body && req.body.userid && req.body.password && req.body.regional_council) {
        if (!regionalCouncils.includes(req.body.regional_council)) {
            res.status(400).send({ "message": `Invalid value of regional_council. Please select from "Western India", "Southern India","CNEI","NEG","NS","SS"` });
            return;
        }
    } else {
        res.status(400).send({ "message": "Missing values in the request body. Required fields: userid, password, regional_council" });
        return;
    }
    try {
        //check if token is valid
        let token = req.headers["authorization"];
        let decodedToken;
        if (token) {
            token = token.split(' ')[1];
            decodedToken = jwt.verify(token, config.jwtSecret);
        }

        //hash password
        const hash = await bcrypt.hashSync(req.body.password, saltRounds);

        const userInfo = req.body;
        userInfo.password = hash;
        userInfo.created_by = decodedToken ? decodedToken.userid : null;
        userInfo.created_at = new Date().toISOString();

        await user.addUser(userInfo);
        res.status(201).send({ "message": "User created successfully" });
    } catch (err) {
        if (err.code == "23505") {
            res.status(409).send(err);
        } else {
            res.status(500).send(err);
        }
    }
});

router.post('/login', async (req, res) => {
    //validations
    if (!req.body || !req.body.userid || !req.body.password) {
        res.status(400).send({ "message": "Missing values in the request body. Required fields: userid, password" });
        return;
    }
    try {
        //get hash password from db
        const hash = await user.getHashPw(req.body.userid);
        if (!hash) {
            res.status(404).send({ "message": `No user found with userid ${req.body.userid}` });
            return;
        }

        //compare password
        const match = bcrypt.compareSync(req.body.password, hash);
        if (!match) {
            res.status(400).send({ "message": `Invalid Password` });
            return;
        }

        //generate jwt token
        const token = jwt.sign({ userid: req.body.userid }, config.jwtSecret, {
            expiresIn: config.jwtExpiry,
            issuer: config.jwtIssuer
        });
        res.send({
            "message": "Login successful",
            "userid": req.body.userid,
            "token": `Bearer ${token}`
        });

    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;