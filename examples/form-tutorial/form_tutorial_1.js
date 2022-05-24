var gui = require( '../../' )   
gui.init ( 'Form Tutorial: Page 1' )

var viewConfig = {
    id   : 'myForm',
    title: 'Form View',
    type : 'pong-form'    
  }
  
var plugInConfig = {
    id: 'myFormDef',
    description: "shows first form",
    fieldGroups: [
        {
            columns: [
                {
                    formFields: [
                        {
                            id:    "field1",
                            label: "Say",
                            type:  "text",
                            defaultVal: "Hello world!"
                        }
                    ]
                }
            ]
        }
    ]
  }
  
gui.addView ( viewConfig, plugInConfig ) 