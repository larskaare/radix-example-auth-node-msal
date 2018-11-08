# Omnia Radix Auth Example (OIDC)

Table of contents
<!-- TOC -->

- [Omnia Radix Auth Example (OIDC)](#omnia-radix-auth-example-oidc)
    - [Prerequisites](#prerequisites)
    - [Register application in AD](#register-application-in-ad)
    - [Configure the application](#configure-the-application)
        - [config.js](#configjs)
        - [Storing secrets outside code](#storing-secrets-outside-code)
    - [Build and run the application](#build-and-run-the-application)
    - [Docerizing the application](#docerizing-the-application)
        - [Building docker image for the application](#building-docker-image-for-the-application)
        - [Running the application in docker](#running-the-application-in-docker)
    - [Acknowledgements](#acknowledgements)

<!-- /TOC -->

## Prerequisites

To run this sample you will need the following:

* A O365 account
* Access to Azure tenant to register application

## Register application in AD

Create an application in your Azure tenant using [App registrations](https://aka.ms/registeredappsprod). Give the application a cool name, select account type (I selected "account in this organization directory only"). You can leave the "redirect URI" open. A few settings that you will have to define:

* `Authentication:Redirect URI` -> The url where authentication requests are returned. We use `http://localhost:3000/auth/openid/return` in the example when running the code on localhost. If the app is deployed else where, this should be updated in both Azure and in the app config.
* `Advanced setting:Implicit grant` -> Select `ID Tokens`
* `Certificates:Client secrets` > Create a secret for your application. Keep it out of source code!
* Make a note of **Application Id** assigned to your app, you'll need it soon.
* Make a note of the **Tenant id** as well. That will also become handy quite soon.

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

```node
$ npm install 
```

Source config (dependent on OS)

```node
$ source localconfig.env
```

Running the application

```node
$ npm start
```

## Docerizing the application

### Building docker image for the application

```docker
docker build -t <imagename> .
```

### Running the application in docker
A few considerations

* The application exposes things on port 3000. Use the -p to change if necessary
* The application need the needs a few environment variables to function properly. Check the section on [storing secrets outside code](storing-secrets-outside-code).

```docker
docker run -p 3000:3000  \
    --env IDENTITYMETADATA=<> \
    --env CLIENTID=<> \
    --env REDIRECTURL=<> \
    --env CLIENTSECRET=<> \
    --enc DESTROYSESSIONURL=<> \
    <imagename>
```

## Acknowledgements

Based on the example [AppModelv2-WebApp-OpenIDConnect-nodejs](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs)
