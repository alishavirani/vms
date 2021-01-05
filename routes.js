const volunteer = require('./controller/volunteer');
const user = require('./controller/user');

module.exports.router = app => {
    app.use('/volunteer', volunteer);
    app.use('/user', user);
};