The [config npm package](https://www.npmjs.com/package/config) is great for staging and CI/CD automation. It helps you also to make the code short and simple.

Now `easy-web-app` supports `config` for:
* port
* logo
* copyright
* security
* ...

See [config reference](https://github.com/ma-ha/easy-web-app/blob/master/API-Reference.md#config-reference) 


To run the example you must install config into this folder by

    npm install config js-yml

(you need to add `config`and  `js-yml` to your package.json)

After that you can run the example by:

    node index.js

## Code

By using the config the remaining code is rsimply

```javascript    
var gui = require( 'easy-web-app' ) 
var cfg = require( 'config' )
var mainPage = gui.init()
mainPage.addView( ... )
```

## Priorities
Since you can use the API, config, variables or the built in defaults, the priorities are:
1. variables
2. API 
3. config
4. built in defaults