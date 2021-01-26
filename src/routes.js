const volunteer = require('./controller/volunteer');
const user = require('./controller/user');
const meta = require('./controller/meta');

module.exports.router = app => {
    app.use('/volunteer', volunteer);
    app.use('/user', user);
    app.use('/meta', meta);
};