const log      = require( 'npmlog' )
// const jwt      = require( 'express-jwt' )
const jwks     = require( 'jwks-rsa' )
const jwtAuthz = require( 'express-jwt-authz' )
const cfg      = require( 'config' )
const jwtParser = require( 'jsonwebtoken' )

exports: module.exports = { 
  setupAPI : setupAPI 
}

// ============================================================================
// API:
// now we need to implement the ReST service for /products 
// this should also only be available for authenticated users

function setupAPI( app ) {
  let svc  = app.getExpress()

  // // this should be better solution - but not working!
  // var jwtCheck = jwt({
  //   secret: jwks.expressJwtSecret({
  //     cache: true,
  //     rateLimit: true,
  //     jwksRequestsPerMinute: 5,
  //     jwksUri: cfg.JWKS_URI
  //   }),
  //   clientID  : cfg.CLIENT_ID,
  //   audience  : cfg.AUDIENCE,
  //   issuer    : cfg.ISSUER,
  //   algorithms: ['RS256']
  // })
  // const checkScopes = jwtAuthz([ cfg.AUTH_SCOPE ])
  // svc.get( '/products', jwtCheck, // checkScopes,

  const myJWTcheck = initJWTcheck()

  svc.get( '/products', myJWTcheck, 
    async function( req, res ) {
      try {
        if ( await app.getUserIdFromReq( req ) ) {
          if ( ! app.checkUserCSRFtoken( req ) ) {
            log.warn( 'GET products', 'CSRF wrong!!')
          }
          log.info( 'products service', 'user is logged in' )
          // generate some dummy data:
          let tableData = 
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
}

// ----------------------------------------------------------------------------
// Authorization Checker

function initJWTcheck() {
  // let clientID = cfg.CLIENT_ID
  let audience = cfg.AUDIENCE
  let issuer   = cfg.ISSUER

  let check = (req, res, next) => {
    if ( ! req.headers.authorization ) {
      log.info( 'JWTcheck', 'API call is not authorized: Authorization header not found' )
      return next( new UnauthorizedError(
        'No Authorization header found', 
        { message: 'Format is "Authorization: Bearer [token]"' }
      ))
    }
    // parse JWT
    let parts = req.headers.authorization.split( ' ' )
    if ( parts.length == 2  &&  parts[0] == 'Bearer' ) {
      let tokenStr = parts[1]
      let token = jwtParser.decode( tokenStr, { complete: true }) || {}

      log.info( 'JWTcheck', 'check JWO token:' )
      log.info( 'JWTcheck', token.payload )
  
      if ( token.payload && token.payload.aud && token.payload.iss ) {
        // check audience
        if ( typeof token.payload.aud === 'string' && token.payload.aud != audience ) {
          log.info( 'JWTcheck', 'API call is not authorized: payload.aud string not correct ' )
          return next( new UnauthorizedError(
            'JWT audience incorrect', 
            { message: 'JWT audience (payload.aud) is not correct' }
          ))
        } else if ( typeof token.payload.aud === 'array' && token.payload.aud.indexOf( audience ) == -1 ) {
          log.info( 'JWTcheck', 'API call is not authorized: payload.aud array not correct' )
          return next( new UnauthorizedError(
            'JWT audience incorrect', 
            { message: 'JWT audience array (payload.aud) is not correct' }
          ))
        }

        // check issuer
        if ( token.payload.iss != issuer ) {
          log.info( 'JWTcheck', 'API call is not authorized: issuer not correct' )
          return next( new UnauthorizedError(
            'JWT audience issuer', 
            { message: 'JWT issuer (payload.iss) is not '+issuer }
          ))
        }

        // rest-web-gui will provide the id-token with the user info as "id-jwt" header
        if ( req.headers[ 'id-jwt' ] ) {
          let idToken = jwtParser.decode( req.headers[ 'id-jwt' ], { complete: true }) || {}
          log.info( 'JWTcheck idToken', idToken.payload )
        }

      } else {
        log.info( 'JWTcheck', 'API call is not authorized: aud or iss not found' )
        return next( new UnauthorizedError(
          'Bearer token contains no JWT user name', 
          { message: 'JWT requries payload.name' }
        ))
      }
    } else {
      log.info( 'JWTcheck', 'API call is not authorized: No Bearer token found' )
      return next( new UnauthorizedError(
        'No Bearer token found', 
        { message: 'Format is Authorization: Bearer [token]' }
      ))
    }
    // OK, check passed
    log.info( 'JWTcheck', 'API call is authorized' )
    return next();
  }
  return check
}

function UnauthorizedError (code, error) {
  this.name    = "UnauthorizedError"
  this.message = error.message
  Error.call( this, error.message )
  Error.captureStackTrace( this, this.constructor )
  this.code   = code
  this.status = 401
  this.inner  = error
}

UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;
