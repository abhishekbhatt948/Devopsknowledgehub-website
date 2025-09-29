# create variables for dynamoDB table
variable "table_name" {
  description = "The name of the DynamoDB table."
  type        = string
}
variable "billing_mode" {
  description = "The billing mode for the DynamoDB table. Can be 'PROVISIONED' or 'PAY_PER_REQUEST'."
  type        = string
  default     = "PROVISIONED"
}
variable "hash_key" {
  description = "The name of the hash key for the DynamoDB table."
  type        = string
}
variable "range_key" {
  description = "The name of the range key for the DynamoDB table. Optional."
  type        = string
  default     = null
}
variable "read_capacity" {
  description = "The read capacity units for the DynamoDB table. Required if billing_mode is PROVISIONED."
  type        = number
  default     = 5
}
variable "write_capacity" {
  description = "The write capacity units for the DynamoDB table. Required if billing_mode is PROVISIONED."
  type        = number
  default     = 5
}
variable "tags" {
  description = "A map of tags to assign to the DynamoDB table."
  type        = map(string)
  default     = {}
}
variable "attribute_types" {
  description = "A map of attribute names to their types for the DynamoDB table."
  type        = map(string)
  default     = {}
}