# Omnia Radix Auth Example (OIDC)

## Prerequisites

To run this sample you will need the following:

* A O365 account
* Access to Azure tenant to register application

## Register application in AD

- Copy down the **Application Id** assigned to your app, you'll need it soon.
- Add the **Web** platform for your app.
- Enter the correct **Redirect URI**. The redirect uri indicates to Azure AD where authentication responses should be directed - the default for this sample is `http://localhost:3000/auth/openid/return'`.
- Add a new **Application secret** by clicking the **Generate new password** button. This value will not be displayed again, so save the result in a temporary location as you'll need it in the next step.

## Run applicatiomn


From the project root directory, run the command:

* `$ npm install`   


## Configure the application

Provide the parameters in `exports.creds` in config.js as instructed.

* Update `<tenant_name>` in `exports.identityMetadata` with the Azure AD tenant name of the format \*.onmicrosoft.com.
* Update `exports.clientID` with the Application Id noted from app registration.
* Update `exports.clientSecret` with the Application secret noted from app registration.
* Update `exports.redirectUrl` with the Redirect URI noted from app registration.

**Optional configuration for production apps:**

* Update `exports.destroySessionUrl` in config.js, if you want to use a different `post_logout_redirect_uri`.

* Set `exports.useMongoDBSessionStore` in config.js to true, if you want to use use mongoDB or other [compatible session stores](https://github.com/expressjs/session#compatible-session-stores).
The default session store in this sample is `express-session`. Note that the default session store is not suitable for production.

* Update `exports.databaseUri`, if you want to use mongoDB session store and a different database URI.

* Update `exports.mongoDBSessionMaxAge`. Here you can specify how long you want to keep a session in mongoDB. The unit is second(s).

## Build and run the application

```
$ node app.js 
```
or if you have installed bunyan with `npm install -g bunyan`
```
$ node app.js | bunyan
```

### Acknowledgements

Based on the example [AppModelv2-WebApp-OpenIDConnect-nodejs](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs)

