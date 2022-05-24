const LED_GREEN = 1, LED_OFF = 0, SWITCH_ON = 'on', SWITCH_OFF = 'off'

var gui = require( '../../' )     // stand alone: replace with  require( 'easy-web-app' ) 
var log = require( 'npmlog' )

// Initialize the framework and the default page
gui.init( 'I/O' )
  
// create a IO view on page
var ioView = gui.addIoView()
ioView.height = '600px'
ioView.moduleConfig.pollOptions = ["1","5","10","30","60"]

// change update speed to 1 sec (= 1000 ms)
ioView.setUpdateMilliSec( 10000 )
ioView.setBackgroundImage(  __dirname + '/demo.png' )

// add a 'LED' at x/y 100px/100px and switch it to 'on' (=1)
var led = LED_GREEN
ioView.addLED( 'myFirstLED', 300, 210, led )

ioView.addSwitch( 
    'mySwitch',                   // the ID
    60, 85,                       // x,y pos of switch
    [ SWITCH_ON, SWITCH_OFF ],    // possible values
    function ( switchValue ) {
      log.info( 'Switch "mySwitch"', 'now %j', switchValue );
      if ( switchValue == SWITCH_ON ) {
        ioView.setLED( 'myFirstLED', LED_GREEN );
      } else {
        ioView.setLED( 'myFirstLED', LED_OFF );
      }
    } 
)

var label = ioView.addStaticLabel( 'by MA-HA', 200, 10 )
label.font = "10px Courier"

ioView.addIoElementConfig( 
  { id: 'lX0', type: 'Label', label: '2018',
    pos: { x: '200', y: '22' }, font: '10px Courier' }  
)

var btnON = false
function btnPressCallback( val, id ) {
  gui.io[ ioView.ioId ][ id ].value = ( btnON ? 'OFF' : 'ON' )
  btnON = !btnON
  log.info( 'btnPressCallback' , 'id='+id+' '+gui.io[ ioView.ioId ][ id ].value)
}

ioView.addIoElementConfig(
  { id: "btn", type: "Button", label: "press me",
    width: "100", height: "25",
    pos: { x: '5', y: '300' },
    values: [
      { buttonState: "ON",  led: "1" },
      { buttonState: "OFF", led: "0" }
    ]
  },
  btnPressCallback
)

// add graph w/o data
ioView.addIoElementConfig(
  {
      id:"advGraph",
      type:"Graph",
      width:"500", "height":"300",
      layout:{
          name:"AD data [V]",
          graphType:"timeLog",
          colors:{
              A0:"#9d5fc6",A1:"#c69d5f",
              A2:"#c65fc6",A3:"#5f88c6",
              A4:"#c65f88",A5:"#88c65f" },
          yAxis:{
//              axisType:"logaritmic",
              min:"0", max:"10",
              scaleHiMin:"5", scaleHiMax:"50",
							scaleLoMin:"0", scaleLoMax:"50",
              labelInteval:["1","5","10"],
							grid:"label"
          },
          xAxis:{ axisType:"time", labelCnt:'5', gridColor:'#EEE' }
      },
      pos:{ x:"400", y:"100" }
    }
)
var advGraph = []
for ( var i=0; i<4; i++ ) { 
    //advGraph.push( { name: 'A' + i, cnt: 0, data: [] } )
    advGraph.push( 
      { name: 'A' + i, 
        cnt: Date.now() - 100*2000, // just a helper to generate the time line 
        data: [] } 
    )  
    for ( var j=0; j<100; j++ ) { // fill up with 500 values, to permit streching
        advGraph[i].data.push( [ advGraph[i].cnt, i+2.2+ Math.random()/2 ] ) //add some dummy data => i+1
        advGraph[i].cnt = advGraph[i].cnt + 2000
    }
}

for ( var i=4; i<6; i++ ) { 
    //advGraph.push( { name: 'A' + i, cnt: 0, data: [] } )
    advGraph.push( 
      { name: 'A' + i, 
        cnt: Date.now() - 100*2000, // just a helper to generate the time line 
        data: [] } 
    )  
    for ( var j=0; j<100; j++ ) { // fill up with 500 values, to permit streching
        advGraph[i].data.push( [ advGraph[i].cnt, i*10-15 + Math.random()*10 ] ) //add some dummy data => i+1
        advGraph[i].cnt = advGraph[i].cnt + 2000
    }
}

// add data for gui elmenet with id="advGraph"
gui.io[ ioView.ioId ]['advGraph'] = advGraph

log.info('>', ioView.moduleConfig.io )