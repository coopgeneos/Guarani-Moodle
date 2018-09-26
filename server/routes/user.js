const userController = require('./../controllers/user.ctrl')
const loginController = require('./../controllers/login.ctrl')

module.exports = (router) => {
  /*
  curl --request POST \
    --url http://localhost:5000/users \
    --header 'content-type: application/json' \
    --data '{"name":"Juan", "surname":"Perez", "username":"jperez", "password":"secret", "state":"0"}'
  */
  router
    .route('/users')
    .post(loginController.ensureLoggedIn, userController.addUser)

  /*
  curl --request PUT \
    --url http://localhost:5000/users/1 \
    --header 'content-type: application/json' \
    --data '{"i_user_id":"1", "name":"Admin", "surname":"Admin", "username":"Admin", "password":"n0t4dm1n", "role":"1"}'
  */
  router
    .route('/users/:id')
    .put(loginController.ensureLoggedIn, userController.updateUser)

  /*
  curl --request GET \
    --url http://localhost:5000/users \
    --header 'content-type: application/json'
  */
  router
    .route('/users')
    .get(loginController.ensureLoggedIn, userController.getAll)

  /*
  curl --request GET \
    --url http://localhost:5000/users/1 \
    --header 'content-type: application/json'
  */
  router
    .route('/users/:id')
    .get(loginController.ensureLoggedIn, userController.getById)

  /*
  curl --request DELETE \
    --url http://localhost:5000/users/1 \
    --header 'content-type: application/json'
  */
  router
    .route('/users/:id')
    .delete(loginController.ensureLoggedIn, userController.deleteUser)
    
}