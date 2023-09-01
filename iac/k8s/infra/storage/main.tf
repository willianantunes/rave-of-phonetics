locals {
  namespace = "production"
}

resource "kubernetes_persistent_volume_claim" "default" {
  # module.k8s_definitions.module.storage_for_elastic_search.kubernetes_persistent_volume_claim.example
  # https://cloud.google.com/kubernetes-engine/docs/concepts/persistent-volumes
  # https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/persistent_volume_claim
  metadata {
    name = var.persistent_volume_claim_name
    namespace = local.namespace
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = var.storage_request
      }
    }
  }
}
