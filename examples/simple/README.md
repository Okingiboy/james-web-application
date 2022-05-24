## Simple Form Example
This create a page with header, form and footer.

The [pong-easy-form](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-easyform) 
type defines a form using a naming convention. 
Using c1 and c2 will define two column to group the form fields.

The example contains also a simple REST/JSON web service (template) to POST form data back.

## Run example
1. You need to [get a local copy of the easy-web gui](https://github.com/ma-ha/easy-web-app).
2. and run the set up: `npm install easy-web-gui`
3. In this directory simply run: `nodejs index.js` 
4. Open [http://localhost:8888/](http://localhost:8888/) in your browser

## Explained
The code is all about some easy steps:

1. load the module ```require( 'easy-web-app' )```
2. start the server and set up main ```page gui.init()```
3. add a view to the main page ```page gui.addView( <view config>, <plug in config> )```

The rest of the example defines a REST/JSON web service to handle the POST
requests from the form button.

The server (step 2) will serve some static files to the browser, 
most important ones are
* `http://localhost:8888/index.html` 
  * empty page just loading the JS, CSS etc.
* `http://localhost:8888/js/portal-ng.js` 
  * the heart of the framework

Then the server will set up some REST/JSON web service which are expected 
by the client. The most important one is to load the structure definition
of the page:
* [http://localhost:8888/svc/layout/main/structure](http://localhost:8888/svc/layout/main/structure)
Please click the link and have a look at the JSON structure. 
That is all about! 

Should look like this:

```javascript
{
  "layout": {
    "title": "Test",
    "header": {
      "logoText": "My First Page",
      "modules": [
        {
          "id": "MainNav",
          "type": "pong-navbar",
          "param": {
            "confURL": "/svc/nav"
          }
        }
      ]
    },
    "rows": [
      {
        "rowId": "myFirstView",
        "title": "Form view showing all field types",
        "decor": "decor",
        "height": "400px",
        "resourceURL": "none",
        "type": "pong-easyform",
        "moduleConfig": {
          "id": "tstFormId",
          "easyFormFields": [
            "id",
            "c1|Name",
            "c1|Date|date",
            "c1|separator",
            "c1|Remark|3rows",
            "c2|Mailings|label",
            "c2|Send~Ads~~|checkbox_infomails_ads",
            "c2|Newsletter|checkbox_infomails_newsletter",
            "c2|Pass~Word"
          ],
          "actions": [
            {
              "id": "Chk",
              "actionName": "Check",
              "actionURL": "/dummy"
            }
          ]
        }
      }
    ],
    "footer": {
      "copyrightText": "powered by <a href=\"https://github.com/ma-ha/rest-web-ui\">ReST-Web-GUI</a>",
      "modules": []
    }
  }
}
```

Some words about the _easyFormFields_ definition: c1 and c2 are columns selector followed by the _label_ of the field. 
If the field _name_ must be identically to the _label_, ~ are white spaces in _label_ and _ ignored in _name_. 
There are some key words to make the definiton as easy as possible, otherwise you can specify the type after the a second | 

You'll find more details about the _easyform_ at the
[plug-in modules documentation](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules). 

Remark: The _easyform_ is a wrapper for _form_ plug in with simplified definition of the form fields. 
In _form_ you have an regular JSON object structure for each field.   