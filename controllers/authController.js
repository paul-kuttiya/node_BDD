const AuthController = {
  setRole: (role) => {
    this.roles = role
  },

  isAuthorized: (neededRole) => {
    return this.roles.indexOf(neededRole) >= 0;
  },

  isAuthorizedAsync: async (neededRole, cb) => {
    await setTimeout(() => {
      return cb(this.roles.indexOf(neededRole >= 0));
    }, 1000);
  },

  getIndex: (req, res) => {
    try {
      if (req.user.isAuthorized('admin')) {
        return res.render('index');
      }

      res.render('notAuth');
    } catch(e) {
      res.render('error');
    }
  }
}

module.exports = AuthController;