terraform {
  backend "remote" {
    organization = "rave-of-phonetics"

    workspaces {
      name = "gce"
    }
  }
}

######
###### CLOUD PROVIDERS

provider "google" {
  project = var.project
  credentials = file(var.credentials_file)
  region = var.region
  zone = var.zone
}

provider "google-beta" {
  project = var.project
  credentials = file(var.credentials_file)
  region = var.region
  zone = var.zone
}

######
###### BASIC DATA SOURCES

data "google_client_config" "provider" {}

data "google_compute_network" "default-network" {
  name = "default"
}

######
###### DEFINITIONS GCE

module "buckets" {
  source = "./buckets"
}

module "addresses" {
  source = "./addresses"
}

module "certificates" {
  source = "./certificates"
}

module "gke-instance" {
  source = "./gke"

  gke_name = "all-stuff"
  service_account_email = module.iam.gke_dealer_sa_email

  # After you create your cluster, you can do:
  # - gcloud container clusters list
  # And then use the cluster name to set your context:
  # - gcloud container clusters get-credentials [CLUSTER_NAME]
  # Your can check it through the following commands:
  # - kubectl config current-context
  # - kubectl config get-contexts
  # - kubectl config delete-context gke_active-triode-274813_us-central1-a_all-stuff-prd-default-cluster
}

module "iam" {
  source = "./iam"

  container_registry_bucket = module.buckets.container_registry_bucket_name
  gke_cicd_role_id = module.gke-instance.role_id_for_cicd
}

######
###### ABSTRACT PROVIDERS

provider "kubernetes" {
  # https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/using_gke_with_terraform
  host = "https://${module.gke-instance.cluster_endpoint}"
  token = data.google_client_config.provider.access_token
  cluster_ca_certificate = base64decode(module.gke-instance.cluster_ca_certificate,)
}

######
###### K8S DEFINITIONS

module "k8s_definitions" {
  source = "./k8s"

  certs_managers = "${module.certificates.rop_cert_manager_name}"
  ingress_ipv6_address = module.addresses.gke_ingress_ipv6_name
  ingress_ipv4_address = module.addresses.gke_ingress_ipv4_name
}
