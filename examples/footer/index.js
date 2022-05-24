/* Customized footer example */

var gui = require ( '../../' )       // stand alone: replace with  require( 'easy-web-app' )

/* Initialize the framework and the default page */
var mainPage = gui.init ( 'Customized Footer Example' )

mainPage.addView (  { id : 'dummy', title: 'Empty View' } )

/* now we customize the footer */
mainPage.setCopyright( 'Example page, (c) 2018, M.H.' )
mainPage.addFooterLink( 'Release Notes', 'https://github.com/ma-ha/easy-web-app/blob/master/ReleaseNotes.md', '_blank' )
mainPage.addFooterLink( 'About', 'https://github.com/ma-ha/easy-web-app/' )
