locals {
  namespace = "production"
}

resource "kubernetes_ingress" "default" {
  metadata {
    name = "${var.ingress_name}-ingress"
    namespace = local.namespace

    annotations = {
      "ingress.gcp.kubernetes.io/pre-shared-cert"   = var.pre_shared_certs
      "kubernetes.io/ingress.global-static-ip-name" = var.global_static_ip_name
    }
  }

  spec {
    rule {
      host = "api.raveofphonetics.com"
      http {
        path {
          backend {
            service_name = "rave-of-phonetics-backend-np-service"
            service_port = 8000
          }
        }
      }
    }
  }
}
