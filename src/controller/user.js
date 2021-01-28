const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const router = express.Router();

const user = require("../db/user");
const metaData = require("../db/metadata");

const saltRounds = parseInt(process.env.SALT_ROUNDS);
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiry = process.env.JWT_EXPIRY;
const jwtIssuer = process.env.JWT_ISSUER;

router.post('/signup', async (req, res) => {
    //validations
    if (req.body && req.body.userid && req.body.password && req.body.regional_council) {
        if (!metaData.regionalCouncils.includes(req.body.regional_council)) {
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
            decodedToken = jwt.verify(token, jwtSecret);
        }
        if (decodedToken) {
            //verify userid from decodedtoken
            const userFound = await user.checkIfUserExists(decodedToken.userid);
            if (!userFound) {
                res.status(401).send({ "message": "Invalid token" });
                return;
            }
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
            return;
        }
        if (err.name === "JsonWebTokenError") {
            res.status(401).send(err);
            return;
        }
        if (err.name === "TokenExpiredError") {
            res.status(401).send(err);
            return;
        }
        res.status(500).send(err);
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
        const token = jwt.sign({ userid: req.body.userid }, jwtSecret, {
            expiresIn: jwtExpiry,
            issuer: jwtIssuer
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