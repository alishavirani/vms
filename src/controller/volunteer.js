const jwt = require("jsonwebtoken");
const express = require('express');

const router = express.Router();

const volunteer = require("../db/volunteer");
const user = require("../db/user");
const { enums } = require("../db/metadata");

const jwtSecret = process.env.JWT_SECRET;
const volunteerPersonalDetailsTable = "volunteer_personal_details";
const volunteerContactDetailsTable = "volunteer_contact_details";

//Add personal details of a volunteer route
router.post('/add-volunteer', async (req, res) => {
    //validations
    if (!req.body || !req.body.jamatkhana_id || !req.body.first_name || !req.body.last_name || !req.body.dob) {
        res.status(400).send({ "message": "Missing values in the request body. Required fields: jamatkhana_id, first_name, last_name, dob" });
        return;
    }
    if (req.body.marital_status) {
        if (!enums.marital_status_enum.includes(req.body.marital_status)) {
            res.status(400).send({ "message": `Invalid value of marital_status. Please select a value from ${enums.marital_status_enum}` });
            return;
        }
    }
    if (req.body.gender) {
        if (!enums.gender_enum.includes(req.body.gender)) {
            res.status(400).send({ "message": `Invalid value of gender. Please select a value from ${enums.gender_enum}` });
            return;
        }
    }
    if (req.body.blood_group) {
        if (!enums.blood_group_enum.includes(req.body.blood_group)) {
            res.status(400).send({ "message": `Invalid value of blood_group. Please select a value from ${enums.blood_group_enum}` });
            return;
        }
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
            gender: req.body.gender || "null",
            blood_group: req.body.blood_group || "null",
            dob: req.body.dob || null,
            active: req.body.active || null,
            created_by: decodedToken.userid,
            created_at: new Date().toISOString()
        }

        for (const column in idsInBody) {
            if (idsInBody[column]) {
                const tableName = column.slice(0, -3);
                const found = await volunteer.checkIfRecordExists(tableName, idsInBody[column]);
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
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            res.status(401).send(err);
            return;
        }
        if (err.name === "TokenExpiredError") {
            res.status(401).send(err);
            return;
        }
        console.log("error:", err)
        res.status(500).send(err);
    }
});

router.post('/:volunteer_id/contact-details', async (req, res) => {
    //validations
    if (!req.params) {
        res.status(400).send({ "message": `Please use a query param value /:volunteer_id/contact-details` });
        return;
    }

    if (!req.body || !req.body.mobile_number || !req.body.whatsapp_number || !req.body.email_id || !req.body.city_village || !req.body.pincode || !req.body.emergency_contact_number || !req.body.emergency_contact_name) {
        res.status(400).send({ "message": "Missing values in the request body. Required fields: mobile_number, whatsapp_number, email_id, city_village, pincode, emergency_contact_number, emergency_contact_name" });
        return;
    }
    if (req.body.emergency_contact_relation) {
        if (!enums.relation_enum.includes(req.body.emergency_contact_relation)) {
            res.status(400).send({ "message": `Invalid value of emergency_contact_relation. Please select a value from ${enums.relation_enum}` });
            return;
        }
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

        const recordExists = await volunteer.checkIfDetailsExists(req.params.volunteer_id, volunteerContactDetailsTable);
        if (recordExists) {
            res.status(409).send({ "message": `Contact details already exists for volunteer id ${req.params.volunteer_id}` });
            return;
        }

        const dbData = {
            mobile_number: req.body.mobile_number,
            alternate_number: req.body.alternate_number || null,
            whatsapp_number: req.body.whatsapp_number,
            email_id: req.body.email_id,
            address: req.body.address || null,
            state: req.body.state || null,
            city_village: req.body.city_village,
            pincode: req.body.pincode,
            emergency_contact_number: req.body.emergency_contact_number,
            emergency_contact_name: req.body.emergency_contact_name,
            emergency_contact_relation: req.body.emergency_contact_relation || "null",
            created_by: decodedToken.userid,
            created_at: new Date().toISOString()
        }

        const found = await volunteer.checkIfVolunteerExists(req.params.volunteer_id);
        if (!found) {
            res.status(404).send({ "message": `ID ${req.params.volunteer_id} not found in ${volunteerPersonalDetailsTable} table` });
            return;
        }
        dbData["volunteer_id"] = req.params.volunteer_id;

        const response = await volunteer.insertVolunteersContactDetails(dbData);
        res.status(201).send({
            "message": "Volunteer contact details added successfully",
            volunteer_id: response.volunteer_id,
            data: response
        })
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            res.status(401).send(err);
            return;
        }
        if (err.name === "TokenExpiredError") {
            res.status(401).send(err);
            return;
        }
        console.log("error:", err)
        res.status(500).send(err);
    }
});

router.get('/', async (req, res) => {
    try {
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
        const regionalCouncil = await user.getRegionalCouncil(decodedToken.userid);
        console.log(regionalCouncil)

        const volunteers = await volunteer.getVolunteersByRegionalCouncil(regionalCouncil);
        res.send(volunteers);
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            res.status(401).send(err);
            return;
        }
        if (err.name === "TokenExpiredError") {
            res.status(401).send(err);
            return;
        }
        console.log("error:", err)
        res.status(500).send(err);
    }
})

module.exports = router;