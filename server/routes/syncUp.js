const syncUpController = require('./../controllers/syncUp.ctrl')
const loginController = require('./../controllers/login.ctrl')
const syncDetailController = require('./../controllers/syncDetail.ctrl')

module.exports = (router) => {
  /*
  curl --request POST \
    --url http://localhost:5000/api/syncUp/7 \
    --header 'content-type: application/json'
  */
  router
    .route('/syncUp/:id')
    .post(loginController.ensureLoggedIn, syncUpController.syncUp)

  /*
  curl --request GET \
    --url http://localhost:5000/api/syncUp/7 \
    --header 'content-type: application/json'
  */
  router
    .route('/syncUp/:id')
    .get(loginController.ensureLoggedIn, syncUpController.getAllForSync)

  /*
  curl --request GET \
    --url http://localhost:5000/api/syncDetailSIU/7 \
    --header 'content-type: application/json'
  */
  router
    .route('/syncDetailSIU/:id')
    .get(loginController.ensureLoggedIn, syncDetailController.getSIUData)
}