
var gui = require( '../../' )     // stand alone: replace with:  require( 'easy-web-app' ) 

// Initialize the framework and the default page
var page = gui.init()
page.header.logoText = 'Content Demo'

page.header.modules.push( 
  { 
    'id': 'LangSel' 
    ,'type': 'i18n'
    ,'param': { 
         'langList': [ 
                       'KO'
                      ,'IT'
                      ,'RU'
                      ,'JP'
                      ,'TR'
                      ,'DE' 
                      ,'EN'
                      ,'FA'
         ] 
    }
  }
)
  
// create aIO view on page
gui.addView( 
  { 
    'id':'WikiView'
     ,'title':'WIKI: ${page}'
     ,'type':'pong-mediawiki'
     ,"resourceURL": "http://${lang}.wikipedia.org/w/"      
     ,"actions":[
         {
           "type":"pong-help"
           ,"param":{ "showConfig":"WikiView" }
         }
     ]
  },
  {
    "page": {
      'US':"Main_Page"
      ,"IT": "Pagina_principale"
      ,'RU':'Заглавная_страница'
      ,'JP':'メインページ'
      ,"DE": "Wikipedia:Hauptseite"
      ,'KO':'위키백과:대문'
      ,'TR':'Ana_Sayfa'
      ,'FA':'صفحهٔ_اصلی'
    }
    ,"wikiRef": "/wiki/"
  }
)
  