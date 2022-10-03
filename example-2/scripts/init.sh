#!/usr/bin/env bash

# change to app folder
cd /app

# # replace API URL's using ENV's 
find .nuxt/. -regex ".*\.\(js\)" -exec sed -i 's;https://api-url.nomensa.dummy;'$API_ENDPOINT';g' {} \;
find .nuxt/. -regex ".*\.\(js\)" -exec sed -i 's;https://api-browser-url.nomensa.dummy;'$API_BROWSER_ENDPOINT';g' {} \;

find .nuxt/. -regex ".*\.\(js\)" -exec sed -i 's;https://cms-api-url.nomensa.dummy;'$CMS_API_URL';g' {} \;
find .nuxt/. -regex ".*\.\(js\)" -exec sed -i 's;https://cms-api-url-browser.nomensa.dummy;'$CMS_API_URL_BROWSER';g' {} \;

yarn start
