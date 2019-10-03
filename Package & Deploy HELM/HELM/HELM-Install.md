# Helm

## Install helm
wget https://storage.googleapis.com/kubernetes-helm/helm-v2.14.1-linux-amd64.tar.gz
tar -xzvf helm-v2.14.1-linux-amd64.tar.gz
sudo mv linux-amd64/helm /usr/local/bin/helm

##Verify Helm Package
helm -v 
helm -h

## Initialize helm
kubectl create -f helm-rbac.yml
helm init --service-account helm-tiller

##Verify Where it deployed
kubectl get pods -n kube-system

##Serch for some application like 
helm search <Application Name>

##Install Application via Helm
helm install <Application Name>
- Each installation of a Helm chart to your cluster is referred to as a release.
- With Helm it’s easy to have multiple releases installed to a single cluster, each with its own specific configuration.

helm install --name <releasename> <ApplicationName>


