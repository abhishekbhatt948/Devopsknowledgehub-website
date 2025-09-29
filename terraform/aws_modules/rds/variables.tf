# create variables for rds resources
variable "db_identifier" {
  description = "The identifier for the RDS instance."
  type        = string
}
variable "db_engine_version" {
  description = "The version of the database engine to use."
  type        = string
}
variable "db_instance_class" {
  description = "The instance class for the RDS instance."
  type        = string
}
variable "db_allocated_storage" {
  description = "The amount of storage (in GiB) to allocate for the RDS instance."
  type        = number
}
variable "db_storage_type" {
  description = "The storage type for the RDS instance (e.g., standard, gp2, io1)."
  type        = string
}
variable "db_username" {
  description = "The username for the RDS instance."
  type        = string
}
variable "db_password" {
  description = "The password for the RDS instance."
  type        = string
  sensitive   = true
}
variable "db_name" {
  description = "The name of the database to create when the RDS instance is created."
  type        = string
}
variable "environment" {
  description = "The environment for the RDS instance (e.g., dev, staging, prod)."
  type        = string
}
variable "common_tags" {
  description = "Common tags to apply to all resources."
  type        = map(string)
  default     = {}
}
variable "db_subnet_group_name" {
  description = "The name of the DB subnet group to associate with the RDS instance."
  type        = string
}
variable "db_security_group_ids" {
  description = "List of security group IDs to associate with the RDS instance."
  type        = list(string)
  default     = []
}
variable "db_port" {
  description = "The port on which the database accepts connections."
  type        = number
  default     = 5432
}
variable "db_parameter_group_name" {
  description = "The name of the DB parameter group to associate with the RDS instance."
  type        = string
  default     = null
}
variable "db_option_group_name" {
  description = "The name of the DB option group to associate with the RDS instance."
  type        = string
  default     = null
}
variable "db_backup_retention_period" {
  description = "The number of days to retain backups for the RDS instance."
  type        = number
  default     = 7
}
variable "db_multi_az" {
  description = "Specifies whether the RDS instance is a Multi-AZ deployment."
  type        = bool
  default     = false
}
variable "db_storage_encrypted" {
  description = "Specifies whether the RDS instance storage is encrypted."
  type        = bool
  default     = true
}
variable "db_performance_insights_enabled" {
  description = "Specifies whether Performance Insights are enabled for the RDS instance."
  type        = bool
  default     = false
}
variable "db_performance_insights_kms_key_id" {
  description = "The KMS key ID for Performance Insights encryption."
  type        = string
  default     = null
}
variable "db_monitoring_interval" {
  description = "The interval, in seconds, between points when Enhanced Monitoring metrics are collected for the RDS instance."
  type        = number
  default     = 0
}
