const syncCategController = require('./../controllers/syncCategory.ctrl')
const loginController = require('./../controllers/login.ctrl')

module.exports = (router) => {
  /*
  curl --request POST --url http://localhost:5000/api/syncCategories --header 'content-type: application/json' \
  --data '{"I_SyncCategory_id":"1", name":"Categoria 1", "mdl_category_id":"456"}'
  */
  router
    .route('/syncCategories')
    .post(loginController.ensureLoggedIn, syncCategController.create)

  /*
  curl --request GET --url http://localhost:5000/api/syncCategories --header 'content-type: application/json'
  */
  router
    .route('/syncCategories')
    .get(loginController.ensureLoggedIn, syncCategController.findAll)

  /*
  curl --request PUT --url http://localhost:5000/api/syncCategories/1 --header 'content-type: application/json' \
  --data '{"name":"Categoria 1 modificada"}'
  */
  router
    .route('/syncCategories/:id')
    .put(loginController.ensureLoggedIn, syncCategController.update)

  /*
  curl --request GET --url http://localhost:5000/api/syncCategories/1 --header 'content-type: application/json'
  */
  router
    .route('/syncCategories/:id')
    .get(loginController.ensureLoggedIn, syncCategController.findById)
}