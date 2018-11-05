const user = require('./user')
const login = require('./login')
const config = require('./config')
const sync = require('./sync')
const activity = require('./activity')
const period = require('./period')
const syncCategory = require('./syncCategory')
const syncUp = require('./syncUp')

module.exports = (router, passport) => {
    user(router);
    login(router, passport);
    config(router);
    sync(router);
    activity(router);
    period(router);
    syncCategory(router);
    syncUp(router);
}