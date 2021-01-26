const metaTableNames = ["jamatkhana", "jamati_title", "jamati_designation", "title", "qualification", "occupation", "jamati_organization"];
const volunteerTableNames = ["volunteer_personal_details", "volunteer_contact_details", "volunteer_language_proficiency", "volunteer_jamati_service", "volunteer_training_details"];
const usersTable = "users";
const enums = {
    "marital_status_enum": ['Single/Unmarried', 'Married', 'Divorced', 'Widowed', 'Separated', "null"],
    "gender_enum": ['Male', 'Female', "null"],
    "blood_group_enum": ['A+ve', 'A-ve', 'B+ve', 'B-ve', 'AB+ve', 'AB-ve', 'O+ve', 'O-ve', "null"],
    "relation_enum": ['Spouse','Father/Mother','Brother/Sister','Guardian', "null"],
    "designation_enum": ["Member","Co-convenor","Convenor","Faculty/Trainer","In-charge", "Hon. Secretary", "null"],
    "council_level_enum": ["Jamatkhana","Local Council","Regional Council", "National Council", "null"],
    "regional_council_enum": ["Western India", "Southern India","CNEI","NEG","NS","SS"]
};

const metaTableData = {
    "jamatkhana": ["Colaba", "Hasnabad", "Andheri", "Byculla", "Kurla", "Bellard Pier", "Aga Khan Baug", "Aga Hall"],
    "jamati_title": ["Huzur Mukhi", "Huzur Mukhiani", "Alijah", "Alijah Saheba", "Rai", "Rai Saheba"],
    "jamati_designation": ["Mukhisaheb", "Kamadiyasaheb", "CERT", "DART", "SART", "Safety and Security", "RCMP", "RCC", "LCC"],
    "title": ["Mr.", "Ms.", "Mrs.","Dr.", "CA", "CS", "Prof.", "Eng."],
    "qualification": ["Graduate", "Masters", "Diploma", "Undergraduate", "HSc", "Professional Degree", "SSc", "Below SSc","No Formal Education", "Post Graduate Diploma/Degree"],
    "occupation": ["Student", "Service", "Self-Employed", "Housewife", "Retired"]
};

const regionalCouncils = ["Western India", "Southern India", "CNEI", "NEG", "NS", "SS"];


module.exports = {metaTableNames, volunteerTableNames, usersTable, enums, metaTableData, regionalCouncils};