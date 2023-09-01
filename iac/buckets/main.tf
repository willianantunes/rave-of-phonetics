resource "google_storage_bucket" "container_registry_bucket" {
  # https://www.terraform.io/docs/cli/commands/import.html
  # This resource has been created through web console.
  # In order to import its state, I had to execute the following:
  # terraform import google_storage_bucket.container_registry_bucket artifacts.active-triode-274813.appspot.com
  # Then I moved it to a module. After the setup, I execute the following command:
  # terraform state mv 'google_storage_bucket.container_registry_bucket' 'module.buckets.google_storage_bucket.container_registry_bucket'
  name = "artifacts.active-triode-274813.appspot.com"
  # When deleting a bucket, this boolean option will delete all contained objects.
  # If you try to delete a bucket that contains objects, Terraform will fail that run.
  force_destroy = false
}
