###### GKE Service Account

resource "google_service_account" "gke_dealer_sa" {
  account_id   = "custom-gke-dealer"
  display_name = "Custom GKE Dealer"
}

resource "google_storage_bucket_iam_binding" "gke_dealer_sa_container_registry_iam_binding" {
  # This binding will allow the SA to check out images that are saved in this bucket
  bucket = var.container_registry_bucket
  role = "roles/storage.objectViewer"
  members = [
    "serviceAccount:${google_service_account.gke_dealer_sa.email}",
  ]
}

resource "google_project_iam_binding" "gke_dealer_sa_gke_logging_writer" {

  role = "roles/logging.logWriter"

  members = [
    "serviceAccount:${google_service_account.gke_dealer_sa.email}",
  ]
}

resource "google_project_iam_binding" "gke_dealer_sa_gke_monitoring_metricWriter" {

  role = "roles/monitoring.metricWriter"

  members = [
    "serviceAccount:${google_service_account.gke_dealer_sa.email}",
  ]
}

resource "google_project_iam_binding" "gke_dealer_sa_gke_stackdriver_resourceMetada_writer" {

  role = "roles/stackdriver.resourceMetadata.writer"

  members = [
    "serviceAccount:${google_service_account.gke_dealer_sa.email}",
  ]
}

###### Azure DevOps Service Account

resource "google_service_account" "ado_dealer_sa" {
  account_id   = "custom-azure-devops-dealer"
  display_name = "Custom Azure DevOps Dealer"
  # gcloud iam service-accounts keys create ./custom-azure-devops-dealer.json --iam-account custom-azure-devops-dealer@active-triode-274813.iam.gserviceaccount.com
}

resource "google_storage_bucket_iam_binding" "ado_dealer_sa_bucket_admin" {
  bucket = var.container_registry_bucket
  role = "roles/storage.admin"
  members = [
    "serviceAccount:${google_service_account.ado_dealer_sa.email}",
  ]
}

resource "google_project_iam_binding" "ado_dealer_sa_gke" {
  # gcloud projects add-iam-policy-binding active-triode-274813 --member=serviceAccount:custom-azure-devops-dealer@active-triode-274813.iam.gserviceaccount.com --role=roles/container.developer
  role = var.gke_cicd_role_id

  members = [
    "serviceAccount:${google_service_account.ado_dealer_sa.email}",
  ]
}


//
//resource "google_service_account_iam_binding" "admin-account-iam" {
//  service_account_id = google_service_account.sa.name
//  role               = "roles/iam.serviceAccountUser"
//  members = [
//    "user:jane@example.com",
//  ]
//}