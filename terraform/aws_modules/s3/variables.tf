# create variables s3 bucket
variable "bucket_name" {
    description = "The name of the S3 bucket."
    type        = string
    }
variable "environment" {
    description = "The environment for the S3 bucket (e.g., dev, staging, prod)."
    type        = string
}
variable "tags" {
    description = "A map of tags to assign to the S3 bucket."
    type        = map(string)
    default     = {}
}
variable "prevent_destroy" {
    description = "Whether to prevent the S3 bucket from being destroyed."
    type        = bool
    default     = false
}
