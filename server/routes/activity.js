const activityController = require('./../controllers/activity.ctrl')
const loginController = require('./../controllers/login.ctrl')

module.exports = (router) => {
  /*
  curl --request GET \
    --url http://localhost:5000/api/activities \
    --header 'content-type: application/json'
  */
  router
    .route('/activities')
    .get(loginController.ensureLoggedIn, activityController.getAll);

  /*
  curl --request GET \
    --url http://localhost:5000/api/activities/period/14 \
    --header 'content-type: application/json'
  */

  router
    .route('/activities/period/:period')
    .get(loginController.ensureLoggedIn, activityController.getAllForPeriod)

  /*
  curl --request PUT \
    --url http://localhost:5000/api/activities \
    --header 'content-type: application/json'
  */
  router
    .route('/activities')
    .put(activityController.update);
}