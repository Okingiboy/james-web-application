var gui    = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log    = require( 'npmlog' )
var config = require( 'config' )

// example to access config values here:
log.info( 'Config-Example', 'Stage: '+config.staging )

var mainPage = gui.init()
// port, path, title etc are defined in external config
// Remark: log.level is set by init() to config loglevel value

// Uncomment next line, to switch to the v1 Layout
// mainPage.version = '1'


let page = mainPage.addView( { id:'V1', title:'Empty View', decor: 'none' } )
