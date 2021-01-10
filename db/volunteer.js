const client = require("../connection");

module.exports.checkIfRecordExists = async (tableName, id) => {
    try {
        const query = `SELECT * FROM ${tableName} where ${tableName}_id = '${id}';`;
        const record = await client.query(query);
        const found = record.rowCount ? true : false;
        return found;
    } catch(err) {
        console.log("Cannot fetch meta data", err);
        throw err;
    } finally {

    }
}

module.exports.insertVolunteersPersonalDetails = async(data) => {
    try {
        const query = `INSERT INTO volunteer_personal_details (jamatkhana_id, jamati_title_id, tkn_number, jamati_designation_id, title_id, first_name, middle_name, last_name, marital_status, gender, blood_group, dob, active, qualification_id, occupation_id, created_at, created_by)
        VALUES('${data.jamatkhana_id}','${data.jamati_title_id}','${data.tkn_number}','${data.jamati_designation_id}','${data.title_id}','${data.first_name}','${data.middle_name}','${data.last_name}','${data.marital_status}','${data.gender}','${data.blood_group}','${data.dob}',${data.active},${data.qualification_id},'${data.occupation_id}','${data.created_at}','${data.created_by}')
        RETURNING *`;
        const response = await client.query(query);
        if (response.rows.length) {
            return response.rows[0];
        }
    } catch (err) {
        console.log("Cannot insert into volunteers_personal_details table", err);
        throw err;
    } finally {

    }
}