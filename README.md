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

## Configure the application

### config.js
Provide the parameters in `exports.creds` in config.js as instructed.

* Update `<tenant_name>` in `exports.identityMetadata` with the Azure AD tenant name of the format \*.onmicrosoft.com.
* Update `exports.clientID` with the Application Id noted from app registration.
* Update `exports.clientSecret` with the Application secret noted from app registration.
* Update `exports.redirectUrl` with the Redirect URI noted from app registration.

### Storing secrets outside code
Secrets and private information must be kept outside version control. The application supports reading part of the configuration from environment variables (takes precedence over config.js)

Example localconfig.env
```
export IDENTITYMETADATA=""
export CLIENTID=""
export REDIRECTURL=""
export CLIENTSECRET=""
export DESTROYSESSIONURL=""
```
Remember to escape special chars like $ in the environment variables (like secrets)

**Optional configuration for production apps:**

* Update `exports.destroySessionUrl` in config.js, if you want to use a different `post_logout_redirect_uri`.

## Build and run the application

Remember to install dependencies before you run the application
```
$ npm install 
```
Source config (dependent on OS)
```
$ source localconfig.env
```
Running the application
```
$ npm start
```
and to get formatted logs, install bunyan with `npm install -g bunyan`
```
$ npm start | bunyan
```

### Acknowledgements

Based on the example [AppModelv2-WebApp-OpenIDConnect-nodejs](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs)

