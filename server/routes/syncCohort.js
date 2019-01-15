const syncCohortController = require('../controllers/syncCohort.ctrl')
const loginController = require('../controllers/login.ctrl')

module.exports = (router) => {
  /*
  curl --request POST --url http://localhost:5000/api/syncCohorts --header 'content-type: application/json' \
  --data '{"I_SyncCohort_id":"1", name":"Categoria 1", "mdl_category_id":"456"}'
  */
  router
    .route('/syncCohorts')
    .post(/*loginController.ensureLoggedIn, */syncCohortController.create)

  /*
  curl --request GET --url http://localhost:5000/api/syncCohorts --header 'content-type: application/json'
  */
  router
    .route('/syncCohorts')
    .get(/*loginController.ensureLoggedIn, */syncCohortController.findAll)

  /*
  curl --request PUT --url http://localhost:5000/api/syncCohorts/1 --header 'content-type: application/json' \
  --data '{"name":"Cohorte 1 modificado"}'
  */
  router
    .route('/syncCohorts/:id')
    .put(/*loginController.ensureLoggedIn, */syncCohortController.update)

  /*
  curl --request GET --url http://localhost:5000/api/syncCohorts/1 --header 'content-type: application/json'
  */
  router
    .route('/syncCohorts/:id')
    .get(/*loginController.ensureLoggedIn, */syncCohortController.findById)
}