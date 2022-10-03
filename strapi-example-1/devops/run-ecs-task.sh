#!/bin/bash
# Author: Sam Harris
# Updated: 22/07/2020
# Description:
#   Script to run ecs tasks and pull logs for scrutiny.
#   Allowing deployment commands to be run from within the infrastructure avoiding public access issues.

# set some params from command args
action=$1
taskdef=$2
cluster=$3
region=$4
reference=$5
env=$6
backupBucket=$7


overrides='{ "containerOverrides": [ { "name": "strapi", "command": [ "scripts/migrate.sh '$action' '$reference' '$env' '$backupBucket'" ] } ] }'

# launch the task
echo "$(date) - Launching ecs task with definition $taskdef..."
tasks=`aws ecs run-task --cluster $cluster --task-definition $taskdef --region $region --query 'tasks[*].[taskArn, taskDefinitionArn]' --output text --overrides "$overrides"`

# get task def arn
unset IFS
read -r -a rawarray <<< "$tasks"
taskdefinitionArn=${rawarray[1]}
taskidArn=${rawarray[0]}

# get task id
IFS='/'
read -ra array <<< "${rawarray[0]}"
taskid=${array[2]}
unset IFS

echo "$(date) - Task created with taskid $taskid ($taskidArn).."

# wait for task to complete
until aws ecs describe-tasks --cluster $cluster --region $region --tasks $taskidArn --query 'tasks[*].lastStatus' --output text | grep -q 'STOPPED'
do
    echo "$(date) - Waiting for task to finish..."
    sleep 15
done

# once task is complete pull logs from it for inspection
tasklog=`ecs-cli logs --task-id $taskid --task-def $taskdefinitionArn --region $region --cluster $cluster`

# match logs against expected results
case $tasklog in
*'upload: '*' to s3://'*)
    echo "$(date) - Operation Successful"
    exit 0
;;
*'Successfully restored'*)
    echo "$(date) - Operation Successful"
    exit 0
;;
*)
    echo "$(date) - Exception Detected, dumping log..."
    printf "$tasklog"
    exit 255
;;
esac
