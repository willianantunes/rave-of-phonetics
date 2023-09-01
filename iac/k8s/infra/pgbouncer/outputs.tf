output "pgbouncer_service_ip" {
  value = kubernetes_service.pgbouncer_service.spec[0].cluster_ip
}

output "pgbouncer_service_port" {
  value = kubernetes_service.pgbouncer_service.spec[0].port[0].port
}