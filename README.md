 <!-- markdownlint-disable MD014 MD007-->

# 1. Omnia Radix Auth Example (OIDC)

[![Known Vulnerabilities](https://snyk.io/test/github/larskaare/radix-example-auth-node-msal/badge.svg?targetFile=package.json)](https://snyk.io/test/github/larskaare/radix-example-auth-node-msal?targetFile=package.json)

Table of contents::
<!-- TOC -->

- [1. Omnia Radix Auth Example (OIDC)](#1-omnia-radix-auth-example-oidc)
    - [1.1. Prerequisites](#11-prerequisites)
    - [1.2. Register application in AD](#12-register-application-in-ad)
    - [1.3. Configure the application](#13-configure-the-application)
        - [1.3.1. config.js](#131-configjs)
        - [1.3.2. Storing secrets outside code](#132-storing-secrets-outside-code)
    - [1.4. Build, test and run the application](#14-build-test-and-run-the-application)
        - [1.4.1. Using Grunt to run tasks](#141-using-grunt-to-run-tasks)
    - [1.5. Docerizing the application](#15-docerizing-the-application)
        - [1.5.1. Building docker image for the application](#151-building-docker-image-for-the-application)
        - [1.5.2. Running the application in docker](#152-running-the-application-in-docker)
    - [1.6. Deploying to Omnia Radix](#16-deploying-to-omnia-radix)
    - [1.7. Acknowledgements](#17-acknowledgements)

<!-- /TOC -->

## 1.1. Prerequisites

To run this sample you will need the following:

- A O365 account
- Access to Azure tenant to register application

## 1.2. Register application in AD

Create an application in your Azure tenant using [App registrations](https://aka.ms/registeredappsprod). Give the application a cool name, select account type (I selected "account in this organization directory only"). You can leave the "redirect URI" open. A few settings that you will have to define:

- `Authentication:Redirect URI` -> The url where authentication requests are returned. We use `http://localhost:3000/auth/openid/return` in the example when running the code on localhost. If the app is deployed else where, this should be updated in both Azure and in the app config.
- `Advanced setting:Implicit grant` -> Select `ID Tokens`
- `Certificates:Client secrets` > Create a secret for your application. Keep it out of source code!
- Make a note of **Application Id** assigned to your app, you'll need it soon.
- Make a note of the **Tenant id** as well. That will also become handy quite soon.

## 1.3. Configure the application

### 1.3.1. config.js

Provide the parameters in `exports.creds` in config.js as instructed.

- Update `<tenant_name>` in `exports.identityMetadata` with the Azure AD tenant name of the format \*.onmicrosoft.com.
- Update `exports.clientID` with the Application Id noted from app registration.
- Update `exports.clientSecret` with the Application secret noted from app registration.
- Update `exports.redirectUrl` with the Redirect URI noted from app registration.

### 1.3.2. Storing secrets outside code

Secrets and private information must be kept outside version control. The application supports reading part of the configuration from environment variables (takes precedence over config.js)

Example localconfig.env

```bash
export IDENTITYMETADATA=""
export CLIENTID=""
export REDIRECTURL=""
export CLIENTSECRET=""
export DESTROYSESSIONURL=""
```

Remember to escape special chars like $ in the environment variables (like secrets)

**Optional configuration for production apps:**

- Update `exports.destroySessionUrl` in config.js, if you want to use a different `post_logout_redirect_uri`.

## 1.4. Build, test and run the application

Remember to install dependencies before you run the application

```node
$ npm install
```

Source config (dependent on OS)

```node
$ source localconfig.env
```

Linting the application

```node
$ npm run lint
```

Testing the application

```node
$ npm test
```

Running the application

```node
$ npm start
```

### 1.4.1. Using Grunt to run tasks

Grunt is of several tasks runners available in the Node eco-system. To use Grunt please install the cli.

```node
npm install -g grunt-cli
```

Using grunt to watch for changes and then run linting and tests

```node
$ grunt
```

Examine the ```Grunfile.js``` for other tasks that can be executed using Grunt. 

## 1.5. Docerizing the application

### 1.5.1. Building docker image for the application

```docker
docker build -t <imagename> .
```

### 1.5.2. Running the application in docker

A few considerations

- The application exposes things on port 3000. Use the -p to change if necessary
- The application need the needs a few environment variables to function properly. Check the section on [storing secrets outside code](storing-secrets-outside-code).

```docker
docker run -p 3000:3000  \
    --env IDENTITYMETADATA=<> \
    --env CLIENTID=<> \
    --env REDIRECTURL=<> \
    --env CLIENTSECRET=<> \
    --enc DESTROYSESSIONURL=<> \
    <imagename>
```

## 1.6. Deploying to Omnia Radix

To deploy the application to Omnia Radix you need access to the DevOps platform. If you can open the [Web console](https://www.dev.radix.equinor.com/) you should be ok with this. In the web console you'll find the proper instruction for how to get started with defining the application for Radix deployment.

A few important remarks may be in order:

- The ```radixconfig.yaml``` is the declarative description of what services you want goin in Radix for your application. Radix will ```only``` use the radixconfig.yaml from the master branch!
- When authenticating with Azure AD, remember to define the proper ```redirect url's``` both in the components environment variables as well as in the Azure AD App registration.
- Radix uses ```AD groups``` to govern access to developing your application. At the time of writing you'll need the guid for these, not the name.

## 1.7. Acknowledgements

Based on the example [AppModelv2-WebApp-OpenIDConnect-nodejs](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs)
