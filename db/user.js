const client = require("../connection");

module.exports.addUser = async (data) => {
    try {
        const query = `INSERT INTO users (userid, password, regional_council, created_by, created_at)
        VALUES('${data.userid}','${data.password}','${data.regional_council}','${data.created_by}','${data.created_at}')`;

        const response = await client.query(query);
        return response;
    } catch(err) {
        throw err;
    } finally {

    }
}

module.exports.getHashPw = async(userid) => {
    try {
        const query = `SELECT password FROM users WHERE userid='${userid}';`
        const response = await client.query(query);
        if (response.rows.length) {
            return response.rows[0].password;
        }
    } catch(err) {
        throw err;
    } finally {

    }
}