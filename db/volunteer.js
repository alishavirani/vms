const client = require("../connection");

module.exports.getVolunteers = async () => {
    try {
        const query = `SELECT firstName, lastName, jamatkhana, dob, gender FROM volunteers`;
        const volunteerData = await client.query(query);
        return volunteerData.rows;
    } catch(err) {
        console.log("Cannot fetch volunteer data");
        throw err;
    } finally {

    }
}