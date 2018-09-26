const loginController = require('./../controllers/login.ctrl')

module.exports = (router, passport) => {
	/*
	Aqui se inicializa passsport y su session
	*/
	router.use(passport.initialize());
	router.use(passport.session());	
	
  router
    .route('/login')
    .post(
    	passport.authenticate('local', { failureRedirect: '/loginFailed'}), 
      /* En caso de login exitoso */
      (req, res) => {      
        let user = req.user.dataValues;
        delete user.password;
        delete user.createdAt;
        delete user.updatedAt;
        delete user.deletedAt;
        res.json({ success: 'true', data: user});
        res.send();     
      }
    )

  router
    .route('/login')
    .get(loginController.loginPage)
 	
 	router
 		.route('/loginFailed')
 		.get(loginController.loginFailed)

  router
    .route('/logout')
    .get(loginController.ensureLoggedIn, loginController.logout);
}