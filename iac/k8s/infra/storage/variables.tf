variable "persistent_volume_claim_name" {
  type = string
}

variable "storage_request" {
  type = string
  default = "10Gi"
}
