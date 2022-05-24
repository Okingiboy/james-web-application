WEB_SERVER_PORT = 9881;

//use zombie.js as headless browser
var Browser = require('zombie')
var assert = require('assert')

var app = null
describe( 
  'Config Demo example page', 
  function() {
  
    before( 
        function() {
          app = require('../../examples/config');
          //this.server = http.createServer(app).listen(3000);
          // initialize the browser using the same port as the test application
          this.browser = new Browser({ site: 'http://localhost:'+WEB_SERVER_PORT })
        } 
    )
    
    // load the contact page
    before(
        function( done ) {
          this.browser.visit( '/example/', done )
        }
    )
    
    it( 'should show the header from config', 
      function() {
          this.browser.assert.success()
          this.browser.assert.text( 'div.header-logo-text', 'Config-Example' )
        }
    )
    it( 'should show the footer from config', 
      function() {
          this.browser.assert.success()
          this.browser.assert.element( 'div.copyright-div' )
          this.browser.assert.text( 'div.copyright-div', 'by MH (c) 2018' )
        }
    )
    
  }
)