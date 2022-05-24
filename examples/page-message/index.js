var gui = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 

// define a main page
var mainPage = gui.init( 'Modal Message Demo', 8011, 'demo' )
mainPage.addView( { 'id':'v1', 'title':'Blank', 'height':'300px' } )

mainPage.title = 'Home'
mainPage.header.logoText = 'Modal Message Demo'

// after page load: 
// define to check the resource `demo/message` for a message to display
mainPage.header.modules.push( {
  id    : 'PgMesg', 
  type  : 'pong-message', 
  param : { resourceURL: 'demo/message' }
} )
  
gui.getExpress().get( '/demo/message', async ( req, res ) => {
  // if no message should appear: 
  // res.status( 200 ).json( null )

  // return data for page message
  res.status( 200 ).json( { 		
    title     : 'Test',
    html      : 'Hello World',
    width     : 200,
    height    : 200,
    buttonTxt : 'Okey-dokey'
  })
})
