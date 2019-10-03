#AWS CLI Credentials must be Set on Machine
#Verify
aws sts get-caller-identity

#Create Chart in S3 Bucket
Execute Shell Script
./s3-helm-repo.sh

#List all Repos
helm repo list

#Export AWS Resion in Variable
export AWS_REGION=ap-south-1

#Package your Charts
helm package hello-world

#Upload your helm package
helm s3 push <tar-file> <s3chart-name>

#Search for your repository
helm search <repo-name>

