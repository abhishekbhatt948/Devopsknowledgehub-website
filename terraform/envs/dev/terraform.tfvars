# create terraform variables for the VPC
# ensure that the variables are set correctly for the dev environment
cidr_block = "10.0.0/28"
azs = ["us-east-1a", "us-east-1b"]
public_subnets = ["10.0.1/24", "10.0.2/24"]
private_subnets = ["10.0.3/24", "10.0.4/24"]
enable_nat_gateway = true
enable_vpn_gateway = false
project_name = "dev-project"
enable_dns_hostnames = true
enable_dns_support = true
tags = {
  "Environment" = "dev"
  "Project"     = "dev-p-DevopsAILab"
}
vpc_name = "dev-vpc"
ami_id = "ami-020cba7c55df1f615"
instance_type = "t2.micro"
region = "us-east-1"
environment = var.environment == "dev" ? "t2.micro" : "t2.midium"

bucket_name = "my-terraform-state-bucket-for-p-devopsailab"
prevent_destroy = false

table_name = "value"
hash_key = "value"
attribute_types = {
  "" = "value"
}




