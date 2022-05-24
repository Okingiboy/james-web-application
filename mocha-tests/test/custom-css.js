WEB_SERVER_PORT = 9881;

//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');
var app = null
describe( 
  'Customize CSS Demo example page', 
  function() {
  
    before( 
        function() {
          app = require('../../examples/custom-css');
          //this.server = http.createServer(app).listen(3000);
          // initialize the browser using the same port as the test application
          this.browser = new Browser({ site: 'http://localhost:'+WEB_SERVER_PORT });
        } 
    );
    
    // load the contact page
    before(
        function( done ) {
          this.browser.visit( '/test/test/', done);
        }
    );
    
    it( 'should show the header and footer', 
      function() {
          this.browser.assert.success();
          this.browser.assert.text( 'div.header-logo-text', 'Customize CSS Demo' );
          this.browser.assert.element( 'div.copyright-div' );
        }
    );  

    it( 'should show "lorem ipsum..."', 
    function() {
        this.browser.assert.element( '#Lorem_ipsum' );
      }
    );  

    it( 'should show "lorem ipsum..." view footer', 
    function() {
        this.browser.assert.element( '#LoremFooterContent' );
      }
    );  

  }
);