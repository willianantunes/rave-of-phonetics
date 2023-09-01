######
###### NAMESPACES

resource "kubernetes_namespace" "production" {
  metadata {
    name = "production"
  }
}

resource "kubernetes_namespace" "development" {
  metadata {
    name = "development"
  }
}

# If you'd like to test your network, you can run this machine to test some connections out:
# kubectl -n production run --rm=true -i -t tmp-container-to-run-curl --image=radial/busyboxplus:curl --restart=Never -- sh

######
###### APPS

module "storage_for_elastic_search" {
  source = "./infra/storage"

  persistent_volume_claim_name = "elastic-search-pvc"
}

module "pgbouncer" {
  source = "./infra/pgbouncer"

}

module "app_rave_of_phonetics_backend" {
  source = "./apps/rave-of-phonetics-backend"
}

module "ingress" {
  source = "./infra/ingress"

  ingress_name = "all-apps"
  global_static_ip_name = var.ingress_ipv6_address
  pre_shared_certs = var.certs_managers
}

//module "ingress_ipv4" {
//  source = "./infra/ingress"
//
//  ingress_name = "all-apps-ipv4"
//  global_static_ip_name = var.ingress_ipv4_address
//  pre_shared_certs = var.certs_managers
//}
