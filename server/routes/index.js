const user = require('./user')
const login = require('./login')

module.exports = (router, passport) => {
    user(router);
    login(router, passport);
}