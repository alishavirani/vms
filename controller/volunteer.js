const express = require('express');

const router = express.Router();

const volunteer = require("../db/volunteer");

router.get('/',async (req, res) => {
    console.log("Heellooooo")
    const volunteerData = await volunteer.getVolunteers();
    res.send(volunteerData)
});

module.exports = router;