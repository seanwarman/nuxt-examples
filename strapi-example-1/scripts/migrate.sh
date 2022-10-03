#!/bin/bash
AWS_ACCESS_KEY_ID=$BACKUP_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$BACKUP_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION=$BACKUP_DEFAULT_REGION

action=$1
reference=$2
env=$3
backupBucket=$4

current_sha=`mysql -h $DATABASE_HOST -u $DATABASE_USERNAME -p$DATABASE_PASSWORD $DATABASE_NAME -e "SELECT value FROM devops WHERE param='GITLAB_SHA';" --skip-column-names`

if [[ $reference == $current_sha ]] 
then
    if [[ $action == "backup" ]]
    then
        mysqldump --compress --add-drop-table --routines --events  --comments --extended-insert -h $DATABASE_HOST -u $DATABASE_USERNAME -p$DATABASE_PASSWORD $DATABASE_NAME > /tmp/$reference.sql
        aws s3 cp /tmp/$reference.sql s3://$backupBucket/$env/$reference/sql/
        aws s3 sync s3://$AWS_S3_BUCKET/ s3://$backupBucket/$env/$reference/files/
        rm -f /tmp/$reference.sql
    elif [[ $action == "restore" ]]
    then
        aws s3 cp s3://$backupBucket/$env/$reference/sql/$reference.sql /tmp/$reference.sql
        aws s3 rm --recursive s3://$AWS_S3_BUCKET/.
        aws s3 sync --acl public-read s3://$backupBucket/$env/$reference/files/ s3://$AWS_S3_BUCKET/

        if [[ $? == 0 ]]
        then
            echo "Successfully restored"
        else
            echo "Error during restore"
        fi
        
        if [[ $env == "TEST" ]] 
        then
            sed -i "s;sfh-content-test.s3.eu-west-2.amazonaws.com;$AWS_S3_BUCKET.s3.eu-west-2.amazonaws.com;g" /tmp/$reference.sql
        elif [[ $env == "UAT" ]]
        then
            sed -i "s;sfh-content-uat.s3.eu-west-2.amazonaws.com;$AWS_S3_BUCKET.s3.eu-west-2.amazonaws.com;g" /tmp/$reference.sql
        elif [[ $env == "PROD" ]]
        then
            sed -i "s;sfh-content-prod.s3.eu-west-2.amazonaws.com;$AWS_S3_BUCKET.s3.eu-west-2.amazonaws.com;g" /tmp/$reference.sql
        fi

        mysql -h $DATABASE_HOST -u $DATABASE_USERNAME -p$DATABASE_PASSWORD $DATABASE_NAME < /tmp/$reference.sql

        rm -f /tmp/$reference.sql
    else 
        echo "Usage: ./migrate.sh [backup/restore] environment"
        fi
else
    echo "Environment does not match the commit sha you are using to perform this operation."
fi