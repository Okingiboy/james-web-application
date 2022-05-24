To authenticate and authorization users on pages you need to tree easy steps:

1. Enable the security module using `enableSecurity()`,
2. implement an `authenticate(user,password)` function and
3. implement an `authorize(user,page)` function.
4. Checks the CSRF header token in the REST API method

`enableSecurity()` also take a parameter object:

```javascript
var gui =  require( 'easy-web-app' ) 
// ...
var secParams = {
  loginPage     : 'userwelcome', // page shown after successful login
  needLoginPage : 'loginform'    // redirects there  if not logged in, default is "main"
}
gui.enableSecurity( secParams )
// ...
```

__Remark__: Please notice, that the "secret page" in the example
is also not visible in the menu, if not logged in. 
The pull-down menu is also only visible for "authorized" users.

__Optional__: In HA set up, you need also implement 
* `createToken(userId){ ... return token }` and  
* `getUserIdForToken(token){ ... return userId }`
* `gui.deleteUserIdForToken(token)`
functions, typically using a distributed cache.