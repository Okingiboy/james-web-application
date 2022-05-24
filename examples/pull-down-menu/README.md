Create a pull-down menu and add pages to this menu.

Create the menu with `id='testMenu'` and add a page:

    gui.addPullDownMenu( 'testMenu', 'Menu' )
    gui.addPage( 'testMenu/secondpage', 'Page 2', { id:'Page 2' } )

This page will not be shown in the menu tabs.

Remarks: 
1. If you need more than one pull-down menu, you need to provide 
a position via CSS.
2. Authorization check is currently only done on the complete menu, not for single items.