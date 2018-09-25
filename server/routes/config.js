const configController = require('./../controllers/config.ctrl')
const ensureLoggedIn = require('connect-ensure-login')

module.exports = (router) => {
  /*
  curl --request PUT \
    --url http://localhost:5000/configs/SIU_REST_URI \
    --header 'content-type: application/json' \
    --data '{"key":"SIU_REST_URI", "name":"Primer actualizacion", "value":"http://guarani-test.unahur.edu.ar/guarani/3.13/rest/", "description":"URI de servicios REST de SIU"}'
  */
  router
    .route('/configs/:key')
    .put(ensureLoggedIn.ensureLoggedIn(), configController.updateConfig)

  /*
  curl --request GET \
    --url http://localhost:5000/configs \
    --header 'content-type: application/json'
  */
  router
    .route('/configs')
    .get(configController.getAll)

  /*
  curl --request GET \
    --url http://localhost:5000/configs/SIU_REST_URI \
    --header 'content-type: application/json'
  */
  router
    .route('/configs/:key')
    .get(configController.getByKey)
}