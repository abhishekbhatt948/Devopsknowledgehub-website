# create variables for EC2 instance
variable "ami_id" {
  description = "The AMI ID to use for the EC2 instance"
  type        = string
}
variable "instance_type" {
  description = "The type of instance to create"
  type        = string
}
variable "user_data" {
  description = "User data script to run on instance launch"
  type        = string
  default     = ""
}
variable "ebs_volume_size" {
  description = "Size of the EBS volume in GB"
  type        = number
  default     = 8
}
variable "ebs_volume_type" {
  description = "Type of the EBS volume"
  type        = string
  default     = "gp2"
}
variable "tags" {
  description = "Tags to apply to the EC2 instance"
  type        = map(string)
  default     = {}
}
variable "key_name" {
  description = "The name of the key pair to use for SSH access"
  type        = string
  default     = ""
}
variable "security_groups" {
  description = "List of security group IDs to associate with the instance"
  type        = list(string)
  default     = []
}
variable "subnet_id" {
  description = "The ID of the subnet in which to launch the instance"
  type        = string
  default     = ""
}
variable "associate_public_ip_address" {
  description = "Whether to associate a public IP address with the instance"
  type        = bool
  default     = false
}
variable "availability_zone" {
  description = "The availability zone in which to launch the instance"
  type        = string
  default     = ""
}
variable "environment" {
  description = "The environment for the instance (e.g., production, development)"
  type        = string
  default     = "development"
}