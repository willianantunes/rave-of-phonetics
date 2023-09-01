locals {
  app_name = "pgbouncer"
  namespace = "production"
  port = 5432
}

resource "kubernetes_secret" "pgbouncer_secret" {
  # https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/secret
  metadata {
    name = "${local.app_name}-secret"
    namespace = local.namespace
  }

  data = {
    "pgbouncer.ini" = <<PGINIT
# See mode details here: https://www.pgbouncer.org/config.html
[databases]
# Do not define an user here, otherwise public schema may be used.
* = host=10.51.0.3 port=5432

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = ${local.port}
user = postgres
auth_file = /etc/pgbouncer/userlist.txt
auth_type = md5
pool_mode = transaction
ignore_startup_parameters = options
# https://cloud.google.com/sql/docs/postgres/quotas#cloud-sql-for-postgresql-connection-limits
# 0.6 (db-f1-micro)	allows 25-6 connection concurrently, which is 19 actually!
# How many server connections to allow per user/database pair.
# We have 2 databases. PRD database has 2 schemas, 1 user for each
default_pool_size = 9
# Maximum number of client connections allowed.
# max_client_conn + (max pool_size * total databases * total users)
max_client_conn = 40
# Do not allow more than this many server connections per database (regardless of user).
# This considers the PgBouncer database that the client has connected to, not the PostgreSQL database of the outgoing connection.
max_db_connections = 19

############## TLS settings
server_tls_sslmode = require
  PGINIT

    "userlist.txt" = <<USERLIST
"role_raveofphonetics_prd" "md5b3a6ff00be61ce64693dfbc711a640d8"
  USERLIST
  }
  # The secret type. Defaults to Opaque
  # https://github.com/kubernetes/community/blob/c7151dd8dd7e487e96e5ce34c6a416bb3b037609/contributors/design-proposals/auth/secrets.md#proposed-design
  type = "Opaque"
}

resource "kubernetes_service" "pgbouncer_service" {
  metadata {
    namespace = local.namespace
    name = "${local.app_name}-service"
  }

  spec {
    port {
      name = "postgres"
      port = local.port
    }

    selector = {
      app = local.app_name
    }
  }
}

resource "kubernetes_deployment" "pgbouncer_deployment" {
  metadata {
    name = "${local.app_name}-deployment"
    namespace = local.namespace
    labels = {
      app = local.app_name
    }
  }

  spec {

    strategy {
      rolling_update {
        # Avoid Terminating and ContainerCreating at the same time
        max_unavailable = "0"
      }
    }

    selector {
      match_labels = {
        app = local.app_name
      }
    }

    template {
      metadata {
        labels = {
          app = local.app_name
        }
      }

      spec {
        container {
          image = "edoburu/pgbouncer:1.15.0"
          name  = local.app_name

          port {
            container_port = local.port
          }

          volume_mount {
            mount_path = "/etc/pgbouncer"
            name = "configfiles"
            read_only = true
          }

          resources {
            limits = {
              cpu    = "0.05"
              memory = "64Mi"
            }
            requests = {
              cpu    = "0.01"
              memory = "32Mi"
            }
          }

          liveness_probe {
            tcp_socket {
              port = local.port
            }
            initial_delay_seconds = 10
            period_seconds        = 60
          }
          lifecycle {
            pre_stop {
              exec {
                command = ["/bin/sh", "-c", "killall -INT pgbouncer && sleep 120"]
              }
            }
          }
          security_context {
            allow_privilege_escalation = false
            capabilities {
              drop = ["all"]
            }
          }
        }
        volume {
          name = "configfiles"
          secret {
            secret_name = kubernetes_secret.pgbouncer_secret.metadata[0].name
          }
        }
      }
    }
  }
}
