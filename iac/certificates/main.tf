resource "google_compute_managed_ssl_certificate" "rop_certs" {
  provider = google-beta

  name = "rave-of-phonetics-certs"

  managed {
    domains = ["api.raveofphonetics.com"]
  }
}
