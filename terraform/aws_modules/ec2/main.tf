# create ec2 instance
resource "aws_instance" "example" {
  ami           = var.ami_id
  instance_type = var.instance_type
    user_data     = var.user_data
    ebs_block_device {
        device_name = "/dev/sda1"
        volume_size = var.ebs_volume_size
        volume_type = var.ebs_volume_type
        }
    tags          = merge(
      {
        Name = "example-instance-${var.environment}"
      },
      var.tags
    )
    key_name      = var.key_name
    security_groups = var.security_groups
    subnet_id     = var.subnet_id
    associate_public_ip_address = var.associate_public_ip_address
    availability_zone = var.availability_zone
    lifecycle {
      create_before_destroy = true
    }
    provisioner "local-exec" {
      command = "echo 'Instance created with ID: ${self.id}'"
    }
}


