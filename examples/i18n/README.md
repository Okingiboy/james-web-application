## i18n -- internationalization
Page with empty view, but enough text to offer a translation EN<>DE

With v0.6 the i18n service is now built in the node package. 
So all you need is to call the API:

	gui.addLang( CODE, TRANSLATIONS ) 
	
 
# Run example
1. You need to [get a local copy of the easy-web gui](https://github.com/ma-ha/easy-web-gui).
2. in this directory simply run: `nodejs index.js` 

# Security
`LangSel`is a header module and needs to be authorized, if you enable security.
