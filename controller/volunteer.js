const jwt = require("jsonwebtoken");
const express = require('express');

const router = express.Router();

const volunteer = require("../db/volunteer");
const config = require("../config");

const marital_status_enum = ['Single/Unmarried', 'Married', 'Divorced', 'Widowed', 'Separated'];
const gender_enum = ['Male', 'Female'];
const blood_group_enum = ['A+ve', 'A-ve', 'B+ve', 'B-ve', 'AB+ve', 'AB-ve', 'O+ve', 'O-ve'];

//Add personal details of a volunteer route
router.post('/add-volunteer',async (req, res) => {
    //validations
    if (!req.body || !req.body.jamatkhana_id || !req.body.first_name || !req.body.last_name || !req.body.dob) {
        res.status(400).send({ "message": "Missing values in the request body. Required fields: jamatkhana_id, first_name, last_name, dob" });
        return;
    }
    if (req.body.marital_status) {
        if (!marital_status_enum.includes(req.body.marital_status)) {
            res.status(400).send({ "message": `Invalid value of marital_status. Please select a value from ${marital_status_enum}` });
            return;
        }
    }
    if (req.body.gender) {
        if (!gender_enum.includes(req.body.gender)) {
            res.status(400).send({ "message": `Invalid value of gender. Please select a value from ${gender_enum}` });
            return;
        }
    }
    if (req.body.blood_group) {
        if (!blood_group_enum.includes(req.body.blood_group)) {
            res.status(400).send({ "message": `Invalid value of blood_group. Please select a value from ${blood_group_enum}` });
            return;
        }
    }
    
    try {
        //check if token is valid
        let token = req.headers["authorization"];
        let decodedToken;
        if (token) {
            token = token.split(' ')[1];
            decodedToken = jwt.verify(token, config.jwtSecret);
        }
        if (!decodedToken) {
            res.status(400).send({ "message": "Invalid token" });
            return;
        }

        const idsInBody = {
            jamatkhana_id: req.body.jamatkhana_id,
            jamati_title_id: req.body.jamati_title_id || null,
            jamati_designation_id: req.body.jamati_designation_id || null,
            title_id: req.body.title_id || null,
            qualification_id: req.body.qualification_id || null,
            occupation_id: req.body.occupation_id || null
        }
        if (req.body.dob) {
            req.body.dob = new Date(req.body.dob).toISOString()
        }
        const dbData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            middle_name: req.body.middle_name || null,
            tkn_number: req.body.tkn_number || null,
            marital_status: req.body.marital_status || "null",
            gender: req.body.gender  || "null",
            blood_group: req.body.blood_group  || "null",
            dob: req.body.dob || null,
            active: req.body.active || null,
            created_by: decodedToken.userid,
            created_at: new Date().toISOString()
        }

        for (const column in idsInBody) {
            if (idsInBody[column]) {
                const tableName = column.slice(0, -3)
                const found = await volunteer.checkIfRecordExists(tableName, idsInBody[column])
                if (!found) {
                    res.status(404).send({ "message": `ID ${idsInBody[column]} not found in ${tableName} table` });
                    return;
                }
            }
            dbData[column] = idsInBody[column];
        }

        const response = await volunteer.insertVolunteersPersonalDetails(dbData);
        res.status(201).send({
            "message": "Volunteer created successfully",
            volunteer_id: response.volunteer_id,
            data: response
        });
    } catch(err) {
        if (err.name === "JsonWebTokenError") {
            res.status(401).send(err);
            return;
        }
        console.log("err???", err)
        res.status(500).send(err);
    }
});

module.exports = router;