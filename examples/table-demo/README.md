## Table Demo
This create a page with header, table and footer.

The [pong-easy-table](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-easytable) 
plug-in defines a form using a naming convention. Have a look at the 
["Cheats"](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-easytable#cheats) 
-- can't be easier! 

A goodie is the [help button](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-help). 
In this case no help content is shown, but the configuration of the view itself -- the demo mode of the _help button_.

## Run example
1. You need to [get a local copy of the easy-web gui](https://github.com/ma-ha/easy-web-gui).
2. simply run `nodejs index.js` in this directoy 

## Remark:
The code uses "pong-easytable" to define the view:

```javascript
gui.addView ( 
  {
    id   : 'tableView',
    title: 'Table Demo (sorry, zoom is always a flower ;-)',
    type : 'pong-easytable',
    resourceURL:'/products'
  },
  {
    dataURL:'',
    easyCols:
      [
        '*ID|5%',
        'Name=Name.0',
        'ProductPage_linkForCol_1',
        'Picture',
        'ZoomImg_zooms_Picture',
        'Status_checkbox',
        'Rating',
        'Description_editable',
        'Product~Page_link',
        'Created_datems_editable'
      ]
  }
```	
This makes the definition easier. 
To get advantages all features you need to use the "pong-table" instead. 

```javascript
gui.addView (
  {
    id    : 'tableView',
    title : 'Table Demo (sorry, zoom is always a flower ;-)',
    type  : 'pong-table',
    resourceURL:'/products'
  },
  { 
	dataURL: '',
	cols: [
		{ id: 'ID', label: 'ID', cellType: 'text', width: '5%' },
		{ id: 'Name.0', label: 'Name', cellType: 'text' },
		{ id: 'ProductPage', label: 'ProductPage_linkForCol_1', cellType: 'linkFor', col: '1' },
		{ id: 'Picture', label: 'Picture', cellType: 'img' },
		{ id: 'ZoomImg', label: 'ZoomImg_zooms_Picture', cellType: 'largeimg', forImg: 'Picture' },
		{ id: 'Status', label: 'Status', cellType: 'checkbox' },
		{ id: 'Rating', label: 'Rating', cellType: 'rating', ratingType: '3star' },
		{ id: 'Description', label: 'Description', cellType: 'text', editable: 'true' },
		{ id: 'ProductPage', label: 'Product Page', cellType: 'linkLink' },
		{ id: 'Created', label: 'Created', cellType: 'datems', editable: 'true' }
	],
	rowId: 'ID'
}
```

Now you can add e.g. a date format like `format:'ddd, hA' for the "Created" column. 

Have a look at http://momentjs.com/docs/#/displaying/ for date formatter options.