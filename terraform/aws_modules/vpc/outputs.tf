# create outputs for VPC
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}
output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = aws_subnet.public[*].id
}
output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = aws_subnet.private[*].id
}
output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = aws_internet_gateway.main.id
}
output "route_table_public_id" {
  description = "ID of the public route table"
  value       = aws_route_table.public.id
}
output "route_table_private_id" {
  description = "ID of the private route table"
  value       = aws_route_table.private.id
}