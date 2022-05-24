/* Pull-Down-Menu example */

var gui = require ( '../../' )
// stand alone: replace with  require( 'easy-web-app' )

// initialize the web app framework and a default main page
var mainPage = gui.init ( 'Pull-Down-Menu Demo' )
mainPage.title = 'Home' // replace default = "main"
mainPage.addView ( { 'id':'row1view', 'title':'Row 1 View', 'height':'500px' } )

// now add the pull down menu:
gui.addPullDownMenu( 'testMenu', 'Menu' )

// add static HTML content to menu:
gui.addPullDownMenuHtmlItem( 'testMenu', '<b>Some more menu tests:</b>' )

// Add a 2nd page page, visible in the pull-down menu
gui.addPage( 'testMenu/secondpage', 'Page 2', { id:'Page2' } )

// Add a 3rd page page, visible in the pull-down menu
gui.addPage( 'testMenu/thirdpage', 'Page 3', { id:'Page3' } )

// Add a 4th page page, visible in the pull-down menu
gui.addPage( 'testMenu/fourthpage', 'Page 4', { id:'Page4' } )

// add further static HTML content to menu:
gui.addPullDownMenuHtmlItem( 'testMenu', '<hr/>' )
gui.addPullDownMenuHtmlItem( 'testMenu', 
	'<span class="ui-icon ui-icon-extlink tbl-link-icon" '+
	'style="display: inline-block; vertical-align: bottom;"></span>'+
	'<a href="https://www.npmjs.com/package/easy-web-app" '+
	'target="_blank">npm package</a>' )
