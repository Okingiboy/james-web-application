WEB_SERVER_PORT = 9883;

//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');
var app = null
describe( 
  'Form Tutorial: Page 1 example page', 
  function() {
  
    before( 
        function() {
          app = require('../../examples/form-tutorial/form_tutorial_1');
          //this.server = http.createServer(app).listen(3000);
          // initialize the browser using the same port as the test application
          this.browser = new Browser({ site: 'http://localhost:'+WEB_SERVER_PORT+'/' });
        } 
    );
    
    // load the contact page
    before(
        function( done ) {
          this.browser.visit( '/', done);
        }
    );
    
    it( 'should show the header and footer', 
      function() {
          this.browser.assert.success();
          this.browser.assert.text( 'h1', 'Form Tutorial: Page 1' );
          this.browser.assert.element( 'div.copyright-div' );
        }
    );  
    
  }
);