#!/bin/bash
set -e

# create random string
RANDOM_STRING=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | tr '[:upper:]' '[:lower:]' | head -n 1)
echo "My Random String - $RANDOM_STRING "

# it's important to set the AWS_REGION if not set. Change the default
DEFAULT_REGION="ap-south-1"
AWS_REGION="${AWS_REGION:-${DEFAULT_REGION}}"

export AWS_REGION

# create s3 bucket
if [ "$AWS_REGION" == "ap-south-1" ] ; then
    aws s3api create-bucket --bucket helm-${RANDOM_STRING} --region $AWS_REGION --create-bucket-configuration LocationConstraint=${AWS_REGION}
else
    echo "Please Specify the Correct Region"
fi

# install helm s3 plugin
helm plugin install https://github.com/hypnoglow/helm-s3.git
echo "Helm Plugin Insalled Successfully"

# initialize s3 bucket
helm s3 init s3://helm-${RANDOM_STRING}/charts

# add repository to helm
helm repo add anshul-charts s3://helm-${RANDOM_STRING}/charts
