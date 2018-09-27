const configController = require('./../controllers/config.ctrl')
const loginController = require('./../controllers/login.ctrl')

module.exports = (router) => {
  /*
  curl --request PUT \
    --url http://localhost:5000/api/configs \
    --header 'content-type: application/json' \
    --data '[{"key":"SIU_REST_URI", "value":"Primer actualizacion"}, {"key":"MOODLE_REST_URI", "value":"Segunda actualizacion"}]'
  */
  router
    .route('/configs')
    .put(configController.updateConfigs)

  /*
  curl --request PUT \
    --url http://localhost:5000/api/configs/SIU_REST_URI \
    --header 'content-type: application/json' \
    --data '{"key":"SIU_REST_URI", "name":"Primer actualizacion", "value":"http://guarani-test.unahur.edu.ar/guarani/3.13/rest/", "description":"URI de servicios REST de SIU"}'
  */
  router
    .route('/configs/:key')
    .put(loginController.ensureLoggedIn, configController.updateConfig)

  /*
  curl --request GET \
    --url http://localhost:5000/api/configs \
    --header 'content-type: application/json'
  */
  router
    .route('/configs')
    .get(loginController.ensureLoggedIn, configController.getAll)

  /*
  curl --request GET \
    --url http://localhost:5000/api/configs/SIU_REST_URI \
    --header 'content-type: application/json'
  */
  router
    .route('/configs/:key')
    .get(loginController.ensureLoggedIn, configController.getByKey)
}