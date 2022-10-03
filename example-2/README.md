# herb

> Design Manual for Roads and Bridges

# Code Analysis

[![Quality Gate Status](https://sonarqube.nomensa.agency/api/project_badges/measure?project=pid352&metric=alert_status)](https://sonarqube.nomensa.agency/dashboard?id=pid352)

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

Once it's up and running you should be able visit http://localhost:3000/dmrb

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Environment Variables

You'll probably want to set up environment variables either with a .env file or by setting them up in your environment somehow.
The required vars for your local environment are as follow;

```
API_ENDPOINT=http://herb.nomensa.xyz/uat
API_BROWSER_ENDPOINT=http://herb.nomensa.xyz/uat
CMS_API_URL=https://content-uat.sfh.nomservices.co.uk/

GTM_ID=GTM-PFKTS5W
GTM_AUTH=9lP8bdeVHvIr-Y4htd1qXw
GTM_PREVIEW=env-3
```

Currently the CMS is being hosted at these three server addresses, you can
choose whichever one you want to use:

TEST - https://content-test.sfh.nomservices.co.uk/
DEV  - https://content-test.sfh.nomservices.co.uk/
UAT  - https://content-uat.sfh.nomservices.co.uk/
PROD - https://content.sfh.nomservices.co.uk/

## TEST DATA
IF you are ever having to make changes to the CMS and you change your env vars to point at your local, you'll want to add a static doc id into the API call in the /search/_nodeid.vue asynData call. A good url to try for document ids is here:
https://herb.nomensa.xyz/uat/publication-summaries/latest

You should get a nice response of juicy document responses which will aid in stopping the page 404ing.
![Data looking at a lot of Data!](http://www.hulu.com/start?cmp=7313&cmc=7313&utm_source=GIPHY&utm_medium=social&utm_content=&utm_campaign=inhouse "Data being Data")

## Storybook

```
yarn storybook
```
