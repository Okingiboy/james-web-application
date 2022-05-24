WEB_SERVER_PORT = 9897;

//use zombie.js as headless browser
const Browser = require('zombie')
const assert = require('assert')

let app = null
describe( 
  'Test: Table with "Feedback" example page', 
  function() {
  
    before( 
        function() {
          app = require('../../examples/dynamic-on-request');
          //this.server = http.createServer(app).listen(3000);
          // initialize the browser using the same port as the test application
          this.browser = new Browser({ site: 'http://localhost:'+WEB_SERVER_PORT+'/' })
        } 
    );
    
    // load the contact page
    before(
        function( done ) {
          this.browser.visit( '/index.html?layout=dynamicPage', done)
        }
    );
    
    it( 'should show the header and footer', 
      function() {
          this.browser.assert.success()
          this.browser.assert.text( 'h1', 'Test: Dynamic on-the-fly page genaration ...' )
          this.browser.assert.element( 'div.copyright-div' )
          this.browser.assert.element( '#navTabxyz' )
        }
    )

    it( 'should show the dynamic tab', 
      function() {
          this.browser.assert.element( '#navTabxyz' )
        }
    );  
    
  }
);