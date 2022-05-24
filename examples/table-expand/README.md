## Table Expand Demo

Table supports expand with custom DIVs to show JSON tree-data, 

[JS code](https://github.com/ma-ha/easy-web-app/blob/master/examples/table-expand/index.js):

```javascript
var gui = require( 'easy-web-app' )
gui.getExpress().use( '/css-custom', express.static( __dirname ) )
// initialize the web app framework 
var mainPage = gui.init( 'Table Expand Demo' )
mainPage.title = 'Table Expand Demo'
mainPage.header.logoText = 'Table Expand Demo'
// page has only one table view:
gui.addView( // view config
  {
    'id': 'tableView',
    'title': 'Demo',
    'type': 'pong-table',
    'resourceURL': '/products'
  },
  // view's 'pong-table' plug-in config
  {
    dataURL: '',
    "cols": [
      {
        "cellType": "button", 
        "method": "expand",
        "id": "btExp", "width": "5%", "label": "&nbsp;",
        "expand": {
          // this are the elements of the exand:
          "divs": [ 
            { "id": "ID", "cellType": "text" },
            { "id": "Picture", "label": "Picture", "cellType": "img" },
            {
              "id": "XCust", "cellType": "div",
              "divs": [
                { "id": "CustomerCountLb", "cellType": "label", "label": "Customers" },
                { "id": "CustomerCount", "cellType": "text" },
                { "id": "RatingLb", "cellType": "label", "label": "Rating" },
                { "id": "Rating", "cellType": "rating", "ratingType": "3star" }
              ]
            },
            { "id": "descr", "label": "Description", "cellType": "text" }
          ]

        } 
      },
      // other "normal" table columns ...
      {  "id": "name", "label": "Name", "cellType": "text" },
      { ... },
      ...
    ]
  }
)

```

And that's how it may look like:

![table expand screen shot](https://raw.githubusercontent.com/ma-ha/easy-web-app/master/examples/table-expand/table-expand.png)

## CSS Hint

Expands are DIVs, so you need to arranged them via CSS. 

The example code injects the following custom CSS:

```CSS
.tableExpandRow div { 
  float: left; 
  margin-left: 5px;
  margin-right: 5px;
  text-align: center;
} 
```
Remark: `tableExpandRow` is a common class for all views. 
All expands of the `tableView` have the class `tableViewContentRowExpand`
and of course each DIV has a class to define it style individually.