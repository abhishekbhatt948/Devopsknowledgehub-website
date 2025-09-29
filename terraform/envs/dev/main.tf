terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "6.7.0"
    }
  }
}

provider "aws" {

}

# create module for creating a VPC
module "vpc" {
  source = "../aws_modules/vpc"

  vpc_name = "dev-vpc"
  cidr_block = var.cidr_block
  azs = var.azs
    public_subnets = var.public_subnets
    private_subnets = var.private_subnets
    enable_nat_gateway = var.enable_nat_gateway
    enable_vpn_gateway = var.enable_vpn_gateway
    tags = {
        "Environment" = "dev"
        "Project"     = var.project_name
        }
    enable_dns_hostnames = true
    enable_dns_support = true
}

# create moudule for creating a s3 bucket
module "s3_bucket" {
  source = "../aws_modules/s3_bucket"

  bucket_name = "dev-bucket-${var.project_name}"
  acl         = "private"
  tags = {
    "Environment" = "dev"
    "Project"     = var.project_name
  }
}
# create module for creating an EC2 instance
module "ec2_instance" {
  source = "../aws_modules/ec2_instance"

  instance_name = "dev-instance"
  ami_id        = "ami-12345678" # replace with a valid AMI ID
  instance_type = "t2.micro"
  subnet_id     = module.vpc.public_subnets[0]
  tags = {
    "Environment" = "dev"
    "Project"     = var.project_name
  }
}
# create module for creating an RDS instance
module "rds_instance" {
  source = "../aws_modules/rds_instance"

  db_instance_identifier = "dev-db"
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  db_name                = "devdb"
  username               = "admin"
  password               = "password123" # replace with a secure password
  subnet_ids             = module.vpc.private_subnets
  vpc_security_group_ids = [module.vpc.default_security_group_id]
  tags = {
    "Environment" = "dev"
    "Project"     = var.project_name
  }
}

# create module for dynamodb table
module "dynamodb_table" {
  source = "../aws_modules/dynamodb_table"

  table_name = "dev-table"
  hash_key   = "id"
  read_capacity = 5
  write_capacity = 5
  tags = {
    "Environment" = "dev"
    "Project"     = var.project_name
  }
}
# create module for creating an IAM role
module "iam_role" {
  source = "../aws_modules/iam_role"

  role_name = "dev-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
  managed_policy_arns = ["arn:aws:iam::aws:policy/AmazonS3FullAccess"]
  tags = {
    "Environment" = "dev"
    "Project"     = var.project_name
  }
}

# create module for security groups
module "security_group" {
  source = "../../aws_modules/vpc"
  
  vpc_name = "dev_vpc"

}