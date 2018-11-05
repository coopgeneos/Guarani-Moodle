const syncController = require('./../controllers/sync.ctrl')
const loginController = require('./../controllers/login.ctrl')

module.exports = (router) => {
  /*
  curl --request POST \
    --url http://localhost:5000/api/syncs \
    --header 'content-type: application/json' \
    --data '{"siu_actividad_codigo":"act cod", "siu_periodo_lectivo":"per lec", "mdl_category_id":"5", "sync_type":"2", "status":"PE", "Details":"[{\"siu_comision\":\"hgfh\", \"mdl_course_id\":\"2\", \"mdl_group_id\":\"2\", \"groupNo\":\"2\"},{\"siu_comision\":\"hgertfh\", \"mdl_course_id\":\"27\", \"mdl_group_id\":\"28\", \"groupNo\":\"1\"}]"}'
  */
  router
    .route('/syncs')
    .post(/*loginController.ensureLoggedIn, */syncController.addSync)

  /*
  curl --request PUT \
    --url http://localhost:5000/syncs/1 \
    --header 'content-type: application/json' \
    --data '{"siu_actividad_codigo":"act cod", "siu_periodo_lectivo":"per lec", "mdl_category_id":"5", "sync_type":"2", "status":"PE", "Details":"[{\"siu_comision\":\"hgfh\", \"mdl_course_id\":\"2\", \"mdl_group_id\":\"2\", \"groupNo\":\"2\"},{\"siu_comision\":\"hgertfh\", \"mdl_course_id\":\"27\", \"mdl_group_id\":\"28\", \"groupNo\":\"1\"}]"}'
  */
  router
    .route('/syncs/:id')
    .put(loginController.ensureLoggedIn, syncController.updateSync)
  
  /*
  curl --request GET \
    --url http://localhost:5000/syncs?siu_actividad_codigo=act%20cod
  */
  router
    .route('/syncs')
    .get(loginController.ensureLoggedIn, syncController.getByParameters)

  /*
  curl --request GET \
    --url http://localhost:5000/1
  */
  router
    .route('/syncs/:id')
    .get(loginController.ensureLoggedIn, syncController.getById)
}