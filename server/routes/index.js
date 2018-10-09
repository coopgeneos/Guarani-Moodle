const user = require('./user')
const login = require('./login')
const config = require('./config')
const sync = require('./sync')
const activity = require('./activity')

module.exports = (router, passport) => {
    user(router);
    login(router, passport);
    config(router);
    sync(router);
    activity(router);
}