locals {
  app_name = "rave-of-phonetics-backend"
  namespace = "production"
}

resource "kubernetes_config_map" "rop_configmap" {
  # https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/config_map
  metadata {
    name = "${local.app_name}-configmap"
    namespace = local.namespace
  }
  data = {
    DJANGO_BIND_PORT = "8000"
    # This should be enabled when a CIDR is allowed too
    # ALLOWED_HOSTS = "api.raveofphonetics.com"
    CORS_ALLOWED_ORIGINS = "https://www.raveofphonetics.com,https://raveofphonetics.netlify.app"
    CORS_ALLOW_CREDENTIALS = "True"
    RECAPTCHA_ENDPOINT = "https://www.google.com/recaptcha/api/siteverify"
    RECAPTCHA_TOKEN_HEADER = "RECAPTCHA-TOKEN-V3"
    RECAPTCHA_SCORE_THRESHOLD = "0.7"
    GITHUB_OAUTH_ORIGIN = "https://www.raveofphonetics.com/"
    GUNICORN_WORKERS = "2"
    DB_HOST = "pgbouncer-service.production.svc.cluster.local"
    DB_PORT = "5432"
    DB_ENGINE = "django.db.backends.postgresql"
    DB_NAME = "db_production"
    DB_SCHEMA = "raveofphonetics_prd"
    DB_USE_SSL = "False"
    IP_DISCOVERY_NUMBER_OF_PROXIES = "2"
    # Django Q
    Q_CLUSTER_TIMEOUT_IN_MIN = "15"
    Q_CLUSTER_WORKERS = "2"
  }
}

resource "kubernetes_secret" "rop_secret" {
  # https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/secret
  metadata {
    name = "${local.app_name}-secret"
    namespace = local.namespace
  }

  data = {
    DJANGO_SECRET_KEY = "3)dzt1u*4z7x^rw0g0f*j+b49pq_c09jxso4bzacnp^gyp=y("
    RECAPTCHA_SECRET_KEY = "6Lfj014aAAAAAEFtaP1OZ6jP91PsLt0UotsLmasC"
    GITHUB_OAUTH_APP_CLIENT_ID = "0c4b6beigub7cb8cc"
    GITHUB_OAUTH_APP_CLIENT_SECRET = "596b54dentada795e4bf9041163706cf60c112"
    DB_USER = "role_raveofphonetics_prd"
    DB_PASS = "WN+[B#B#W@)T>(cc,Qg4rKA"
    TWITTER_CONSUMER_KEY = "34Gy8DloiraoIPRfvrryeClkbKk6ZeQ"
    TWITTER_CONSUMER_SECRET = "qPLbeaHJNKT30N5cp3yxbsGcnuWdogmdFk3SjhPgJHZZy3Z8gsSTJ"
    TWITTER_CONSUMER_BEARER = "AAAAAAAAAAAAAAAAAAAAAFjQRQEAAAAAU83AbGJT%saltlicker%2FH5r57leP9Eo%3DXpChako9TPnjrs1iSiEfXC2Ha4CTRRb3rqo5HhoVg04urEML2dss"
  }
  # The secret type. Defaults to Opaque
  # https://github.com/kubernetes/community/blob/c7151dd8dd7e487e96e5ce34c6a416bb3b037609/contributors/design-proposals/auth/secrets.md#proposed-design
  type = "Opaque"
}

resource "kubernetes_service" "rop_service" {
  metadata {
    namespace = local.namespace
    name = "${local.app_name}-np-service"
  }

  spec {
    # Determines how the service is exposed. Defaults to ClusterIP.
    # Valid options are ExternalName, ClusterIP, NodePort, and LoadBalancer.
    type = "NodePort"

    port {
      name = "http"
      protocol = "TCP"
      port = 8000
      target_port = 8000
    }

    selector = {
      app = "${local.app_name}-deployment"
    }
  }
  # After this service is created, you can issue `kubectl proxy` and then the following:
  # http://127.0.0.1:8001/api/v1/namespaces/production/services/rave-of-phonetics-backend-np-service:8000/proxy/
}
