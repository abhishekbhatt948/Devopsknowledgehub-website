# create variables for VPC
variable "vpc_name" {
  description = "Name of the VPC"
  type        = string
  default     = "my-vpc"
}
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = ""
}
variable "enable_nat_gateway" {
  description = "Flag to enable NAT Gateway"
  type        = bool
  default     = false
}
variable "single_nat_gateway" {
  description = "Flag to use a single NAT Gateway"
  type        = bool
  default     = true
}
variable "tags" {
  description = "Tags to apply to the VPC and its resources"
  type        = map(string)
  default     = {}
}
variable "public_subnets" {
  description = "List of public subnet CIDR blocks"
  type        = list(string)
  default     = []
}
variable "private_subnets" {
  description = "List of private subnet CIDR blocks"
  type        = list(string)
  default     = []
}
variable "availability_zones" {
  description = "List of availability zones to use for subnets"
  type        = list(string)
  default     = []
}
variable "environment" {
  description = "Environment for the VPC (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}
