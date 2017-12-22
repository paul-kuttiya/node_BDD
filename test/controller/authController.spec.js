const AuthController = require('../../controllers/authController.js');
const sinon = require('sinon');
const chai = require("chai");
const expect = require('chai').expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

describe('AuthController', () => {
  beforeEach('set user role', () => {
    AuthController.setRole(['user']);
  });

  describe('isAuthorized', () => {
    it('should return false if not authorized', () => {
      expect(AuthController.isAuthorized('admin')).to.be.false;
    });

    it('should return true if authorized', () => {
      AuthController.setRole(['user', 'admin']);
      expect(AuthController.isAuthorized('admin')).to.be.true;
    });
  });

  describe('isAuthorizedAsync', () => {
    it('should return false if not authorized', async function() {
      let isAuth = await AuthController.isAuthorized('admin', (auth) => {});
      
      expect(isAuth).to.be.false;
    });
  });

  describe('getIndex', () => {
    let user = { 
      isAuthorized: () => {},
      roles: {}, 
    };

    it('should render index if authorized', () => {
      sinon.stub(user, 'roles').returns(['admin']);
      sinon.stub(user, 'isAuthorized').returns(true);

      const req = {user: user},
            res = { 
              render: () => {},
            };
            
      const mock = sinon.mock(res);

      mock.expects('render').once().withExactArgs('index');
      AuthController.getIndex(req, res);
      mock.verify();

      expect(user.isAuthorized).to.have.been.calledOnce
    });
  });
});
