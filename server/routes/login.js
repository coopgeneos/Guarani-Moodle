const loginController = require('./../controllers/login.ctrl')
const ensureLoggedIn = require('connect-ensure-login')

module.exports = (router, passport) => {
	/*
	Aqui se inicializa passsport y su session
	*/
	router.use(passport.initialize());
	router.use(passport.session());	
	
  /*
  curl --request POST \
    --url http://localhost:5000/login \
    --header 'content-type: application/json' \
    --data '{"username":"igomez", "password":"secret"}'
  */
  router
      .route('/login')
      .post(
      	passport.authenticate('local', {
      		successReturnToOrRedirect: '/loginSuccess', 
      		failureRedirect: '/loginFailed' 
      	}),
      )

  router
      .route('/login')
      .get(
      	loginController.loginPage
      )
 	
 	router
 		.route('/loginFailed')
 		.get(loginController.loginPageFailed)

 	/*
 	curl --request GET \
    --url http://localhost:5000/loginsuccess \
    --header 'content-type: application/json'    
  */
 	router
 		.route('/loginSuccess')
 		.get(
		require('connect-ensure-login').ensureLoggedIn(),
      	loginController.loginPageSuccess
      )
}