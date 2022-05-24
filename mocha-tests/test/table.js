WEB_SERVER_PORT = 9895;

//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');
var app = null
describe( 
  'Table example page', 
  function() {
  
    before( 
        function() {
          app = require('../../examples/table-demo');
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
          this.browser.assert.element( 'div#header' );
          this.browser.assert.element( 'div.copyright-div' );
        }
    );  
    
    it( 'should show table', 
      function() {
          this.browser.assert.success();
          this.browser.assert.element( 'div#tableView' );
          this.browser.assert.element( 'div.decor-menu' );
          this.browser.assert.text( 'div#tableViewTitle', 'Table Demo (sorry, zoom is always a flower ;-)' );
    }
    );  
    
    it( 'should show table content', 
      function() {
          this.browser.assert.text( '#tableViewContentR0ID', 'yyy1' );
          this.browser.assert.text( '#tableViewContentR1ID', 'yyy3' );
          this.browser.assert.element( '#tableViewContentR0Picture' );
        }
    );  
    
  }
);