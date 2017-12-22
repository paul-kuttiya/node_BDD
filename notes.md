* [introduction](#introduction)  
* [type of testing](#type-of-testing)  
* [testing mocha](#testing-mocha)  
  * [first test](#first-test)  
  * [test controller](#test-controller)  
  * [test async](#test-async)  
  * [test cycle and hook](#test-cycle-and-hook)  
  * [pending-test](#pending-test)  
* [BDD style assertions](#BDD-style-assertions)  
* [mocks spys and stubs](#mocks-spys-and-stubs)  

## introduction
* test with Mocha  
* Chai for asserts  
* Sinon for mocking  
* Istanbul for code coverage  

<hr>

## type of testing
* unit test: test only the smallest part of the code, mock everything else  

* integration test: test the interaction with other code, mock outside resources(db, API)  

* functional test: test all together, start on the outside, end on the outside; black box testing  
<hr>  

## testing mocha
* have `packeage.json` file; `npm init` if the project is new  

* install mocha locally `npm install --save mocha`  

* include test script in `package.json`  
```json
"scripts": {
  "test": "mocha"
},
```

* if have nested tests inside folder in `/test/*`
```json
"scripts": {
  "test": "mocha --recursive"
},
```

### first test
* create `test` folder  

* test with `assert` library  
```js
// test/test.spec.js
// require assert library
const assert = require('assert');

// describe something for testing
describe('Basic Mocha test', () => {
  // test behavior
  it('should throw errors', () => {
    // assert equal is a method to check equality
    assert.equal(2, 2)
  });
});
``` 

### test controller
* testing controller in `controller/authController.js`  
```js
// authController.js
const AuthController = {
  isAuthorized: (roles, neededRole) => {
    return roles.indexOf(neededRole) >= 0;
  }
}

module.exports = AuthController;
```

* create test controller `test/controller/authController.spec.js`
```js
// authController.spec.js
// include assert and file that we will test
const assert = require('assert');
const AuthController = require('../../controllers/authController.js');

// describe what module to test
describe('AuthController', () => {

  // describe module method to test
  describe('isAuthorized', () => {
    // test behavior

    it('should return false if not authorized', () => {
      assert.equal(false, AuthController.isAuthorized(['user'], 'admin'))
    });

    it('should return true if authorized', () => {
      assert.equal(true, AuthController.isAuthorized(['user', 'admin'], 'admin'))
    });
  });
});
```

### test async
* aysnc function for AuthController class  
```js
// controller
const AuthController = {
  isAuthorized: (neededRole) => {
    return this.roles.indexOf(neededRole) >= 0;
  },

  isAuthorizedAsync: async (neededRole, cb) => {
    await setTimeout(() => {
      return cb(this.roles.indexOf(neededRole >= 0));
    }, 1000);
  }
}

module.exports = AuthController;
```
```js
// test controller
// ...
describe('AuthController', () => {
  // ...
  describe('isAuthorizedAsync', () => {
    // use async to wrap in promise
    it('should return false if not authorized', async function() {
      // wait for return with await
      let isAuth = await AuthController.isAuthorized(['user'], 'admin', (auth) => {});
      
      // check assert for test
      assert.equal(false, isAuth);
    });
  });
});
```

### test cycle and hook
* implement controller for more test  
```js
// controller
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
  }
}

module.exports = AuthController;
```

* use hook such as `beforeEach` to run code before test scope

> do not instantiate variable in beforeEach, do it in describe scope, then set variable value in beforeEach

> add hook description with string as argument `beforeEach('description', () => { do something })`

```js
// controller test
describe('AuthController', () => {
  beforeEach('set user role', () => {
    AuthController.setRole(['user']);
  });

  describe('isAuthorized', () => {
    it('should return false if not authorized', () => {
      assert.equal(false, AuthController.isAuthorized('admin'))
    });

    it('should return true if authorized', () => {
      user.setRole(['user', 'admin']);
      assert.equal(true, AuthController.isAuthorized('admin'))
    });
  });

  describe('isAuthorizedAsync', () => {
    it('should return false if not authorized', async function() {
      let isAuth = await AuthController.isAuthorized('admin', (auth) => {});
      
      assert.equal(false, isAuth);
    });
  });
});
```

### pending test  
* test can be pending with only describing the test  
```js
describe('something', () => {
  it('is pending');
  it('is pending');
  it('is pending');
}
```

* run only for specified test scope by adding `.only` to `describe` or `it`  
```js
describe.only('something', () => {
  it('is pending');
  it('is pending');
  it('is pending');
}
```

* skip the specified test scope by adding `.skip` to `describe` or `it`  
```js
describe.skip('something', () => {
  it('is pending');
  it('is pending');
  it('is pending');
}
```

> DO NOT COMMENT TEST EVER!, USE SKIP TO SKIP
<hr>

## BDD style assertions
* use `chai` for better assertion  

* `npm install chai --save`  

* chai assert sample
```js
const expect = require('chai').expect;

expect(something).to.be
expect(something).to.equal
expect(something).to.have
```

> check chai docs for more assertion style  
<hr>

## mocks spys and stubs
* install `sinon`, `chai`, `sinon-chai`; `npm install --save sinon chai sinon-chai`  

* `sinon.spy()` gives a FAKE function, which can use to track execution; use for mocking testing behavior for function  

* `mocks` mocks behavior of the obj; use mock then execute the code and verify  

* `stubs` replace obj and method with pre-defined return  

> mocks are predefined fake methods and expectation, mock will spy the method as well.
```js
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
  // add controller method
  getIndex: (req, res) => {
    if (req.user.isAuthorized('admin')) {
      return res.render('index');
    }
    
    res.render('error');
  }
}

module.exports = AuthController;
```

* add some sample function to authController  
```js
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

  // add function to mock and stub
  getIndex: (req, res) => {
    res.render('index');
  }
}

module.exports = AuthController;
```

* implement test using stub and mock  
```js
const AuthController = require('../../controllers/authController.js');
// these testing config can be moved to app.js
const sinon = require('sinon');
const chai = require("chai");
const expect = require('chai').expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

// if use chai.should(), need to execute and will be use in all scope

describe('AuthController', () => {
  describe('getIndex', () => {
    // sinon obj double need to predefined and have props to be able to stub
    let user = { 
      isAuthorized: () => {},
      roles: {}, 
    };

    it('should render index if authorized', () => {
      // stub properties and return value
      sinon.stub(user, 'roles').returns(['admin']);
      sinon.stub(user, 'isAuthorized').returns(true);

      // define double fore res.render and req.user
      const req = { user: user },
            res = { 
              render: () => {},
            };
            
      // define mock to return mock obj for res
      // res will have spy wrapped in
      const mock = sinon.mock(res);

      // mock behavior; spy will check on render method with expectation
      mock.expects('render').once().withExactArgs('index');
      // execute the ACTUAL code using obj double `req` that stubbed out and `res` which has spy wrapped in
      AuthController.getIndex(req, res);
      // verify mock expectation after the execution
      mock.verify();

      // sinon-chai lib to check method is being called
      expect(user.isAuthorized).to.have.been.calledOnce
    });
  });
});
```