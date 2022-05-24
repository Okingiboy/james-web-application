/** Simple example: Create a web page with form */

var gui = require( '../../' )          // stand alone: replace with:  require( 'easy-web-app' )

/** Initialize the framework and the default page */
gui.init( 'Multi Page Demo' )
gui.pages['main'].title = '1st Page'

/** Add an empty view to the default page. */
gui.addView( { 'id':'myFirstView' } ) 

/** Add a second page page. */
gui.addPage( 'secondpage' ) 
gui.pages['secondpage'].title = '2nd Page'

/** Add an empty view to the second page page. */
gui.addView( 
    { 'id':'viewOnSecondPage' }    // view definition
  , null                           // no view plug-in config 
  , 'secondpage'                   // page ID to add that view
)

/** Add a page page and exclude from nav view. */
var page2 = gui.addPage( 'exclpage-nonav', 'Page XYZ',  { id:'PageXyz' }, null )
page2.addInfo( 'New' )