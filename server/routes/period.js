const periodController = require('./../controllers/period.ctrl')
const loginController = require('./../controllers/login.ctrl')

module.exports = (router) => {
  /*
  curl --request GET \
    --url http://localhost:5000/api/periods \
    --header 'content-type: application/json'
  */
  router
    .route('/periods')
    .get(loginController.ensureLoggedIn, periodController.getAll);
}