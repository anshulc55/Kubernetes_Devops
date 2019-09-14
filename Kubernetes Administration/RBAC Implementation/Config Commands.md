## Retrieve keys from kops

aws s3 sync s3://kops-bucket-a87654/level360degree.uk/pki/private/ca/ ca-key
aws s3 sync s3://kops-bucket-a87654/level360degree.uk/pki/issued/ca/ ca-crt
mv ca-key/*.key ca.key
mv ca-crt/*.crt ca.crt

## Create new user

sudo apt install openssl
openssl genrsa -out peter.pem 2048
openssl req -new -key peter.pem -out peter-csr.pem -subj "/CN=peter/O=myteam/"
openssl x509 -req -in peter-csr.pem -CA ca.crt -CAkey ca.key -CAcreateserial -out peter.crt -days 10000


## add new context

kubectl config set-credentials peter --client-certificate=peter.crt --client-key=peter.pem
kubectl config set-context peter --cluster=level360degree.uk --user peter