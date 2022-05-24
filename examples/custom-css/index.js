var gui     = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var express = require( 'express' )
var log = require('npmlog');

log.info( __dirname )
gui.decor = 'tedge'

// define to load /css-custom/custom.css from local "css" folder
gui.getExpress().use( '/css-custom', express.static( __dirname + '/css' ) )
gui.getExpress().use( '/img-cust', express.static( __dirname + '/img-cust' ) )
gui.getExpress().use( '/lorem/html', express.static( __dirname + '/lorem' ) )


// define a main page
var mainPage = gui.init( 'Customize CSS Demo', 8880, '/test/test' )
mainPage.setTitle( 'Customize CSS Demo' )

// create logo (incl. link to main and hide main in menu tabs)
mainPage.setLogo( 'Customize CSS Demo', 'img-cust/funnyLogo.png' ) 

// mainPage.setLogoURL( 'img-cust/funnyLogo.png' ) // deprecated, but fallback
mainPage.setPageWidth( '90%' )
  
mainPage.addView( { 'id':'row1view', 'title':'Row 1 View', 'height':'100px' } )
mainPage.addView( { 
  id: 'Lorem', 
  title: 'Row 2 View', 
  height: '300px', 
  resourceURL: 'lorem', // load "Lorem ipsum ..." as HTML content
  footerURL: 'lorem/footer' // you need to adjust the #Lorem height via custom.css
} )


gui.addPage( 'page2', 'Page 2',  { id:'Page2' }, null )
gui.addPage( 'page3', 'Page 3',  { id:'Page3' }, null )

gui.getExpress().get( '/lorem/footer', (req,res) => {
  res.status( 200 ).sendFile( __dirname + '/lorem/footer.html' )
  // var html = '<div id="abc">This is a footer, with some JS included.<div>'
  // html += '<script>'
  // html += '$(function(){ setInterval( toggleAbc, 1000 );   });'
  // html += 'function toggleAbc(){ $( "#abc" ).toggle( "display" ); }'
  // html += '</script>'
  // res.status( 200 ).send( html )
})