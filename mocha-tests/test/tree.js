WEB_SERVER_PORT = 9896;

//use zombie.js as headless browser
var Browser = require('zombie');
var assert = require('assert');

describe( 
  'Tree example page', 
  function() {
  
    before( 
        function() {
          var app = require('../../examples/tree');
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
            this.browser.assert.text( 'h1', 'Tree + Histogram Example' );
            this.browser.assert.element( 'div.copyright-div' );
        }
    );  

    it( 'should show tree', 
        function() {
            this.browser.assert.success();
            this.browser.assert.text( 'div#treeTitle', 'Categories' );
            this.browser.assert.evaluate( '$(".treeItem").length', 7 );
        }
    );  

    it( 'should show table', 
        function() {
            this.browser.assert.success();
            this.browser.assert.text( 'div#tableViewTitle', 'Table' );
            this.browser.assert.evaluate( '$("#tableViewContentPongTable tr").length', 14 );
        }
    );  

    it( 'should show histogram', 
        function() {
            this.browser.assert.success();
            this.browser.assert.text( 'div#histTitle', 'Rating' );
            this.browser.assert.evaluate( '$(".HistogramBlockContainer").length', 3 );
        }
    );  
    
    it( 'click on tree should load filtered data into table'       //TODO get this working
//        , 
//        function() {
//            this.browser.assert.text( 'a[href="blue"]', 'Blue' );
//            this.browser.click( 'a[href="blue"]', 
//                function(e,b) {
//                  console.log( 'clicked' ) // never shown :-( 
//                  this.browser.assert.evaluate( '$("#tableViewContentPongTable tr").length', 4 )
//                }
//            )
//        }
    )
  }
);