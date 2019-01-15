const syncUpController = require('./../controllers/syncUp.ctrl')
const loginController = require('./../controllers/login.ctrl')

module.exports = (router) => {
  /*
  curl --request POST \
    --url http://localhost:5000/api/syncUp/7 \
    --header 'content-type: application/json'
  */
  router
    .route('/syncUp/:id')
    .post(/*loginController.ensureLoggedIn,*/ syncUpController.syncUp)
}