# create a backend configuration for Terraform s3 + dynamodb
terraform {
  backend "s3" {
    bucket         = var.my-terraform-state-bucket
    key            = var.my-terraform-state-key
    region         = var.region
    dynamodb_table = var.my-terraform-state-lock-table
    encrypt        = true
  }
}
