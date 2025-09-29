# create postgreSQL RDS instance
resource "aws_db_instance" "postgresql" {
  identifier              = var.db_identifier
  engine                  = "postgres"
  engine_version          = var.db_engine_version
  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  storage_type            = var.db_storage_type
  db_subnet_group_name    = aws_db_subnet_group.postgresql.name
  vpc_security_group_ids  = [aws_security_group.postgresql.id]
  username                = var.db_username
  password                = var.db_password
  db_name                 = var.db_name
  skip_final_snapshot     = true
  publicly_accessible     = false
    port                    = var.db_port
    parameter_group_name    = var.db_parameter_group_name
    tags                   = merge(
        {
        Name        = var.db_identifier
        Environment = var.environment
        },
        var.common_tags
    )
}