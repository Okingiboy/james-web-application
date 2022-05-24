var gui = require( '../../' )   
gui.init ( 'Form Tutorial: Page 3' )

var formConfig = {
    id   : 'myForm',
    title: 'Form: Field Types',
    type : 'pong-form',
    resourceURL: 'hello',
    height: '700px'
  }
  
var formPlugInConfig = {
    id: 'myFormDef',
    description: 'shows first form',
    fieldGroups: [
      {
        columns: [
          {
            formFields: [
              { id: 'selCat', label: 'Select', type: 'select',
                options:[ 
                  {option:'',value:''}, 
                  {option:'Shirt',value:'Shirt'}, 
                  {option:'Shoes',value:'Shoes'}, 
                  {option:'Hat',value:'Hat'} ] 
              },
              { id: 'selProduct', label: 'Select', type: 'select',
                 optionsResource: 
                  { resourceURL: "/color/", 
                    optionField: "name",
                    optionValue: "name",
                    loadOnChange: "selCat" } 
              },
              { id: 'selSize', label: 'Select', type: 'select',
                 optionsResource: 
                  { resourceURL: "/size/", 
                    optionField: "name",
                    optionValue: "name",
                    loadOnChange: "selProduct" } 
              }
            ]
          }
        ]
      }
    ]
  }
  
gui.addView ( formConfig, formPlugInConfig )

var app         = gui.getExpress()

// serve the select lists
app.get( 
    '/color', 
    function( req, res ) {
      var sel = [ {name:''} ]
      if ( req.query.selCat && req.query.selCat != '' ) {
        sel.push( { name: "White "+ req.query.selCat } )
        sel.push( { name: "Blue "+ req.query.selCat } )
        sel.push( { name: "Black "+ req.query.selCat } )
      }
      res.statusCode = 200    // = OK
      return  res.json( sel )
    }
  )

app.get( 
    '/size', 
    function( req, res ) {
      var sel = []
      if ( req.query.selProduct && req.query.selProduct != '' ) {
        sel.push( { name: req.query.selProduct+' S' } )
        sel.push( { name: req.query.selProduct+' M' } )
        sel.push( { name: req.query.selProduct+' L' } )
      }
      res.statusCode = 200    // = OK
      return  res.json( sel )
    }
  )
