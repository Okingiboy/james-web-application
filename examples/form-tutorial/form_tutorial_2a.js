var gui = require( '../../' )   
gui.init ( 'Form Tutorial: Page 2a' )

var viewConfig = {
    id   : 'myForm',
    title: 'Form View',
    type : 'pong-form',
    resourceURL: 'hello'
  }
  
var plugInConfig = {
    id: 'myFormDef',
    description: 'shows first form',
    fieldGroups: [
        {
            columns: [
                {
                    formFields: [
                        {
                            id:    'field1',
                            label: 'Say',
                            type:  'text',
                            defaultVal: 'Hello world!'
                        }
                    ]
                }
            ]
        }
    ],
    actions: [
        {
            id: 'myBtn',
            actionName: 'Send greetings + Surf to GitHub',
            method: 'POST',
            actionURL: 'test',
            target: 'modal',
            // only for target= modal you may specify, where to go afterwards
            navto: 'https://github.com/ma-ha/rest-web-ui'
            // ^ new feature since rest-web-ui 1.1.3
        }
    ]
  }
  
gui.addView ( viewConfig, plugInConfig ) 

gui.getExpress().post( '/test', ( req, res ) => {
  res.status( 200 ).send( 
    'Hello to you!!\n'+
    'When you close this, we navigate to GitHub...' 
  )
})