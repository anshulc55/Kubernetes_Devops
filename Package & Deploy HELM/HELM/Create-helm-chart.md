##Create HELM Chart
- helm create <chart-name>
- Name of the chart provided here will be the name of the directory where the chart is created and stored.

```
Let's understand the relevance of these files and folders created for us:

Chart.yaml: This is the main file that contains the description of our chart
values.yaml: this is the file that contains the default values for our chart
templates: This is the directory where Kubernetes resources are defined as templates
charts: This is an optional directory that may contain sub-charts
```

##HELM Commands for Chart
- helm lint <chart-full-path>
#This is a simple command that takes the path to a chart and runs a battery of tests to ensure that the chart is well-formed

- helm template <chart-full-path>
#This will generate all templates with variables without a Tiller Server, for quick feedback, and show the output. Now that we know everything is OK, we can deploy the chart:


- helm install --name <release-name> <chart-full-path>
#Run this command to install the chart into the Kubernetes cluster:

- helm ls --all
#We would like to see which charts are installed as what release.

- helm upgrade <release-name> <chart-full-path>
#This command helps us to upgrade a release to a specified or current version of the chart or configuration:

- helm rollback <release-name> <release-version>
#This is the command to rollback a release to the previous version:

- helm delete --purge <release-name>
#We can use this command to delete a release from Kubernetes:



