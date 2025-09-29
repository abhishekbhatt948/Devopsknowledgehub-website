# create outputs for EC2 instance
output "instance_id" {
  description = "The ID of the EC2 instance"
  value       = aws_instance.example.id
}
output "public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.example.public_ip
}
output "private_ip" {
  description = "The private IP address of the EC2 instance"
  value       = aws_instance.example.private_ip
}
output "instance_state" {
  description = "The current state of the EC2 instance"
  value       = aws_instance.example.state
}
output "instance_tags" {
  description = "The tags applied to the EC2 instance"
  value       = aws_instance.example.tags
}