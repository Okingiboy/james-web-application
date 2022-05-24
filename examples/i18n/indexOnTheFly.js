
var gui = require( '../../' )     // stand alone: replace with:  require( 'easy-web-app' ) 
var log = require( 'npmlog' )

// Initialize the framework and the default page
var page = gui.init()
page.header.logoText = 'Internationalization Demo'

// add a EN as default language 
gui.addLang( 'EN' ) 
gui.addLang( 'DE' )
  
// create aIO view on page
gui.addView( { 
  'id':'tst', 
  'title':'Test Language Support'
})

// hook to load serve tranlations e.g. from DB
gui.getTranslation = async ( req, lang ) => {
  if ( lang == 'DE' ) {
    return {
      'Test Language Support':'Test f&uuml;r Sprachunterst&uuml;tzung'
      ,'Internationalization Demo':'Sprach Demo',
      'powered by <a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>':
      'l&auml;uft mit <a href="https://github.com/ma-ha/rest-web-ui">ReST-Web-GUI</a>'
    }
  }
  return {}
}