const app      = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 

const appGUI   = require( './app-gui' )
const appAPI   = require( './app-api' )

appAPI.setupAPI( app )

appGUI.setupGUI( app )
appGUI.setupSec( app )


// // example to separate UserId from UserName
// gui.getUserNameForToken = function getUserNameForToken( token ) {
//   return new Promise( ( resolve, reject ) => {
    
//     if ( gui.userTokens[ token ] ) {
//       log.info( "getUserNameForToken: userId = "+gui.userTokens[ token ].userId )
//       if ( Date.now() < gui.userTokens[ token ].expires ) {
//         resolve( 'Just Me' )
//       } else {
//         log.info( "getUserNameForToken: userId = "+gui.userTokens[ token ].userId+"  >>>> session expired" )
//         resolve() // return null indicates: session is invalid
//       }
//     } else {
//       log.warn('getUserNameForToken', 'no token' )
//       resolve()
//     }
//   })
// }
