import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, Circle, Book, Code, ExternalLink, ChevronRight, ChevronLeft, Trophy, Target, Copy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../hooks/useProgress';

interface ToolPageProps {
  tool: {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    color: string;
    steps: string[];
    description?: string;
  };
  onBack: () => void;
  onPlayground: (tool: any) => void;
}

const ToolPage: React.FC<ToolPageProps> = ({ tool, onBack, onPlayground }) => {
  const { user } = useAuth();
  const { updateProgress, getToolProgress } = useProgress();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toolProgress = getToolProgress(tool.id);

  useEffect(() => {
    if (toolProgress) {
      setCurrentStep(toolProgress.current_step);
      setCompletedSteps(new Set(toolProgress.completed_steps.map(s => parseInt(s))));
    }
  }, [toolProgress]);

  const handleStepComplete = async (stepIndex: number) => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(stepIndex);
    setCompletedSteps(newCompletedSteps);

    if (user) {
      await updateProgress(tool.id, tool.name, stepIndex, tool.steps.length);
    }
  };

  const handleStepSelect = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const nextStep = () => {
    if (currentStep < tool.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const getStepContent = (stepName: string, stepIndex: number) => {
    const content = {
      'linux': [
        {
          title: 'Essential Linux Commands',
          content: `
            <h3>File and Directory Operations</h3>
            <div class="command-section">
              <h4>Navigation Commands</h4>
              <pre><code># Show current directory
pwd

# List files and directories
ls                    # Basic listing
ls -la               # Detailed listing with hidden files
ls -lh               # Human readable file sizes
ls -lt               # Sort by modification time

# Change directory
cd /path/to/directory
cd ~                 # Go to home directory
cd ..                # Go up one directory
cd -                 # Go to previous directory</code></pre>
            </div>

            <div class="command-section">
              <h4>File Operations</h4>
              <pre><code># Create files
touch filename.txt           # Create empty file
echo "content" > file.txt    # Create file with content
echo "more" >> file.txt      # Append to file

# Copy files and directories
cp source.txt destination.txt
cp -r source_dir/ dest_dir/  # Copy directory recursively
cp -p file.txt backup.txt    # Preserve permissions and timestamps

# Move/rename files
mv oldname.txt newname.txt   # Rename file
mv file.txt /path/to/dest/   # Move file

# Remove files and directories
rm filename.txt              # Remove file
rm -rf directory/            # Remove directory recursively (be careful!)
rm -i *.txt                  # Interactive removal</code></pre>
            </div>

            <div class="command-section">
              <h4>Directory Operations</h4>
              <pre><code># Create directories
mkdir new_directory
mkdir -p path/to/nested/dirs # Create nested directories

# Remove directories
rmdir empty_directory        # Remove empty directory
rm -rf directory/            # Remove directory with contents</code></pre>
            </div>
          `,
          commands: [
            'pwd',
            'ls -la',
            'cd /tmp && pwd',
            'touch test.txt && ls -l test.txt',
            'echo "Hello World" > hello.txt && cat hello.txt',
            'cp hello.txt backup.txt && ls -l *.txt',
            'mkdir test_dir && ls -ld test_dir',
            'rm test.txt backup.txt && rmdir test_dir'
          ]
        },
        {
          title: 'Advanced File Operations',
          content: `
            <h3>File Permissions and Ownership</h3>
            <div class="command-section">
              <h4>Understanding Permissions</h4>
              <pre><code># Permission format: rwxrwxrwx (owner, group, others)
# r = read (4), w = write (2), x = execute (1)

# View file permissions
ls -l filename.txt
# Output: -rw-r--r-- 1 user group 1024 Jan 1 12:00 filename.txt
#         ^^^^^^^^^ permissions
#         ^         file type (- = file, d = directory, l = link)
#          ^^^      owner permissions (rw- = read, write, no execute)
#             ^^^   group permissions (r-- = read only)
#                ^^^ others permissions (r-- = read only)</code></pre>
            </div>

            <div class="command-section">
              <h4>Changing Permissions (chmod)</h4>
              <pre><code># Numeric method (octal)
chmod 755 script.sh          # rwxr-xr-x (owner: rwx, group: r-x, others: r-x)
chmod 644 file.txt           # rw-r--r-- (owner: rw-, group: r--, others: r--)
chmod 600 private.txt        # rw------- (owner: rw-, group: ---, others: ---)
chmod 777 public_script.sh   # rwxrwxrwx (all permissions for everyone)

# Symbolic method
chmod +x script.sh           # Add execute permission for all
chmod u+x script.sh          # Add execute for owner (user)
chmod g+w file.txt           # Add write permission for group
chmod o-r file.txt           # Remove read permission for others
chmod a+r file.txt           # Add read permission for all (a = all)

# Recursive permission changes
chmod -R 755 directory/      # Apply permissions recursively</code></pre>
            </div>

            <div class="command-section">
              <h4>Changing Ownership (chown)</h4>
              <pre><code># Change owner
chown newowner file.txt

# Change owner and group
chown newowner:newgroup file.txt

# Change only group
chgrp newgroup file.txt

# Recursive ownership change
chown -R user:group directory/</code></pre>
            </div>

            <div class="command-section">
              <h4>File Content Operations</h4>
              <pre><code># View file contents
cat file.txt                 # Display entire file
less file.txt                # View file page by page (q to quit)
more file.txt                # Similar to less
head file.txt                # Show first 10 lines
head -n 20 file.txt          # Show first 20 lines
tail file.txt                # Show last 10 lines
tail -n 20 file.txt          # Show last 20 lines
tail -f logfile.txt          # Follow file changes (useful for logs)

# Search in files
grep "pattern" file.txt      # Search for pattern in file
grep -i "pattern" file.txt   # Case-insensitive search
grep -r "pattern" directory/ # Recursive search in directory
grep -n "pattern" file.txt   # Show line numbers

# Count lines, words, characters
wc file.txt                  # Show lines, words, characters
wc -l file.txt               # Count lines only
wc -w file.txt               # Count words only</code></pre>
            </div>
          `,
          commands: [
            'ls -l /etc/passwd',
            'chmod 755 script.sh',
            'chmod +x script.sh',
            'chmod u+w,g-w,o-r file.txt',
            'chown $USER:$USER file.txt',
            'cat /etc/os-release',
            'head -n 5 /etc/passwd',
            'tail -n 3 /etc/passwd',
            'grep "root" /etc/passwd',
            'wc -l /etc/passwd'
          ]
        },
        {
          title: 'Process Management Commands',
          content: `
            <h3>Process Monitoring and Control</h3>
            <div class="command-section">
              <h4>Viewing Processes</h4>
              <pre><code># Show running processes
ps                           # Show processes for current user
ps aux                       # Show all processes with detailed info
ps -ef                       # Show all processes in full format
ps -u username               # Show processes for specific user

# Real-time process monitoring
top                          # Interactive process viewer (q to quit)
htop                         # Enhanced version of top (if installed)

# Process tree
pstree                       # Show processes in tree format
pstree -p                    # Show with process IDs</code></pre>
            </div>

            <div class="command-section">
              <h4>Process Control</h4>
              <pre><code># Kill processes
kill PID                     # Terminate process by ID (SIGTERM)
kill -9 PID                  # Force kill process (SIGKILL)
kill -15 PID                 # Graceful termination (SIGTERM)
killall process_name         # Kill all processes by name
pkill pattern                # Kill processes matching pattern

# Background and foreground jobs
command &                    # Run command in background
jobs                         # List active jobs
fg %1                        # Bring job 1 to foreground
bg %1                        # Send job 1 to background
nohup command &              # Run command immune to hangups

# Process priority
nice -n 10 command           # Run with lower priority
renice 5 PID                 # Change priority of running process</code></pre>
            </div>

            <div class="command-section">
              <h4>System Resource Monitoring</h4>
              <pre><code># Memory usage
free -h                      # Show memory usage in human readable format
free -m                      # Show memory in MB

# Disk usage
df -h                        # Show disk space usage
du -h directory/             # Show directory size
du -sh *                     # Show size of all items in current directory

# System load
uptime                       # Show system uptime and load average
w                            # Show who is logged in and what they're doing

# CPU information
lscpu                        # Display CPU information
cat /proc/cpuinfo            # Detailed CPU information</code></pre>
            </div>
          `,
          commands: [
            'ps aux | head -10',
            'ps -ef | grep bash',
            'top -n 1 -b | head -20',
            'jobs',
            'sleep 30 &',
            'jobs',
            'kill %1',
            'free -h',
            'uname -a',
            'df -h',
            'uptime'
          ]
        },
        {
          title: 'Network Troubleshooting Commands',
          content: `
            <h3>Network Connectivity and Troubleshooting</h3>
            <div class="command-section">
              <h4>Basic Network Commands</h4>
              <pre><code># Test connectivity
ping google.com              # Test connectivity to host
ping -c 4 8.8.8.8           # Send 4 packets to Google DNS
ping6 google.com             # IPv6 ping

# DNS lookup
nslookup google.com          # DNS lookup
dig google.com               # Detailed DNS information
dig @8.8.8.8 google.com      # Query specific DNS server
host google.com              # Simple DNS lookup

# Network route tracing
traceroute google.com        # Trace route to destination
tracepath google.com         # Alternative to traceroute
mtr google.com               # Continuous traceroute</code></pre>
            </div>

            <div class="command-section">
              <h4>Network Interface Information</h4>
              <pre><code># Network interface configuration
ip addr show                 # Show all network interfaces
ip a                         # Short form
ifconfig                     # Traditional interface configuration (if available)

# Routing table
ip route show                # Show routing table
route -n                     # Show routing table (traditional)

# Network statistics
netstat -tuln                # Show listening ports
netstat -i                   # Show network interface statistics
ss -tuln                     # Modern replacement for netstat
ss -tulpn                    # Show processes using ports</code></pre>
            </div>

            <div class="command-section">
              <h4>Port and Service Testing</h4>
              <pre><code># Test port connectivity
telnet hostname 80           # Test if port 80 is open
nc -zv hostname 80           # Test port with netcat
nc -zv hostname 20-25        # Test port range

# Download/upload testing
wget http://example.com/file # Download file
curl http://example.com      # Fetch web page
curl -I http://example.com   # Get headers only
curl -o file.txt http://url  # Download to specific file

# Network monitoring
iftop                        # Monitor network traffic by connection
nethogs                      # Monitor network traffic by process
tcpdump -i eth0              # Capture network packets</code></pre>
            </div>
          `,
          commands: [
            'ping -c 3 8.8.8.8',
            'nslookup google.com',
            'dig google.com',
            'ip addr show',
            'ip route show',
            'netstat -tuln | head -10',
            'ss -tuln | head -10',
            'curl -I https://google.com',
            'wget --spider https://google.com',
            'traceroute -m 5 8.8.8.8'
          ]
        }
      ],
      'docker': [
        {
          title: 'Installing Docker',
          content: `
            <h3>Docker Installation Commands</h3>
            <div class="command-section">
              <h4>Ubuntu/Debian Installation</h4>
              <pre><code># Update package index
sudo apt-get update

# Install required packages
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Add user to docker group (avoid using sudo)
sudo usermod -aG docker $USER
newgrp docker</code></pre>
            </div>

            <div class="command-section">
              <h4>CentOS/RHEL Installation</h4>
              <pre><code># Install required packages
sudo yum install -y yum-utils

# Add Docker repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Install Docker Engine
sudo yum install docker-ce docker-ce-cli containerd.io

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER</code></pre>
            </div>

            <div class="command-section">
              <h4>Installation Verification</h4>
              <pre><code># Check Docker version
docker --version
docker version

# Check Docker info
docker info

# Test Docker installation
docker run hello-world

# Check Docker service status
sudo systemctl status docker

# Enable Docker to start on boot
sudo systemctl enable docker</code></pre>
            </div>
          `,
          commands: [
            'sudo apt-get update',
            'sudo apt-get install docker-ce docker-ce-cli containerd.io',
            'sudo usermod -aG docker $USER',
            'docker --version',
            'docker info',
            'docker --version',
            'docker run hello-world',
            'sudo systemctl status docker',
            'sudo systemctl enable docker'
          ]
        },
        {
          title: 'Docker Basic Commands',
          content: `
            <h3>Essential Docker Commands</h3>
            <div class="command-section">
              <h4>Container Lifecycle Management</h4>
              <pre><code># Run containers
docker run nginx                    # Run nginx container (foreground)
docker run -d nginx                 # Run in background (detached)
docker run -d -p 8080:80 nginx     # Map port 8080 to container port 80
docker run -d --name web nginx     # Run with custom name
docker run -it ubuntu bash         # Interactive mode with terminal

# List containers
docker ps                           # Show running containers
docker ps -a                        # Show all containers (including stopped)
docker ps -q                        # Show only container IDs

# Container control
docker start container_name         # Start stopped container
docker stop container_name          # Stop running container
docker restart container_name       # Restart container
docker pause container_name         # Pause container
docker unpause container_name       # Unpause container

# Remove containers
docker rm container_name            # Remove stopped container
docker rm -f container_name         # Force remove running container
docker container prune              # Remove all stopped containers</code></pre>
            </div>

            <div class="command-section">
              <h4>Image Management</h4>
              <pre><code># List images
docker images                       # Show all images
docker images -q                    # Show only image IDs

# Pull images
docker pull ubuntu:20.04            # Pull specific tag
docker pull nginx:latest            # Pull latest version

# Build images
docker build -t myapp:v1.0 .        # Build from Dockerfile in current directory
docker build -t myapp:latest -f Dockerfile.prod .  # Use specific Dockerfile

# Remove images
docker rmi image_name               # Remove image
docker rmi -f image_name            # Force remove image
docker image prune                  # Remove unused images
docker image prune -a               # Remove all unused images</code></pre>
            </div>

            <div class="command-section">
              <h4>Container Inspection and Logs</h4>
              <pre><code># View logs
docker logs container_name          # Show container logs
docker logs -f container_name       # Follow logs (real-time)
docker logs --tail 50 container_name # Show last 50 lines

# Inspect containers
docker inspect container_name       # Detailed container information
docker stats                        # Real-time resource usage
docker stats container_name         # Stats for specific container

# Execute commands in running containers
docker exec -it container_name bash # Interactive shell
docker exec container_name ls -la   # Run single command</code></pre>
            </div>
          `,
          commands: [
            'docker --version',
            'docker run hello-world',
            'docker run -d --name test-nginx nginx',
            'docker ps',
            'docker logs test-nginx',
            'docker exec test-nginx ls -la',
            'docker stop test-nginx',
            'docker rm test-nginx',
            'docker images',
            'docker pull ubuntu:20.04'
          ]
        },
        {
          title: 'Creating Dockerfiles',
          content: `
            <h3>Dockerfile Basics</h3>
            <div class="command-section">
              <h4>Basic Dockerfile Structure</h4>
              <pre><code># Use official base image
FROM ubuntu:20.04

# Set maintainer information
LABEL maintainer="your-email@example.com"

# Set environment variables
ENV APP_HOME=/app
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR $APP_HOME

# Install system dependencies
RUN apt-get update && \\
    apt-get install -y \\
        python3 \\
        python3-pip \\
        curl \\
        && rm -rf /var/lib/apt/lists/*

# Copy application files
COPY requirements.txt .
COPY . .

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Expose port
EXPOSE 8000

# Create non-root user
RUN useradd -m -u 1000 appuser && \\
    chown -R appuser:appuser $APP_HOME
USER appuser

# Define default command
CMD ["python3", "app.py"]</code></pre>
            </div>

            <div class="command-section">
              <h4>Multi-stage Build Example</h4>
              <pre><code># Multi-stage build for smaller production images
# Build stage
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:16-alpine AS production
WORKDIR /app

# Copy only production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
CMD ["npm", "start"]</code></pre>
            </div>

            <div class="command-section">
              <h4>Best Practices</h4>
              <pre><code># .dockerignore file
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output

# Dockerfile best practices
# 1. Use specific tags, not 'latest'
FROM node:16.14.2-alpine

# 2. Minimize layers by combining RUN commands
RUN apt-get update && \\
    apt-get install -y curl && \\
    rm -rf /var/lib/apt/lists/*

# 3. Use COPY instead of ADD when possible
COPY package.json ./

# 4. Leverage build cache by copying dependencies first
COPY package*.json ./
RUN npm install
COPY . .

# 5. Use non-root user for security
USER 1001</code></pre>
            </div>
          `,
          commands: [
            'echo "FROM nginx:alpine" > Dockerfile',
            'echo "COPY index.html /usr/share/nginx/html/" >> Dockerfile',
            'echo "<h1>Hello Docker!</h1>" > index.html',
            'docker build -t my-nginx .',
            'docker run -d -p 8080:80 my-nginx',
            'curl http://localhost:8080',
            'docker stop $(docker ps -q)',
            'docker system prune -f'
          ]
        },
        {
          title: 'Docker Compose',
          content: `
            <h3>Docker Compose Basics</h3>
            <div class="command-section">
              <h4>Basic docker-compose.yml</h4>
              <pre><code>version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    environment:
      - DEBUG=1
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:</code></pre>
            </div>

            <div class="command-section">
              <h4>Docker Compose Commands</h4>
              <pre><code># Start services
docker-compose up                    # Start in foreground
docker-compose up -d                 # Start in background (detached)
docker-compose up --build            # Rebuild images before starting

# Stop services
docker-compose down                  # Stop and remove containers
docker-compose down -v               # Also remove volumes
docker-compose stop                  # Stop containers without removing

# View services
docker-compose ps                    # Show running services
docker-compose logs                  # Show logs from all services
docker-compose logs web              # Show logs from specific service
docker-compose logs -f               # Follow logs

# Execute commands
docker-compose exec web bash         # Interactive shell in web service
docker-compose exec db psql -U user mydb  # Connect to database

# Scale services
docker-compose up -d --scale web=3   # Run 3 instances of web service

# Build and manage
docker-compose build                 # Build all services
docker-compose build web             # Build specific service
docker-compose pull                  # Pull latest images</code></pre>
            </div>

            <div class="command-section">
              <h4>Advanced Compose Features</h4>
              <pre><code># Environment-specific configurations
# docker-compose.override.yml (automatically loaded)
version: '3.8'
services:
  web:
    environment:
      - DEBUG=1
    volumes:
      - .:/app

# Production configuration
# docker-compose.prod.yml
version: '3.8'
services:
  web:
    environment:
      - DEBUG=0
    restart: unless-stopped

# Use specific compose file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Health checks
services:
  web:
    build: .
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s</code></pre>
            </div>
          `,
          commands: [
            'mkdir compose-demo && cd compose-demo',
            'cat > docker-compose.yml << EOF\nversion: "3.8"\nservices:\n  web:\n    image: nginx\n    ports:\n      - "8080:80"\nEOF',
            'docker-compose up -d',
            'docker-compose ps',
            'docker-compose logs',
            'curl http://localhost:8080',
            'docker-compose down',
            'cd .. && rm -rf compose-demo'
          ]
        }
      ]
    };

    // Get topic-specific content   
    const topicContent = content[tool.id as keyof typeof content];
    
    // Get the step content directly by index
    if (topicContent && topicContent[stepIndex]) {
      return topicContent[stepIndex];
    }

    // Fallback to default content
    return {
      title: stepName,
      content: `
        <div class="text-center py-12">
          <div class="bg-blue-50 rounded-lg p-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Content Coming Soon
            </h3>
            <p class="text-gray-600 mb-4">
              Detailed content for this step is being prepared.
            </p>
          </div>
        </div>
      `
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const currentStepContent = getStepContent(tool.steps[currentStep], currentStep);
  const progress = completedSteps.size / tool.steps.length * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Tools
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onPlayground(tool)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="h-4 w-4 mr-2" />
                Open Playground
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center mb-6">
                <div className={`p-3 rounded-lg ${tool.color} mr-4`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{tool.name}</h1>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{completedSteps.size}/{tool.steps.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {progress === 100 && (
                  <div className="flex items-center mt-2 text-green-600">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Completed!</span>
                  </div>
                )}
              </div>

              {/* Steps Navigation */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Steps</h3>
                {tool.steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => handleStepSelect(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentStep === index
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {completedSteps.has(index) ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      )}
                      <div>
                        <div className={`text-sm font-medium ${
                          currentStep === index ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {step}
                        </div>
                        <div className="text-xs text-gray-500">
                          Step {index + 1} of {tool.steps.length}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Step Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentStepContent.title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Step {currentStep + 1} of {tool.steps.length}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={currentStep === tool.steps.length - 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6-ab">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentStepContent.content }}
                />

                {/* Commands Section */}
                {'commands' in currentStepContent && Array.isArray(currentStepContent.commands) && (
                  <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Practice Commands
                    </h4>
                    <div className="space-y-3">
                      {currentStepContent.commands.map((command: string, index: number) => (
                        <div key={index} className="bg-white rounded border p-3">
                          <div className="flex items-center justify-between">
                            <code className="text-sm font-mono text-gray-800 flex-1">
                              {command}
                            </code>
                            <button
                              onClick={() => copyToClipboard(command)}
                              className="ml-2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                              title="Copy to clipboard"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step Actions */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {!completedSteps.has(currentStep) && (
                      <button
                        onClick={() => handleStepComplete(currentStep)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Mark as Complete
                      </button>
                    )}
                    
                    {completedSteps.has(currentStep) && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Completed</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {currentStep > 0 && (
                      <button
                        onClick={prevStep}
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                    )}
                    
                    {currentStep < tool.steps.length - 1 && (
                      <button
                        onClick={nextStep}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Book className="h-5 w-5 mr-2" />
                💡 Practice Tips
              </h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Copy commands and run them in your terminal or playground</li>
                <li>• Modify parameters to see different results</li>
                <li>• Try combining multiple commands for complex workflows</li>
                <li>• Use the playground environment for safe experimentation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPage;

