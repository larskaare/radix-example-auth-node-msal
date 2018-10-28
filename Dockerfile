#
# -- Base node image with app
#
FROM node:10-alpine AS base
RUN mkdir -p /usr/src/app/{src,config,routes,views}
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY src src
COPY config config
COPY routes routes
COPY views views

#
# -- Dependencies
#
FROM base as dependencies
WORKDIR /usr/src/app
RUN npm install --only=production
RUN cp -R node_modules node_modules_production
RUN npm install

#
# Running test 
#
FROM dependencies as test
WORKDIR /usr/src/app
# COPY test test
# COPY src src
# RUN ["npm","test"]
COPY .eslintrc.js .eslintignore ./
RUN npm run lint

#
# Release image
#
FROM base as release
WORKDIR /usr/src/app
# COPY src src
COPY --from=dependencies /usr/src/app/node_modules_production ./node_modules
EXPOSE 3000
CMD [ "npm", "start" ]