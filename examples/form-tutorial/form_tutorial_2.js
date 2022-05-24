var gui = require( '../../' )   
gui.init ( 'Form Tutorial: Page 2' )

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
            actionName: 'Send greetings',
            method: 'POST',
            actionURL: 'test'
        }
    ]
  }
  
gui.addView ( viewConfig, plugInConfig ) 