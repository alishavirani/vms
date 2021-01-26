const metaData = require("./metadata");
const pool = require("../connection");


module.exports.dbInit = async () => {
    try {
        const psClient = await pool.connect();
        await deleteTablesAndTypes(psClient); //only for development
        // create necessary enums
        await createEnums(psClient);

        //create users table
        const tableExists = await checkIfTableExists(psClient, metaData.usersTable);
        if (!tableExists) {
            const createTableQuery = `CREATE TABLE ${metaData.usersTable} (
                userid VARCHAR(50) PRIMARY KEY NOT NULL,
                password varchar NOT NULL,
                regional_council regional_council_enum NOT NULL,
                created_by VARCHAR(50),
                created_at DATE
            );`;
            await psClient.query(createTableQuery);
            console.log(`${metaData.usersTable} created`);
        }

        //create meta tables
        for (const table of metaData.metaTableNames) {
            const tableExists = await checkIfTableExists(psClient, table);
            if (tableExists) {
                continue;
            }
            //If table not found, create
            let createTableQuery = "";
            switch (table) {
                case "jamatkhana":
                    createTableQuery = `CREATE TABLE jamatkhana (
                            jamatkhana_id SERIAL PRIMARY KEY,
                            jamatkhana VARCHAR NOT NULL
                        );`;
                    break;
                case "jamati_title":
                    createTableQuery = `CREATE TABLE jamati_title (
                            jamati_title_id SERIAL PRIMARY KEY,
                            jamati_title VARCHAR(100) NOT NULL
                        );`;
                    break;
                case "jamati_designation":
                    createTableQuery = `CREATE TABLE jamati_designation (
                            jamati_designation_id SERIAL PRIMARY KEY,
                            jamati_designation VARCHAR(100) NOT NULL
                        );`;
                    break;
                case "title":
                    createTableQuery = `CREATE TABLE title (
                            title_id SERIAL PRIMARY KEY,
                            title VARCHAR(50) NOT NULL
                        );`;
                    break;
                case "qualification":
                    createTableQuery = `CREATE TABLE qualification (
                            qualification_id SERIAL PRIMARY KEY,
                            qualification VARCHAR(100) NOT NULL
                        );`;
                    break;
                case "occupation":
                    createTableQuery = `CREATE TABLE occupation (
                            occupation_id SERIAL PRIMARY KEY,
                            occupation VARCHAR(150) NOT NULL
                        );`;
                    break;
                case "jamati_organization":
                    createTableQuery = `CREATE TABLE jamati_organization (
                            jamati_organization_id SERIAL PRIMARY KEY,
                            jamati_organization VARCHAR(200) NOT NULL
                        );`;
                    break;
            }
            await psClient.query(createTableQuery);
            console.log(`${table} created`)
        }

        //volunteer tables
        for (const table of metaData.volunteerTableNames) {
            const tableExists = await checkIfTableExists(psClient, table);
            if (tableExists) {
                continue;
            }
            let createTableQuery = "";
            switch (table) {
                case "volunteer_personal_details":
                    createTableQuery = `CREATE TABLE volunteer_personal_details (
                        volunteer_id SERIAL PRIMARY KEY,
                        jamatkhana_id INT NOT NULL,
                        jamati_title_id INT,
                        tkn_number VARCHAR(20),
                        jamati_designation_id INT,
                        title_id INT,
                        first_name VARCHAR(50) NOT NULL,
                        middle_name VARCHAR(50),
                        last_name VARCHAR(50) NOT NULL,
                        marital_status marital_status_enum,
                        gender gender_enum,
                        blood_group blood_group_enum,
                        dob DATE,
                        active BOOLEAN,
                        qualification_id INT,
                        occupation_id INT,
                        created_by VARCHAR(20),
                        created_at DATE,

                        CONSTRAINT fk_jamatkhana_id
                            FOREIGN KEY(jamatkhana_id) 
                                REFERENCES jamatkhana(jamatkhana_id),
                        CONSTRAINT fk_jamati_title_id
                            FOREIGN KEY(jamati_title_id) 
                                REFERENCES jamati_title(jamati_title_id),
                        CONSTRAINT fk_jamati_designation_id
                            FOREIGN KEY(jamati_designation_id)
                                REFERENCES jamati_designation(jamati_designation_id),
                        CONSTRAINT fk_title_id
                            FOREIGN KEY(title_id)
                                REFERENCES title(title_id),
                        CONSTRAINT fk_qualification_id
                            FOREIGN KEY(qualification_id)
                                REFERENCES qualification(qualification_id),
                        CONSTRAINT fk_occupation_id
                            FOREIGN KEY(occupation_id)
                                REFERENCES occupation(occupation_id)
                    );`;
                    break;
                case "volunteer_contact_details":
                    createTableQuery = `CREATE TABLE volunteer_contact_details (
                        volunteer_contact_id SERIAL PRIMARY KEY,
                        volunteer_id INT NOT NULL,
                        mobile_number VARCHAR(20) NOT NULL,
                        alternate_number VARCHAR(20),
                        whatsapp_number VARCHAR(20) NOT NULL,
                        email_id VARCHAR(50) NOT NULL,
                        address VARCHAR,
                        state VARCHAR(50),
                        city_village VARCHAR(50) NOT NULL,
                        pincode VARCHAR(10) NOT NULL,
                        emergency_contact_number VARCHAR(20) NOT NULL,
                        emergency_contact_name VARCHAR(100) NOT NULL,
                        emergency_contact_relation relation_enum,
                        created_by VARCHAR(20),
                        created_at DATE,

                        CONSTRAINT fk_volunteer_id
                            FOREIGN KEY(volunteer_id)
                                REFERENCES volunteer_personal_details(volunteer_id)
                    );`;
                    break;
                case "volunteer_language_proficiency":
                    createTableQuery = `CREATE TABLE volunteer_language_proficiency (
                        volunteer_language_id SERIAL PRIMARY KEY,
                        volunteer_id INT NOT NULL,
                        languages JSON NOT NULL,

                        CONSTRAINT fk_volunteer_id
                            FOREIGN KEY(volunteer_id)
                                REFERENCES volunteer_personal_details(volunteer_id)
                    );`;
                    break;
                case "volunteer_jamati_service":
                    createTableQuery = `CREATE TABLE volunteer_jamati_service (
                        volunteer_service_id SERIAL PRIMARY KEY,
                        volunteer_id INT NOT NULL,
                        jamati_organization_id INT,
                        designation designation_enum,
                        council_level council_level_enum,
                        start_date DATE,
                        end_date DATE,

                        CONSTRAINT fk_volunteer_id
                            FOREIGN KEY(volunteer_id)
                                REFERENCES volunteer_personal_details(volunteer_id),
                        CONSTRAINT fk_jamati_organization_id
                            FOREIGN KEY(jamati_organization_id)
                                REFERENCES jamati_organization(jamati_organization_id)
                    );`;
                    break;
                case "volunteer_training_details":
                    createTableQuery = `CREATE TABLE volunteer_training_details (
                        volunteer_training_id SERIAL PRIMARY KEY,
                        volunteer_id INT NOT NULL,
                        jamati_organization_id INT,
                        training_program_name VARCHAR(100),
                        certificate_issued BOOLEAN,
                        start_date DATE,
                        end_date DATE,

                        CONSTRAINT fk_volunteer_id
                            FOREIGN KEY(volunteer_id)
                                REFERENCES volunteer_personal_details(volunteer_id)
                    );`;
                
            }
            await psClient.query(createTableQuery);
            console.log(`${table} created`)
        }
        await insertDataIntoMetaTables(psClient);
    } catch (err) {
        throw err;
    } finally {
        // psClient.end();
    }
}

const createEnums = async (psClient) => {
    for (const en in metaData.enums) {
        const values = Object.values(metaData.enums[en]).map(val => `'${val}'`);
        const createEnumQuery = `CREATE TYPE ${en} as ENUM(${values})`;
        await psClient.query(createEnumQuery);
    }
}

const checkIfTableExists = async (psClient, tableName) => {
    const ifExistsQuery = `SELECT to_regclass('${tableName}');`
    const resp = await psClient.query(ifExistsQuery);
    return resp.rows[0].to_regclass;
}

const insertDataIntoMetaTables = async (psClient) => {
    for (const tableName in metaData.metaTableData) {
        let values = ``;
        for (const value of metaData.metaTableData[tableName]) {
            values += `('${value}'),`
        }
        values = values.slice(0, -1);
        const query = `INSERT INTO ${tableName} (${tableName})
        VALUES ${values};`;
        await psClient.query(query);
    }
}

const deleteTablesAndTypes = async (psClient) => {
    for (const tableName of metaData.volunteerTableNames) {
        const query = `DROP TABLE IF EXISTS ${tableName} CASCADE`;
        await psClient.query(query);
    }
    for (const tableName of metaData.metaTableNames) {
        const query = `DROP TABLE IF EXISTS ${tableName} CASCADE`;
        await psClient.query(query);
    }
    await psClient.query(`DROP TABLE IF EXISTS ${metaData.usersTable}`);

    for (const typeName in metaData.enums) {
        const query = `DROP TYPE IF EXISTS ${typeName}`;
        await psClient.query(query);
    }
    console.log("Tables and types deleted")
}
