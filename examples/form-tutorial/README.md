# Form Tutorial
The form plug in is complex and may be main functionality of a page. 

Therefore I will explain the usage scenarios step by step.

To make definition of _form_ plugin easier, an _easy-form_ wrapper is available. 
But let's understand _form_ first, before doing short cuts.

## General definition of the form view 
To set up a page with a form you need the following code:

```javascript
var gui = require( 'easy-web-app' )   
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
```
The first line imports the _easy-web-app_ module.

The second line initialize _easy-web-app_ module and 
starts a web server with an empty "page" called 'Form Form Tutorial: Page 1'.

Using the command `gui.addView ( viewConfig, plugInConfig )`  you add a new row
with a _form_ view. Indicating inside the `viewConfig` the plug-in 
`type:'pong-form'` the framework will load and initialize a form.  

The 'plugInConfig' defines the parameter for the plug in, here it initializes 
a form with one field. It seems to be complex to have one field inside 
_formFields_ array, which is in a _columns_ array, in a _fieldGroups_ array, 
but this gives maximum flexibility. A simpler way is to use _easy-form_ as 
wrapper for the _form_, but it has it's limitations.

To run this code open a command terminal, change into 
the `examples/form-tutorial` directory and run

    node form-tutorial_1.js

If you put this into a stand alone index.js you need to do

    npm install easy-web-app
    node index.js

If you open the URL http://localhost:8888 in your browser therResult will look
like this:
![form tutorial screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/form-tutorial/form_tutorial_1.png) 

This form is not very useful, because no action is defined. 

## Action: Post data to a service 
The basic structure of the code is the same as above, we only need to modify 
the `plugInConfig`:

```javascript
...
var plugInConfig = {
    id: 'myFormDef',
    description: "shows second form",
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
...
```

By adding the `actions` array with the _myBtn_ the form will have a POST button. 
Pressing the button a POST request to `http://localhost:8888/test` is performed. 

Full example: [JS Code](https://github.com/ma-ha/easy-web-app/blob/master/examples/form-tutorial/form_tutorial_2.js)

The page looks like this:

![form tutorial screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/form-tutorial/form_tutorial_2.png) 
 
The browser network debugger ("F12" is my friend) shows the request to 
the `http://localhost:8888/test` -- of course it fails, because no service 
is implemented to respond at this URL.

## Post action result -- show it in another view
Typical requirement is to provide a form to search or create data records 
and a table to display the data records.

Example use case: In the form view an action button requests with a GET to load 
data and the result should be displayed in a table view.

```javascript
var gui = require( 'easy-web-app' )   
gui.init ( 'Form Tutorial: Page 1' )

var formConfig = { id: 'myForm', title: 'Form View', type : 'pong-form' }
var formPlugInConfig = { 
    id: 'myFormDef',
    fieldGroups: [
		...
    ],
    actions: [
        {
            id: 'myBtn',
            actionName: 'Ask',
            method: 'GET',
            actionURL: 'test',
            setData: [
                { 
                  "resId": "myTable"
                }
           ]
        }
    ]
  }
gui.addView ( viewConfig, plugInConfig ) 

var tableConfig = { id: 'myTable', title: 'Table View', type : 'pong-form' }
var tablePlugInConfig = { 
	...
  }
gui.addView ( tableConfig, tablePlugInConfig ) 
```

Two views are created via `gui.addView(...)`:

1. myForm
2. myTable

Please notice the `formPlugInConfig` is the `setData` array. 
If the user presses the _Ask_ button an GET request to the URL `test`,
precisely `GET http://localhost:8888/test?field1=Hello+world%3F` is done.
The `setData` indicates to set the result data of the HTTP GET to any of the 
defined views in the array, here only _myTable_. 

Full example JS Code: [form_tutorial_3.js](https://github.com/ma-ha/easy-web-app/blob/master/examples/form-tutorial/form_tutorial_3.js)

The page looks like this:

![form tutorial screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/form-tutorial/form_tutorial_3.png) 


## Supported Form Input Types

Please have a look at [form_tutorial_4.js](https://github.com/ma-ha/easy-web-app/blob/master/examples/form-tutorial/form_tutorial_3.js)
for supported form fields.

Please check the [form reference documentation](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-form)
to read all about forms.

## Load dynamic form fields after page loading
TODO

## Validation and Captcha
see [form_tutorial_6.js](https://github.com/ma-ha/easy-web-app/blob/master/examples/form-tutorial/form_tutorial_6.js)

## Off-Topic: "Table" as "Form"
The table plug in provides an _editable_ attribute for text cells: 
`editable:'true'` 

This makes life much easier, because you can modify data records directly in 
the table. 

# Form with auto height

If you don't know the heigth of a form in the design phase, you can set `height: 'auto'`.

Check out 
[form_tutorial_4.js](https://github.com/ma-ha/easy-web-app/blob/master/examples/form-tutorial/form_tutorial_4.js)

A little trick is done here in HTML, but you don't have to care about.

# Forms On Steroids

Yes -- forms can look like this (screen shot):
 
![crazy form screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/form-tutorial/crazyform.png) 

This is done using a JS field to load a script and create a HTML canvas as background.
The radio buttons are arranged ontop the canvas. 
A "click" event handler re-draws the routing lines in a different color to highlight them.