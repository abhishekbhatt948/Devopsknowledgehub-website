# create variables for the backend configuration
variable "my-terraform-state-bucket" {
  description = "The name of the S3 bucket for Terraform state"
  type        = string
}
variable "my-terraform-state-key" {
  description = "The key for the Terraform state file in the S3 bucket"
  type        = string
}
variable "region" {
  description = "The AWS region where the S3 bucket and DynamoDB table are located"
  type        = string
}
variable "my-terraform-state-lock-table" {
  description = "The name of the DynamoDB table for state locking"
  type        = string
}
