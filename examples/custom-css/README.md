You can customize it to your needs!

Code is really easy:

```javascript
...
// define to load /css-custom/custom.css from local folder
gui.getExpress().use( '/css-custom', express.static( __dirname ) )
gui.getExpress().use( '/img-cust', express.static( __dirname + '/img-cust' ) )
// define a main page
var mainPage = gui.init()
mainPage.setTitle( 'Customize CSS Demo' )
mainPage.setLogoText( 'Customize CSS Demo' )
mainPage.setLogoURL( '/img-cust/funnyLogo.png' )
mainPage.setPageWidth( '90%' )
// add 2 empty dummy views  
mainPage.addView( { 'id':'row1view', 'title':'Row 1 View', 'height':'100px' } )
mainPage.addView( { 'id':'row2view', 'title':'Row 2 View', 'height':'300px' } )
```

![demo screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/custom-css/CustomCSS-ScreenShot.png)

