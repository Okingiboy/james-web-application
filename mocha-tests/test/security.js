WEB_SERVER_PORT = 9893;

//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');
var app = null
describe( 
  'Security example page', 
  function() {
    var browser = null
    before( 
        function() {
          app = require('../../examples/security');
          //this.server = http.createServer(app).listen(3000);
          // initialize the browser using the same port as the test application
          browser = new Browser({ site: 'http://localhost:'+WEB_SERVER_PORT+'/' });
        } 
    );
    
    // load the contact page
    before(
        function( done ) {
          browser.visit( '/securitydemo/', done);
        }
    );
    
    it( 'should show the header and footer', 
      function() {
          browser.assert.success();
          browser.assert.text( 'h1', 'Security Demo' );
          browser.assert.element( 'div.copyright-div' );
        }
    );  

    it( 'should not show the private tab', 
      function() {
          //browser.assert.element( '#navTabsecretPage' );
        }
    );  

    describe( 'authorized flow', function() {

      it( 'must login click the Login Button', () => {
        browser.clickLink( '.PongLogin' )
      })

      it( 'must show the login form', () => {
        browser.assert.element( '#useridInput' );
        browser.assert.element( '#passwordInput' );
      })

      it( 'must login click the Login Button', (done) => {
          browser.fill( '#useridInput', 'test1')
          browser.pressButton( 'Login', done )
      })

      it( 'must show the private page after login', 
        function() {
            browser.assert.element( '#navTabsecretPage' );
          }
      )  

    })
    
  }
);