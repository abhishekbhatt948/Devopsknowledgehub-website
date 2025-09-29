# create variables for vpc,ec2, rds,dynamodb,s3
variable "cidr_block" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0/28"
}
variable "azs" {
  description = "List of availability zones for the VPC"
  type        = list(string)
  default     = []
}
variable "public_subnets" {
  description = "List of public subnets for the VPC"
  type        = list(string)
  default     = []
}
variable "private_subnets" {
  description = "List of private subnets for the VPC"
  type        = list(string)
  default     = []
}
variable "enable_nat_gateway" {
  description = "Enable NAT Gateway in the VPC"
  type        = bool
  default     = false
}
variable "enable_vpn_gateway" {
  description = "Enable VPN Gateway in the VPC"
  type        = bool
  default     = false
}
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "default-project"
}
variable "enable_dns_hostnames" {
  description = "Enable DNS hostnames in the VPC"
  type        = bool
  default     = true
}
variable "enable_dns_support" {
  description = "Enable DNS support in the VPC"
  type        = bool
  default     = true
}
variable "tags" {
  description = "Tags to apply to the VPC"
  type        = map(string)
  default     = {}
}
variable "vpc_name" {
  description = "Name of the VPC"
  type        = string
  default     = "default-vpc"
}

# Create variables for ec2 instance
variable "ami_id" {
  description = "Name of AMI_ID fro Instance"
  type = string
  default = "default_ami"
}
variable "instance_type" {
  description = "Instance_type"
  type = string
  default = "t2.micro"
}
variable "region" {
  description = "region"
  type = string
  default = "us-east-1"
}
variable "environment" {
  description = "environment"
  type = string
  default = "dev"
}

# create varibales for s3 bucket
variable "bucket_name" {
    description = "The name of the S3 bucket."
    type        = string
    }

variable "prevent_destroy" {
    description = "Whether to prevent the S3 bucket from being destroyed."
    type        = bool
    default     = false
}

variable "table_name" {
  description = "The name of the DynamoDB table."
  type        = string
}
variable "billing_mode" {
  description = "The billing mode for the DynamoDB table. Can be 'PROVISIONED' or 'PAY_PER_REQUEST'."
  type        = string
  default     = "PROVISIONED"
}
variable "hash_key" {
  description = "The name of the hash key for the DynamoDB table."
  type        = string
}
variable "range_key" {
  description = "The name of the range key for the DynamoDB table. Optional."
  type        = string
  default     = null
}
variable "read_capacity" {
  description = "The read capacity units for the DynamoDB table. Required if billing_mode is PROVISIONED."
  type        = number
  default     = 5
}
variable "write_capacity" {
  description = "The write capacity units for the DynamoDB table. Required if billing_mode is PROVISIONED."
  type        = number
  default     = 5
}
variable "attribute_types" {
  description = "A map of attribute names to their types for the DynamoDB table."
  type        = map(string)
  default     = {}
}