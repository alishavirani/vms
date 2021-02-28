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

module.exports.checkIfVolunteerExists = async (id) => {
    try {
        const query = `SELECT * FROM volunteer_personal_details where volunteer_id = '${id}';`;
        const record = await client.query(query);
        const found = record.rowCount ? true : false;
        return found;
    } catch(err) {
        console.log(`No volunteer with id ${id} exists`, err);
        throw err;
    } finally {

    }
}

module.exports.checkIfDetailsExists = async (id, tableName) => {
    try {
        const query = `SELECT * FROM ${tableName} where volunteer_id = '${id}';`;
        const record = await client.query(query);
        const found = record.rowCount ? true : false;
        return found;
    } catch(err) {
        console.log(`No volunteer with id ${id} exists`, err);
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

module.exports.insertVolunteersContactDetails = async(data) => {
    try {
        const query = `INSERT INTO volunteer_contact_details (volunteer_id, mobile_number, alternate_number, whatsapp_number, email_id, address, state, city_village, pincode, emergency_contact_number, emergency_contact_name, emergency_contact_relation, created_at, created_by)
        VALUES('${data.volunteer_id}','${data.mobile_number}','${data.alternate_number}','${data.whatsapp_number}','${data.email_id}','${data.address}','${data.state}','${data.city_village}','${data.pincode}','${data.emergency_contact_number}','${data.emergency_contact_name}','${data.emergency_contact_relation}','${data.created_at}','${data.created_by}')
        RETURNING *`;
        
        const response = await client.query(query);
        if (response.rows.length) {
            return response.rows[0];
        }
    } catch (err) {
        console.log("Cannot insert into volunteer_contact_details table", err);
        throw err;
    } finally {

    }
}

module.exports.getVolunteersByRegionalCouncil = async (regionalCouncil) => {
    try {
        //get distinct jamatkhanas for a regional council
        let query = `SELECT DISTINCT jamatkhana_id FROM jamatkhana WHERE regional_council='${regionalCouncil}'`;
        let response = await client.query(query);
        const jkIds = response.rows.map(row => row.jamatkhana_id);

        //get volunteers for these jks
        query = `SELECT volunteer_id, first_name, last_name, dob, gender, jamatkhana_id FROM volunteer_personal_details WHERE jamatkhana_id IN (${jkIds.map(id => `'${id}'`)})`
        response = await client.query(query);
        let volunteers = response.rows;
        
        const volunteersData = await Promise.all(volunteers.map(async volunteer => {
            let query = `SELECT mobile_number, email_id FROM volunteer_contact_details WHERE volunteer_id='${volunteer.volunteer_id}'`;
            let response = await client.query(query);
            const contactDetails = response.rows[0];

            //get jamatkhana by id
            query = `SELECT jamatkhana FROM jamatkhana WHERE jamatkhana_id='${volunteer.jamatkhana_id}'`
            response = await client.query(query);
            const jamatkhana = response.rows[0].jamatkhana;

            return {
                id: volunteer.volunteer_id,
                name: `${volunteer.first_name} ${volunteer.last_name}`,
                jamatkhana,
                dob: volunteer.dob,
                gender: volunteer.gender,
                mobileNumber: contactDetails ? contactDetails.mobile_number : null,
                emailId: contactDetails ? contactDetails.emailId : null
            }
        }));
        return volunteersData;
    } catch (err) {
        throw err;
    } finally {

    }
}