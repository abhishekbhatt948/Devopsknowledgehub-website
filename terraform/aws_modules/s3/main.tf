# create s3 resource
resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name

  tags = merge(
    {
      Name        = var.bucket_name,
      Environment = var.environment,
    },
    var.tags
  )

  lifecycle {
    prevent_destroy = var.prevent_destroy
  }
}
