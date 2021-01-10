const client = require("../connection");

module.exports.getAllRecords = async(tableName) => {
    try {
        const query = `SELECT * FROM ${tableName} ;`
        const response = await client.query(query);
        if (response.rows.length) {
            return response.rows;
        }
    } catch(err) {
        throw err;
    } finally {

    }
}