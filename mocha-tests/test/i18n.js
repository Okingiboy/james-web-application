WEB_SERVER_PORT = 9886;

//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');

describe( 
  'I18N example page', 
  function() {
  
    before( 
        function() {
          require('../../examples/i18n');
          //this.server = http.createServer(app).listen(3000);
          // initialize the browser using the same port as the test application
          this.browser = new Browser({ site: 'http://localhost:'+WEB_SERVER_PORT+'/' });
        } 
    );
  
    // load the contact page
    before(
        function( done ) {
          this.browser.visit( 'http://localhost:'+WEB_SERVER_PORT+'/index.html?lang=DE', done);
        }
    );
  
    it( 'check the header and footer', 
        function() {
            this.browser.assert.success();
            this.browser.assert.element( 'div.copyright-div' );
            this.browser.assert.element( 'div.header-logo' );
        }
    );  

    it( 'language switch links must be present', 
        function() {
            this.browser.assert.success();
            this.browser.assert.element( 'a[href$="DE"]' );
            this.browser.assert.element( 'a[href$="EN"]' );
        }
    );  

    it( 'all lables should be in German', 
        function() {
            this.browser.assert.success();
            this.browser.assert.text( 'h1', 'Sprach Demo' );
            this.browser.assert.text( '#tstTitle', 'Test für Sprachunterstützung' );
            
        }
    );  

  }
);