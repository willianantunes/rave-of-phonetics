######
###### GKE
# https://github.com/GoogleCloudPlatform/terraform-google-examples
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/container_cluster
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/container_node_pool

# To work with GKE you need a CLUSTER and a NODE POOL
# First I will the cluster and then the node pool with a custom setup matching my expectation
resource "google_container_cluster" "gke_cluster" {
  name = "${var.gke_name}-prd-default-cluster"

  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count = 1
  # https://cloud.google.com/kubernetes-engine/docs/how-to/alias-ips
  # Determines whether alias IPs or routes will be used for pod IPs in the cluster.
  # Options are VPC_NATIVE or ROUTES. VPC_NATIVE enables IP aliasing, and requires the ip_allocation_policy block to be defined.
  # By default when this field is unspecified, GKE will create a ROUTES-based cluster.
  networking_mode = "VPC_NATIVE"
  ip_allocation_policy {
    # The IP address range for the cluster pod IPs.
    # Set to blank to have a range chosen with the default size.
    # Set to /netmask (e.g. /14) to have a range chosen with a specific netmask.
    cluster_ipv4_cidr_block = ""
    # The IP address range of the services IPs in this cluster.
    # Set to blank to have a range chosen with the default size.
    # Set to /netmask (e.g. /14) to have a range chosen with a specific netmask.
    services_ipv4_cidr_block = ""
  }
}

resource "google_container_node_pool" "gke_cluster_node_pool" {
  name = "${var.gke_name}-prd-default-node-pool"
  location = "us-central1-a"
  cluster = google_container_cluster.gke_cluster.name
  node_count = 1

  node_config {
    preemptible = false
    # https://cloud.google.com/sdk/gcloud/reference/container/clusters/create#--machine-type
    # gcloud compute machine-types list | grep standard | grep us-central1-a
    # n1-standard-1 / 1 / 3.75
    machine_type = "n1-standard-1"
    disk_size_gb = "20"
    # Type of the disk attached to each node (e.g. 'pd-standard', 'pd-balanced' or 'pd-ssd').
    # If unspecified, the default disk type is 'pd-standard'
    disk_type = "pd-ssd"
    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    service_account = var.service_account_email
    # Scopes that are used by NAP when creating node pools.
    # Use the "https://www.googleapis.com/auth/cloud-platform" scope to grant access to all APIs.
    # It is recommended that you set service_account to a non-default service account and grant IAM roles to
    # that service account for only the resources that it needs.
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}

//resource "google_container_node_pool" "gke_cluster_node_pool_preemptible" {
//  name = "${var.gke_name}-prd-node-pool-preemptible"
//  location = "us-central1-a"
//  cluster = google_container_cluster.gke_cluster.name
//  node_count = 1
//
//  node_config {
//    preemptible = true
//    # https://cloud.google.com/sdk/gcloud/reference/container/clusters/create#--machine-type
//    # gcloud compute machine-types list | grep standard | grep us-central1-a
//    # n1-standard-1 / 1 / 3.75
//    machine_type = "n1-standard-1"
//    disk_size_gb = "10"
//    # Type of the disk attached to each node (e.g. 'pd-standard', 'pd-balanced' or 'pd-ssd').
//    # If unspecified, the default disk type is 'pd-standard'
//    disk_type = "pd-ssd"
//    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
//    service_account = var.service_account_email
//    # Scopes that are used by NAP when creating node pools.
//    # Use the "https://www.googleapis.com/auth/cloud-platform" scope to grant access to all APIs.
//    # It is recommended that you set service_account to a non-default service account and grant IAM roles to
//    # that service account for only the resources that it needs.
//    oauth_scopes = [
//      "https://www.googleapis.com/auth/cloud-platform"
//    ]
//  }
//}

resource "google_project_iam_custom_role" "custom-gke-role-for-pipeline" {
  role_id = "custom_gke_for_cicd"
  title = "Custom GKE role for CI/CD"
  description = "Used by CI/CD service accounts to deal with GKE"
  permissions = [
    "container.clusters.get",
    "container.clusters.getCredentials",
    "container.deployments.get",
    "container.deployments.create",
    "container.deployments.update",
  ]
}




