const user = require('./user')
const login = require('./login')
const config = require('./config')
const sync = require('./sync')
const activity = require('./activity')
const period = require('./period')

module.exports = (router, passport) => {
    user(router);
    login(router, passport);
    config(router);
    sync(router);
    activity(router);
    period(router);
}