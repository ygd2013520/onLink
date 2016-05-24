var common = require('../controllers/common.controller');

module.exports = function(app) {
  app.route('/')
      .get(common.renderIndex);

  app.route('/signup')
      .get(common.renderSignup)
      .post(common.signup);

  app.route('/login')
      .get(common.renderLogin)
      .post(common.login);

  app.route('/logout')
      .get(common.logout);

  app.route('/500Error')
      .get(common.render500Error);

  app.route('/404Error')
      .get(common.render404Error);

  app.route('/api/user')
      .get(common.authenticateAPI, common.getUserInfo);
};
