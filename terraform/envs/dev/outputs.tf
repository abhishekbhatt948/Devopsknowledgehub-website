# create outputs for the VPC module
output "vpc_name" {
  description = "ID of the created VPC"
  value       = module.vpc.vpc_name
}
output "vpc_id" {
  description = "ID of the created VPC"
  value       = module.vpc.vpc_id
}
output "public_subnets" {
  description = "List of public subnets created in the VPC"
  value       = module.vpc.public_subnets
}
output "private_subnets" {
  description = "List of private subnets created in the VPC"
  value       = module.vpc.private_subnets
}
output "nat_gateway_id" {
  description = "ID of the NAT Gateway created in the VPC"
  value       = module.vpc.nat_gateway_id
}
