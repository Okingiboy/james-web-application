## On-the-fly Config Demo
This create a page with header, table and footer. 
You can modify the table in the browser by clicking the configure icon (top right).

The code is more complex, because all required REST/JSON web services are implemented. 125 LoC :-D

Implemented API:
* GET /products
  * get list of products
* POST /products
  * save/update a product record (you can edit it in the table)
* GET /products/pong-table
  * load table view configuration
* GET /products/pong-easytable
  * load table view configuration (same as above)
* GET /products/pong-easytable/columns-available
  * load a configuration template
* POST /products/pong-easytable
  * save table view configuration

## Run example
1. You need to [get a local copy of the easy-web gui](https://github.com/ma-ha/easy-web-gui).
2. Get required packages: `npm install`
2. Then simply run `nodejs index.js` in this directoy 