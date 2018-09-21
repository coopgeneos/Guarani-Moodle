const userController = require('./../controllers/user.ctrl')
const ensureLoggedIn = require('connect-ensure-login')

module.exports = (router) => {
    /*
    curl --request POST \
      --url http://localhost:5000/user/add \
      --header 'content-type: application/json' \
      --data '{"name":"Ibrian", "surname":"Gomez", "username":"igomez", "password":"secret", "state":"0"}'
    */
    router
        .route('/user/add')
        .post(userController.addUser)

    /*
    curl --request GET \
      --url http://localhost:5000/user/all \
      --header 'content-type: application/json'
    */
    router
        .route('/user/all')
        .get(ensureLoggedIn.ensureLoggedIn(), userController.getAll)

    /*
    curl --request GET \
      --url http://localhost:5000/user/1 \
      --header 'content-type: application/json'
    */
    router
        .route('/user/:id')
        .get(ensureLoggedIn.ensureLoggedIn(), userController.getById)
    
    
}