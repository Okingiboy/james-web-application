
var gui = require( '../../' )     // stand alone: replace with:  require( 'easy-web-app' ) 
var log = require( 'npmlog' )

// Initialize the framework and the default page
var page = gui.init()
page.header.logoText = 'Internationalization Demo'

// add a EN as default language 
gui.addLang( 'EN' ) 

// add DE and some translations 
gui.addLang( 'DE',
    { 
      'Test Language Support':'Test f&uuml;r Sprachunterst&uuml;tzung'
      ,'Internationalization Demo':'Sprach Demo'
    } 
  )
// adding translation for a label can be done also separately
gui.addTranslation( 'DE',
    'powered by <a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>',
    'l&auml;uft mit <a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>'
  )
  
// create aIO view on page
gui.addView( 
  { 'id':'tst', 'title':'Test Language Support'}
)
