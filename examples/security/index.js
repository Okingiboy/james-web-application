var gui = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log = require('npmlog');

// define a main page
var mainPage = gui.init( 'Security Demo', 8011, 'securitydemo' )
mainPage.title = 'Home'
mainPage.header.logoText = 'Security Demo'

mainPage.addView( { 'id':'row1view', 'title':'Login with user id "test1" or "test2"', 'height':'300px' } )

// let's create a hidden page -- only available for logged in users
var secretPage = gui.addPage( 'secretPage', 'Private&nbsp;Page',  
  { id:'DataTable', type:'pong-easytable', resourceURL:'/securitydemo/products' },
  { dataURL:'', "pollDataSec":"60", easyCols: [ 'Name', 'Rating' ] }
 )
 
// switch securiy on:
gui.enableSecurity({ 
  divLayout: true,
  resetPasswordURL: 'index.html?layout=forgotPwd' 
})
gui.loginTimeout = 120000 // milli sec  
gui.secParams.sessionExpiredAlert = true 
// other user friendly option is to redirect the user to a logout page

// "auth" is ok if any user id is given
gui.authenticate =  
  function authenticate( user, password, callback ) {
    log.info( 'Login user "'+user+'"' )
    if ( user == "test1" ) {
      callback( null, true, false )
    } else if ( user == "test2" ) {
      callback( null, true, true )
    } else if ( user == "test3" ) {
      callback( null, true )
    } else {
      callback( null, false )
    }
  }

// hook for change password requests 
gui.changePassword =  
  function changePassword( user, oldPasswprd, newPassword, callback ) {
    log.info( 'Change password for "'+user+'"' ) //TODO: implement ...
    callback( null, true )
  }

// grant all to "main" page: if user != null then "granted"
gui.authorize =  
  function authorize( user, page ) {
    if ( page == 'main') {
      log.info( 'All users are authorized for page "'+page+'", also "'+user+'"' )
      return true;
    }
    if ( ! user ) {
      log.info( 'User "'+user+'" is not authorized for page "'+page+'"' )
      return false
    }
    log.info( 'User "'+user+'" is authorized for page "'+page+'"' )
    return true  
  }

// now add the pull down menu:
gui.addPullDownMenu( 'testMenu', 'Menu' )
// add static HTML dummy content to menu:
gui.addPullDownMenuHtmlItem( 'testMenu', 'Test 1' )
gui.addPullDownMenuHtmlItem( 'testMenu', 'Test 2' )

// by defining this as subpage of "user", the link will appear in the user security menu
var profilePage = gui.addPage( 'user/profile', 'User Profile',  { id:'UserProfile' }, null )
var profilePage = gui.addPage( 'user/settings', 'Preferences',  { id:'Preferences' }, null )

// now we need to implement the ReST service for /products 
// this should also only be available for authenticated users
var svc  = gui.getExpress()
svc.get( 
  '/products', 
  async function( req, res ) {
    try {
      if ( await gui.getUserIdFromReq( req ) ) {
        if ( ! gui.checkUserCSRFtoken( req ) ) {
          log.warn( 'GET products', 'CSRF wrong!!')
        }
        log.info( 'products service', 'user is logged in' )
        // generate some dummy data:
        var tableData = 
          [ 
          {"Name":"Product AB","Rating":"3"},
          {"Name":"Product 1","Rating":"2"},
          {"Name":"XYZ Product","Rating":"1"},
          {"Name":"My Product","Rating":"1"},
          {"Name":"Secret Product 1","Rating":"2"},
          {"Name":"Top Secret Product 2","Rating":"0"},
          {"Name":"Product XYZ","Rating":"0"},
          {"Name":"My Prod","Rating":"0"},
          {"Name":"Your Prod","Rating":"3"},
          {"Name":"Other Product","Rating":"1"},
          {"Name":"Just a Product","Rating":"2"}
          ]
        res.status( 200 ).json( tableData )  		
      } else {
        log.info( 'products service', 'not allowed for unauthenticated users' )
        res.status( 401 ).send( "You must login first!!"  )  		  		
      }
    } catch ( exc ) { 
      log.error('products service', exc )
      res.status( 500 ).send('Oups')
    }
  }
)

/* Optional hooks for HA environment, typically using a distributed cache or a DB
gui.createToken = async function createToken( userId ){
  return new Promise( ( resolve, reject ) => {
    resolve( 'TODO TOKEN' )
  })
}

gui.getUserIdForToken = async function getUserIdForToken( token ){
  return new Promise( ( resolve, reject ) => {
    resolve( 'TODO USER ID' )
  })
}

//optional
gui.getUserNameForToken = function getUserNameForToken( token ) {
  return new Promise( ( resolve, reject ) => {
    resolve( 'TODO USER NAME' )
  })
}

gui.deleteUserIdForToken = async function gui.deleteUserIdForToken( token ) {
  // TODO: implement for HA cluster
}
*/

// example to separate UserId from UserName
gui.getUserNameForToken = function getUserNameForToken( token ) {
  return new Promise( ( resolve, reject ) => {
    
    if ( gui.userTokens[ token ] ) {
      log.info( "getUserNameForToken: userId = "+gui.userTokens[ token ].userId )
      if ( Date.now() < gui.userTokens[ token ].expires ) {
        resolve( 'Just Me' )
      } else {
        log.info( "getUserNameForToken: userId = "+gui.userTokens[ token ].userId+"  >>>> session expired" )
        resolve() // return null indicates: session is invalid
      }
    } else {
      log.warn('getUserNameForToken', 'no token' )
      resolve()
    }
  })
}
