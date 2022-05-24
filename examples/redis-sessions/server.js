var gui = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log = require('npmlog');

var redis = require( 'redis' )
var cacheOptions = { prefix: 'loginsession-' }
var cache = redis.createClient( cacheOptions )

var port = 8001
var titleStr = 'Demo: Server '
var argv = require('minimist')(process.argv.slice(2));
if ( argv[ 'A' ] ) { 
  port = 8001
  titleStr += 'A'
} else if ( argv[ 'B' ] ) {
  port = 8002
  titleStr += 'B'
} else {
  log.error( 'Parameter -A or -B reqired (e.g.: node server.js -A' )
  process.exit()
}

// define a main page
var mainPage = gui.init( 'Security Demo', port, 'securitydemo' )
mainPage.title = titleStr
mainPage.header.logoText = titleStr

mainPage.addView( { 'id':'row1view', 'title':'Login with user id "test1" or "test2"', 'height':'300px' } )

// let's create a hidden page -- only available for logged in users
var secretPage = gui.addPage( 'secretPage', 'Private&nbsp;Page',  
  { id:'DataTable', type:'pong-easytable', resourceURL:'/securitydemo/products' },
  { dataURL:'', "pollDataSec":"60", easyCols: [ 'Name', 'Rating' ] }
 )

// switch securiy on:
gui.enableSecurity()
gui.loginTimeout = 200000 // hehe: 200 sec session timeout -- good for testing 

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

// grant all to "main" page: if user != null then "granted"
gui.authorize =  
function authorize( user, page ) {
  if ( page == 'main')  return true;
  if ( ! user ) return false
  return true  
}

gui.createToken = async function createToken( userId ){
  return new Promise( ( resolve, reject ) => {
    var token = gui.mkToken(32)
    cache.hmset( token, "userId", userId, "loginDate", Date.now() )
    log.info( 'createToken', token )
    resolve( token )
  })
}

gui.getUserIdForToken = async function getUserIdForToken( token ) {
  return new Promise( ( resolve, reject ) => {
    cache.hgetall( token, ( err, loginObj ) => {
      log.info( 'getUserIdForToken', token )
      // TODO: check session timeout
      if ( ! err ) {
        resolve( ( loginObj ? loginObj.userId : null ) )
      } else { resolve( null ) }
    })    
  })
}

gui.deleteUserIdForToken = async function deleteUserIdForToken( token ) {
  return new Promise( ( resolve, reject ) => {
    log.info( 'deleteUserIdForToken', token )
    cache.del( token )
    resolve()
  })
}

async function test() {
  var tstToken = await gui.createToken( 'testUser' )
  log.info( "tstToken", tstToken )
  var user = await gui.getUserIdForToken( tstToken )
  log.info( "user", user )
  await gui.deleteUserIdForToken( tstToken )
  log.info( "deleted token" )
}
test()