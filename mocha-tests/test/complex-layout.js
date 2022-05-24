WEB_SERVER_PORT = 9880;

//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');
var app = null

describe( 
  'Complex-Layout example page', 
  function() {
    var browser = null

    before( 
        function() {
          app = require('../../examples/complex-layout');
          //this.server = http.createServer(app).listen(3000);
          // initialize the browser using the same port as the test application
          browser = new Browser({ site: 'http://localhost:'+WEB_SERVER_PORT});
          //browser = new Browser({ site: 'http://localhost:8888'});
        } 
    );
    
    // load the contact page
    before( ( done ) => {
      browser.visit( '/index.html?test=1', done);
    })
    
    it( 'should show the header and footer', 
      function() {
          browser.assert.success();
          browser.assert.text( 'h1', 'Complex Layout Demo' );
          browser.assert.element( 'div.copyright-div' );
        }
    )
    
    it( 'should show complex layout', 
      function() {
          browser.assert.text( 'div#row1viewTitle', 'Row 1 View' );
          browser.assert.text( 'div#row2viewTitle', 'Row 2 View' );
          browser.assert.text( 'div#row1viewTitle', 'Row 1 View' );
        }
    )

    it( 'should show complex layout', () => {
        browser.assert.text( 'div#row1viewTitle', 'Row 1 View' );
        browser.assert.text( 'div#row2viewTitle', 'Row 2 View' );
        browser.assert.text( 'div#row1viewTitle', 'Row 1 View' );
    })  

    it( 'should show pass URL parm to plain HTML view', () => {
      browser.assert.element( '#parm_test' );
      browser.assert.element( '#parm_lang' );
    })

    it( 'should show html via gui.getExpress().use(...)', () => {
      browser.assert.element( '#tab21Content' );
    })

  }
)