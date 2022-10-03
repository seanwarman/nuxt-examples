#!/usr/bin/env bash
cd "$(dirname "$0")/.."

# create some sql to store some devops keypairs
echo "CREATE TABLE IF NOT EXISTS \`devops\` (\`param\` varchar(250) NOT NULL default '' PRIMARY KEY, \`value\` varchar(250) NOT NULL default '');
REPLACE INTO devops (\`param\`, \`value\`) VALUES ('GITLAB_SHA', '$GITLAB_SHA');
REPLACE INTO devops (\`param\`, \`value\`) VALUES ('GITLAB_TAG', '$GITLAB_TAG');" > /tmp/devops.sql

# run generated sql against database
mysql -h $DATABASE_HOST -u $DATABASE_USERNAME -p$DATABASE_PASSWORD $DATABASE_NAME < /tmp/devops.sql

export PROMOTE_UAT_URL="https://herb-uat.nomensa.xyz/big-red-button/pipeline?token=$TRIGGER_TOKEN&ref=$GITLAB_TAG&variables[ACTION]=promote-uat"
export RESTORE_UAT_URL="https://herb-uat.nomensa.xyz/big-red-button/pipeline?token=$TRIGGER_TOKEN&ref=$GITLAB_TAG&variables[ACTION]=restore-uat"


node_modules/.bin/strapi configuration:restore -f sync/core.json
yarn start