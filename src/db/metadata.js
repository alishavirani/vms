const metaTableNames = ["jamatkhana", "jamati_title", "jamati_designation", "title", "qualification", "occupation", "jamati_organization"];
const volunteerTableNames = ["volunteer_personal_details", "volunteer_contact_details", "volunteer_language_proficiency", "volunteer_jamati_service", "volunteer_training_details"];
const usersTable = "users";
const enums = {
    "marital_status_enum": ['Single/Unmarried', 'Married', 'Divorced', 'Widowed', 'Separated', "null"],
    "gender_enum": ['Male', 'Female', "null"],
    "blood_group_enum": ['A+ve', 'A-ve', 'B+ve', 'B-ve', 'AB+ve', 'AB-ve', 'O+ve', 'O-ve', "null"],
    "relation_enum": ['Spouse', 'Father/Mother', 'Brother/Sister', 'Guardian', "null"],
    "designation_enum": ["Member", "Co-convenor", "Convenor", "Faculty/Trainer", "In-charge", "Hon. Secretary", "null"],
    "council_level_enum": ["Jamatkhana", "Local Council", "Regional Council", "National Council", "null"],
    "regional_council_enum": ["Western India", "Southern India", "CNEI", "NEG", "NS", "SS"]
};

const metaTableData = {
    "jamatkhana": [
        {
            "jamatkhana": "Colaba",
            "regional_council": "Western India"
        },
        {
            "jamatkhana": "Hasnabad",
            "regional_council": "Western India"
        },
        {
            "jamatkhana": "Andheri",
            "regional_council": "Western India"
        },
        {
            "jamatkhana": "Byculla",
            "regional_council": "Western India"
        },
        {
            "jamatkhana": "Kurla",
            "regional_council": "Western India"
        },
        {
            "jamatkhana": "Bellard Pier",
            "regional_council": "Western India"
        },
        {
            "jamatkhana": "Aga Khan Baug",
            "regional_council": "Western India"
        },
        {
            "jamatkhana": "Aga Hall",
            "regional_council": "Western India"
        },
        {
            "jamatkhana": "Hyderabad",
            "regional_council": "Southern India"
        },
        {
            "jamatkhana": "Delhi",
            "regional_council": "CNEI"
        },
        {
            "jamatkhana": "Nothern Gujarat Jk",
            "regional_council": "NEG"
        },
        {
            "jamatkhana": "Nothern Saurashtra Jk",
            "regional_council": "NS"
        },
        {
            "jamatkhana": "Southern Saurashtra Jk",
            "regional_council": "SS"
        }
    ],
    "jamati_title": ["Huzur Mukhi", "Huzur Mukhiani", "Alijah", "Alijah Saheba", "Rai", "Rai Saheba"],
    "jamati_designation": ["Mukhisaheb", "Kamadiyasaheb", "CERT", "DART", "SART", "Safety and Security", "RCMP", "RCC", "LCC"],
    "title": ["Mr.", "Ms.", "Mrs.", "Dr.", "CA", "CS", "Prof.", "Eng."],
    "qualification": ["Graduate", "Masters", "Diploma", "Undergraduate", "HSc", "Professional Degree", "SSc", "Below SSc", "No Formal Education", "Post Graduate Diploma/Degree"],
    "occupation": ["Student", "Service", "Self-Employed", "Housewife", "Retired"]
};

const volunteerPersonalData = [{
    jamatkhana_id: 1,
    first_name: "Danish",
    last_name: "Mithani",
    dob: new Date().toISOString(),
    gender: "Male"
}, {
    jamatkhana_id: 2,
    first_name: "Imran",
    last_name: "Lakhani",
    dob: new Date().toISOString(),
    gender: "Male"
}, {
    jamatkhana_id: 3,
    first_name: "Sameer",
    last_name: "Pradhan",
    dob: new Date().toISOString(),
    gender: "Male"
},
{
    jamatkhana_id: 11,
    first_name: "Jk",
    last_name: "member",
    dob: new Date().toISOString(),
    gender: "Male"
}];

const volunteerContactDetails = [{
    volunteer_id: 1,
    mobile_number: '9999999999',
    whatsapp_number: '99999999999',
    email_id: "aaa@gmail.com",
    city_village: "Mumbai",
    pincode: "410292",
    emergency_contact_number: '9999999999',
    emergency_contact_name: "aaaa"
}, {
    volunteer_id: 2,
    mobile_number: '9999999999',
    whatsapp_number: '99999999999',
    email_id: "aaa@gmail.com",
    city_village: "Mumbai",
    pincode: "410292",
    emergency_contact_number: '9999999999',
    emergency_contact_name: "aaaa"
}, {
    volunteer_id: 3,
    mobile_number: '9999999999',
    whatsapp_number: '99999999999',
    email_id: "aaa@gmail.com",
    city_village: "Mumbai",
    pincode: "410292",
    emergency_contact_number: '9999999999',
    emergency_contact_name: "aaaa"
}]

const regionalCouncils = ["Western India", "Southern India", "CNEI", "NEG", "NS", "SS"];


module.exports = { metaTableNames, volunteerTableNames, usersTable, enums, metaTableData, regionalCouncils, volunteerPersonalData, volunteerContactDetails };