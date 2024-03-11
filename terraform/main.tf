terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.51.0"
    }
  }
  backend "gcs" {
    bucket  = "jpoehnelt-cohere-tf"
    prefix  = "terraform/state"
  }
}

variable "project_id" {}

variable "location" {
  default = "us-central1"
}

variable "cluster_name" {
  default = "gke-cluster"
}

resource "random_id" "bucket_prefix" {
  byte_length = 8
}

data "google_container_engine_versions" "gke_version" {
  location       = var.location
  version_prefix = "1.27."
}

provider "google" {
  project = var.project_id
  region  = var.location
}

resource "google_container_cluster" "gke_cluster" {
  name     = var.cluster_name
  location = var.location

  remove_default_node_pool = true
  initial_node_count       = 1
}

resource "google_container_node_pool" "gke_cluster_preemptible_nodes" {
  name       = "node-pool"
  location   = var.location
  cluster    = google_container_cluster.gke_cluster.name
  node_count = 1

  node_config {
    preemptible  = true
    machine_type = "e2-medium"
  }
}
