## Content via MediaWiki API
Page with one view containing Wikipedia main page.

The language can be switched by pressing the flags.

Also a help button is configured to show the view configuration 
 
# Run example
1. You need to [get a local copy of the easy-web gui](https://github.com/ma-ha/easy-web-gui).
2. in this directory simply run: `nodejs index.js` 

# Hint

If you run your own MediaWiki, the view config is a little bit tricky.

This works for me:

  wikiPg.addView(
      {
        id: 'Wiki',
        title: 'Documentation',
        height: '750px',
        type: 'pong-mediawiki',
        resourceURL : 'https://my-server.de/my-own-wiki/'   // that's where the api is
      },
      {
        page: {
          DE: 'Hauptseite', // runs in "German" for some reasons
          EN: 'Hauptseite'  // use "Main_Page" instead
        },
        wikiRef: '/my-own-wiki/index.php/'
      }
    )

The `wikiRef` string will be deleted from the internal page links. 
The remaining string will send to the MediaWiki API to replace the page.

# Query parameter `page`

Deep links from other views or pages can be done using the `page`query parameter.
Start the example and try out e.g. http://localhost:8888/index.html?page=DNA