# I/O Page Example
This small example creates an I/O view with a 
* switch
* LED
* background image 

The "call back" method of the switch is configured to set the LED.
 
# Run example
1. You need to [get a local copy of the easy-web gui](https://github.com/ma-ha/easy-web-gui).
2. run `npm install`
3. in this directory simply run: `node index.js`
 
Hint: Drag y-axis to scale the graph! 
Click in the upper section and dragging up or down modify the maximum -- 
click and drag the lower part axis modifies the minimum.
Touch and multi-rouch is also supported for scaling the y-axis.

# More complex example
This is my Arduino controller GUI:

![demo screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/io/Lab-Controller.png) 


# I/O API
Initialization:
```javascript
var gui = require( 'easy-web-app' ) 
var ioView = gui.addIoView()
...
```

All methods here are just helpers to set up the JSON configuration
and to make the REST backend easier.

See also 
[I/O plug-in configuration reference](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-io).


## ioView.setUpdateMilliSec ( milli_seconds )
Set Polling interval to update data. 

The data is also updated at any action on the view.

## ioView.setBackgroundImage ( url )
Load an image for the panel.

Warning: If the URL does not work, this will block loading of the data!

## ioView.addLED ( id, x, y, ledValue )

Values:
* 0 = off = blcak
* 1 = green
* -1 = red
* 2 = yellow
* null = grey

## ioView.addStaticLabel ( text, x, y }
Create a label. Returns label object.

Feel free to set these options on label object:
* textAlign
* textBaseline
* font
* textFillColor
* textStrokeColor


## ioView.addSwitch ( id, x, y, [ value1, value2 [,value3] ], callbackFunction )
see [example code](https://github.com/ma-ha/rest-web-ui/blob/master/html/modules/pong-io/pong-io.js) 

## ioView.addIoElementConfig( configObj, [ callback ] )
Adds generic I/O configs to the view. 