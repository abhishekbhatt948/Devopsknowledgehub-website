# create a VPC resource
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  tags = merge(
    {
      Name = var.vpc_name
      Environment = var.environment
    },
    var.tags
  )
}

# create subnets for the VPC
resource "aws_subnet" "public" {
  count = length(var.public_subnets)
  vpc_id = aws_vpc.main.id
  cidr_block = var.public_subnets[count.index]
  availability_zone = var.availability_zones[count.index % length(var.availability_zones)]
  map_public_ip_on_launch = true
  tags = merge(
    {
      Name = "${var.vpc_name}-public-${count.index + 1}"
    },
    var.tags
  )
}
resource "aws_subnet" "private" {
  count = length(var.private_subnets)
  vpc_id = aws_vpc.main.id
  cidr_block = var.private_subnets[count.index]
  availability_zone = var.availability_zones[count.index % length(var.availability_zones)]
  tags = merge(
    {
      Name = "${var.vpc_name}-private-${count.index + 1}"
    },
    var.tags
  )
} 
# create NAT Gateway if enabled
resource "aws_nat_gateway" "main" {
  count = var.enable_nat_gateway ? 1 : 0
  allocation_id = aws_eip.nat.id
  subnet_id = aws_subnet.public[0].id
  depends_on = [ aws_internet_gateway.main ]
  tags = merge(
    {
      Name = "${var.vpc_name}-nat-gateway"
    },
    var.tags
  )
} 
# create EIP for NAT Gateway
resource "aws_eip" "nat" {
  count = var.enable_nat_gateway ? 1 : 0
  domain = "vpc"
  tags = merge(
    {
      Name = "${var.vpc_name}-nat-eip"
    },
    var.tags
  )
}
# create route tables for public and private subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  tags = merge(
    {
      Name = "${var.vpc_name}-public-route-table"
    },
    var.tags
  )
}
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  tags = merge(
    {
      Name = "${var.vpc_name}-private-route-table"
    },
    var.tags
  )
}
# create routes for public route table
resource "aws_route" "public_internet_access" {
  route_table_id = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  
  gateway_id = aws_internet_gateway.main.id
}
# create internet gateway for the VPC
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    {
      Name = "${var.vpc_name}-internet-gateway"
    },
    var.tags
  )
}
# associate public subnets with the public route table
resource "aws_route_table_association" "public" {
  count = length(aws_subnet.public)
  subnet_id = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
# associate private subnets with the private route table
resource "aws_route_table_association" "private" {
  count = length(aws_subnet.private)
  subnet_id = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# create security group resource
resource "aws_security_group" "security_group" {
  description = "This is security group which act like firewall for instance"
  vpc_id = aws_vpc.main.id

  ingress = {
    description = "SSH Rule define for ingress"
    from_port = "22"
    to_port = "22"
    protocol = "TCP"
    cidr_blocks = "0.0.0.0/0"

    description = "HTTP Rule for ingress"
    from_port = "80"
    to_port = "80"
    Protocol = "TCP"
    cidr_blocks = "0.0.0.0/0"
  }

  egress = {
    description = "Egress rule define what instance can access internet"
    from_port = "0"
    to_port = "0"
    protocol = "-1"
    cidr_blocks = "0.0.0.0/0"
  }

  tags = {
    "Name" = "Security_group" 
  }
}