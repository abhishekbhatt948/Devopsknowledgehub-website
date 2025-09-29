import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import ToolPage from './components/ToolPage';
import SearchResults from './components/SearchResults';
import GuidesPage from './components/GuidesPage';
import Playground from './components/Playground';
import ProfilePage from './components/ProfilePage';
import AuthModal from './components/AuthModal';
import { Search, BookOpen, Code, Play, Home, Container, Settings, Wrench, Building, Cog, Package, Cloud, BarChart3, Shield, User, LogOut, Terminal, GitBranch, Database, Lock, Server, Network, HardDrive, Zap, Eye, AlertTriangle, FileText, Layers, Activity, Globe, Cpu, MonitorSpeaker } from 'lucide-react';

const AppContent = () => {
  const { user, profile, signOut } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTool, setSelectedTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);


  const tools = [
    // Fundamentals
    { 
      id: 'linux', 
      name: 'Linux Commands', 
      category: 'Fundamentals', 
      icon: Terminal, 
      color: 'bg-gray-600',
      description: 'Master Linux command line from basic to advanced level',
      steps: ['Basic Commands', 'File Operations', 'Process Management', 'Network Commands', 'System Administration', 'Shell Scripting', 'Advanced Commands', 'Performance Monitoring', 'Log Analysis', 'Security Commands', 'Automation']
    },
    { 
      id: 'shell-scripting', 
      name: 'Shell Scripting', 
      category: 'Fundamentals', 
      icon: FileText, 
      color: 'bg-green-600',
      description: 'Learn Bash scripting for automation and system administration',
      steps: ['Bash Basics', 'Variables & Arrays', 'Control Structures', 'Functions', 'File Processing', 'Error Handling', 'Advanced Scripting', 'Debugging', 'Best Practices', 'Real-world Examples']
    },
    { 
      id: 'python-devops', 
      name: 'Python for DevOps', 
      category: 'Fundamentals', 
      icon: Code, 
      color: 'bg-yellow-600',
      description: 'Python programming for DevOps automation and tooling',
      steps: ['Python Basics', 'File & System Operations', 'API Integration', 'Automation Scripts', 'Configuration Management', 'Testing', 'Packaging', 'CLI Tools', 'AWS SDK', 'Advanced Libraries']
    },
    { 
      id: 'git', 
      name: 'Git Version Control', 
      category: 'Fundamentals', 
      icon: GitBranch, 
      color: 'bg-orange-600',
      description: 'Master Git for version control and collaboration',
      steps: ['Git Basics', 'Branching & Merging', 'Remote Repositories', 'Conflict Resolution', 'Git Workflows', 'Advanced Commands', 'Git Hooks', 'Best Practices', 'Troubleshooting', 'Enterprise Git']
    },
    { 
      id: 'networking', 
      name: 'Networking Concepts', 
      category: 'Fundamentals', 
      icon: Network, 
      color: 'bg-cyan-600',
      description: 'Essential networking concepts for DevOps and Cloud',
      steps: ['OSI Model', 'TCP/IP', 'DNS & DHCP', 'Load Balancing', 'VPN & Security', 'Firewalls', 'Subnetting', 'Routing', 'Network Troubleshooting', 'Cloud Networking']
    },
    
    // Containerization & Orchestration
    { 
      id: 'docker', 
      name: 'Docker', 
      category: 'Containerization', 
      icon: Container, 
      color: 'bg-blue-500',
      description: 'Master containerization with Docker from basics to production',
      steps: ['Installation', 'Basic Commands', 'Dockerfile', 'Images', 'Containers', 'Volumes', 'Networks', 'Docker Compose', 'Registry', 'Best Practices']
    },
    { 
      id: 'docker-compose', 
      name: 'Docker Compose', 
      category: 'Containerization', 
      icon: Layers, 
      color: 'bg-blue-600',
      description: 'Multi-container application orchestration with Docker Compose',
      steps: ['Compose Basics', 'YAML Configuration', 'Services', 'Networks & Volumes', 'Environment Variables', 'Scaling', 'Production Setup', 'Monitoring', 'Troubleshooting', 'Advanced Patterns']
    },
    { 
      id: 'kubernetes', 
      name: 'Kubernetes', 
      category: 'Orchestration', 
      icon: Settings, 
      color: 'bg-blue-600',
      description: 'Container orchestration platform for production workloads',
      steps: ['Setup', 'Pods', 'Deployments', 'Services', 'ConfigMaps', 'Secrets', 'Ingress', 'Volumes', 'Monitoring', 'Scaling', 'Troubleshooting']
    },
    { 
      id: 'helm', 
      name: 'Helm', 
      category: 'Orchestration', 
      icon: Package, 
      color: 'bg-indigo-500',
      description: 'Kubernetes package manager for application deployment',
      steps: ['Installation', 'Charts', 'Values', 'Templates', 'Dependencies', 'Repositories', 'Releases', 'Hooks', 'Testing', 'Packaging', 'Best Practices']
    },
    
    // CI/CD & Automation
    { 
      id: 'jenkins', 
      name: 'Jenkins', 
      category: 'CI/CD', 
      icon: Wrench, 
      color: 'bg-orange-500',
      description: 'Continuous Integration and Deployment with Jenkins',
      steps: ['Installation', 'Configuration', 'Jobs', 'Pipelines', 'Plugins', 'Build Triggers', 'Deployment', 'Integration', 'Security', 'Monitoring', 'Best Practices']
    },
    { 
      id: 'github-actions', 
      name: 'GitHub Actions', 
      category: 'CI/CD', 
      icon: GitBranch, 
      color: 'bg-gray-800',
      description: 'CI/CD workflows with GitHub Actions',
      steps: ['Workflow Basics', 'Actions & Jobs', 'Triggers & Events', 'Secrets Management', 'Matrix Builds', 'Custom Actions', 'Deployment', 'Monitoring', 'Security', 'Advanced Workflows']
    },
    { 
      id: 'gitlab-ci', 
      name: 'GitLab CI/CD', 
      category: 'CI/CD', 
      icon: GitBranch, 
      color: 'bg-orange-600',
      description: 'Continuous Integration with GitLab CI/CD pipelines',
      steps: ['Pipeline Basics', 'Jobs & Stages', 'Runners', 'Variables & Secrets', 'Artifacts', 'Environments', 'Auto DevOps', 'Security Scanning', 'Monitoring', 'Advanced Pipelines']
    },
    { 
      id: 'argocd', 
      name: 'ArgoCD', 
      category: 'CI/CD', 
      icon: GitBranch, 
      color: 'bg-blue-700',
      description: 'GitOps continuous delivery for Kubernetes',
      steps: ['Installation', 'Applications', 'Repositories', 'Sync Policies', 'RBAC', 'Multi-cluster', 'Helm Integration', 'Monitoring', 'Troubleshooting', 'Best Practices']
    },
    
    // Infrastructure as Code
    { 
      id: 'terraform', 
      name: 'Terraform', 
      category: 'Infrastructure', 
      icon: Building, 
      color: 'bg-purple-500',
      description: 'Infrastructure as Code with Terraform',
      steps: ['Installation', 'Configuration', 'Providers', 'Resources', 'Variables', 'Outputs', 'Modules', 'State Management', 'Planning', 'Apply', 'Destroy']
    },
    { 
      id: 'ansible', 
      name: 'Ansible', 
      category: 'Configuration', 
      icon: Cog, 
      color: 'bg-red-500',
      description: 'Configuration management and automation with Ansible',
      steps: ['Installation', 'Inventory', 'Playbooks', 'Tasks', 'Variables', 'Templates', 'Roles', 'Handlers', 'Vault', 'Galaxy', 'Best Practices']
    },
    { 
      id: 'chef', 
      name: 'Chef', 
      category: 'Configuration', 
      icon: Cog, 
      color: 'bg-orange-700',
      description: 'Infrastructure automation with Chef',
      steps: ['Chef Basics', 'Cookbooks', 'Recipes', 'Resources', 'Attributes', 'Templates', 'Chef Server', 'Knife Tool', 'Testing', 'Best Practices']
    },
    { 
      id: 'puppet', 
      name: 'Puppet', 
      category: 'Configuration', 
      icon: Cog, 
      color: 'bg-purple-700',
      description: 'Configuration management with Puppet',
      steps: ['Puppet Basics', 'Manifests', 'Modules', 'Classes', 'Resources', 'Hiera', 'Puppet Server', 'Environments', 'Testing', 'Best Practices']
    },
    
    // Cloud Platforms
    { 
      id: 'aws', 
      name: 'AWS DevOps', 
      category: 'Cloud', 
      icon: Cloud, 
      color: 'bg-yellow-500',
      description: 'Amazon Web Services for DevOps and Cloud Engineering',
      steps: ['Setup', 'CodeCommit', 'CodeBuild', 'CodeDeploy', 'CodePipeline', 'CloudFormation', 'ECS', 'EKS', 'Lambda', 'Monitoring', 'Security']
    },
    { 
      id: 'azure-devops', 
      name: 'Azure DevOps', 
      category: 'Cloud', 
      icon: Cloud, 
      color: 'bg-blue-700',
      description: 'Microsoft Azure cloud platform and DevOps services',
      steps: ['Azure Basics', 'Resource Groups', 'ARM Templates', 'Azure DevOps', 'AKS', 'Azure Functions', 'Key Vault', 'Monitor', 'Security', 'Cost Management']
    },
    { 
      id: 'gcp', 
      name: 'Google Cloud Platform', 
      category: 'Cloud', 
      icon: Cloud, 
      color: 'bg-red-600',
      description: 'Google Cloud Platform services and DevOps tools',
      steps: ['GCP Basics', 'Compute Engine', 'GKE', 'Cloud Build', 'Cloud Functions', 'IAM', 'Networking', 'Monitoring', 'Security', 'Cost Optimization']
    },
    { 
      id: 'aws-services', 
      name: 'AWS Core Services', 
      category: 'Cloud', 
      icon: Server, 
      color: 'bg-orange-600',
      description: 'Essential AWS services for cloud engineering',
      steps: ['EC2', 'S3', 'RDS', 'VPC', 'IAM', 'CloudWatch', 'Lambda', 'ELB', 'Auto Scaling', 'Route 53', 'CloudFront']
    },
    
    // Monitoring & Observability
    { 
      id: 'monitoring', 
      name: 'Monitoring', 
      category: 'Observability', 
      icon: BarChart3, 
      color: 'bg-green-500',
      description: 'Comprehensive monitoring and observability practices',
      steps: ['Metrics', 'Logging', 'Tracing', 'Alerting', 'Dashboards', 'Prometheus', 'Grafana', 'ELK Stack', 'APM', 'SLI/SLO', 'Incident Response']
    },
    { 
      id: 'prometheus', 
      name: 'Prometheus', 
      category: 'Observability', 
      icon: Activity, 
      color: 'bg-orange-500',
      description: 'Metrics collection and monitoring with Prometheus',
      steps: ['Installation', 'Configuration', 'Metrics', 'PromQL', 'Alerting', 'Service Discovery', 'Exporters', 'Federation', 'High Availability', 'Best Practices']
    },
    { 
      id: 'grafana', 
      name: 'Grafana', 
      category: 'Observability', 
      icon: BarChart3, 
      color: 'bg-orange-600',
      description: 'Data visualization and monitoring dashboards',
      steps: ['Installation', 'Data Sources', 'Dashboards', 'Panels', 'Variables', 'Alerting', 'Plugins', 'User Management', 'API', 'Advanced Features']
    },
    { 
      id: 'elk-stack', 
      name: 'ELK Stack', 
      category: 'Observability', 
      icon: Search, 
      color: 'bg-yellow-600',
      description: 'Elasticsearch, Logstash, and Kibana for log management',
      steps: ['Elasticsearch', 'Logstash', 'Kibana', 'Beats', 'Index Management', 'Search Queries', 'Visualizations', 'Alerting', 'Security', 'Performance Tuning']
    },
    { 
      id: 'cloudwatch', 
      name: 'AWS CloudWatch', 
      category: 'Observability', 
      icon: Eye, 
      color: 'bg-blue-600',
      description: 'AWS native monitoring and logging service',
      steps: ['Metrics', 'Logs', 'Alarms', 'Dashboards', 'Events', 'Insights', 'Synthetics', 'Application Insights', 'Cost Optimization', 'Best Practices']
    },
    
    // Security & Compliance
    { 
      id: 'security', 
      name: 'Security', 
      category: 'DevSecOps', 
      icon: Shield, 
      color: 'bg-red-600',
      description: 'DevSecOps practices and security automation',
      steps: ['Security Scanning', 'Vulnerability Assessment', 'SAST', 'DAST', 'Container Security', 'Secrets Management', 'Compliance', 'Access Control', 'Audit Logging', 'Incident Response', 'Best Practices']
    },
    { 
      id: 'vault', 
      name: 'HashiCorp Vault', 
      category: 'DevSecOps', 
      icon: Lock, 
      color: 'bg-purple-600',
      description: 'Secrets management and data protection',
      steps: ['Installation', 'Authentication', 'Secrets Engines', 'Policies', 'Tokens', 'Dynamic Secrets', 'Encryption', 'PKI', 'Database Secrets', 'Best Practices']
    },
    { 
      id: 'rbac', 
      name: 'RBAC & IAM', 
      category: 'DevSecOps', 
      icon: User, 
      color: 'bg-indigo-600',
      description: 'Role-Based Access Control and Identity Management',
      steps: ['RBAC Concepts', 'Kubernetes RBAC', 'AWS IAM', 'Azure AD', 'Service Accounts', 'Policies', 'Multi-factor Auth', 'Audit Logging', 'Compliance', 'Best Practices']
    },
    { 
      id: 'kms', 
      name: 'Key Management', 
      category: 'DevSecOps', 
      icon: Lock, 
      color: 'bg-gray-700',
      description: 'Encryption and key management services',
      steps: ['KMS Basics', 'AWS KMS', 'Azure Key Vault', 'Encryption at Rest', 'Encryption in Transit', 'Key Rotation', 'HSM', 'Certificate Management', 'Compliance', 'Best Practices']
    },
    
    // Virtualization & Infrastructure
    { 
      id: 'virtualization', 
      name: 'Virtualization', 
      category: 'Infrastructure', 
      icon: Cpu, 
      color: 'bg-purple-600',
      description: 'Virtual machines and hypervisor technologies',
      steps: ['VM Concepts', 'Hypervisors', 'VMware', 'VirtualBox', 'KVM', 'Xen', 'Resource Management', 'Networking', 'Storage', 'Migration', 'Best Practices']
    },
    { 
      id: 'ecs-eks', 
      name: 'Container Services', 
      category: 'Orchestration', 
      icon: Container, 
      color: 'bg-yellow-700',
      description: 'AWS ECS, EKS, and other container orchestration services',
      steps: ['ECS Basics', 'EKS Setup', 'Task Definitions', 'Services', 'Fargate', 'Load Balancing', 'Auto Scaling', 'Networking', 'Security', 'Monitoring', 'Cost Optimization']
    },
    
    // Databases & Storage
    { 
      id: 'cloud-databases', 
      name: 'Cloud Databases', 
      category: 'Database', 
      icon: Database, 
      color: 'bg-green-700',
      description: 'Database services in cloud platforms',
      steps: ['RDS', 'DynamoDB', 'Aurora', 'Cosmos DB', 'Cloud SQL', 'Database Migration', 'Backup & Recovery', 'Performance Tuning', 'Security', 'Cost Optimization']
    },
    { 
      id: 'backup-recovery', 
      name: 'Backup & Disaster Recovery', 
      category: 'Database', 
      icon: HardDrive, 
      color: 'bg-red-700',
      description: 'Data protection and disaster recovery strategies',
      steps: ['Backup Strategies', 'Recovery Planning', 'RTO & RPO', 'Cloud Backup', 'Cross-region Replication', 'Testing', 'Automation', 'Compliance', 'Cost Management', 'Best Practices']
    },
    
    // Serverless & Functions
    { 
      id: 'serverless', 
      name: 'Serverless Computing', 
      category: 'Cloud', 
      icon: Zap, 
      color: 'bg-purple-700',
      description: 'AWS Lambda, Azure Functions, and serverless architectures',
      steps: ['Serverless Concepts', 'AWS Lambda', 'Azure Functions', 'Event-driven Architecture', 'API Gateway', 'Monitoring', 'Security', 'Cost Optimization', 'Best Practices', 'Troubleshooting']
    },
    { 
      id: 'sns-sqs', 
      name: 'Messaging Services', 
      category: 'Cloud', 
      icon: MonitorSpeaker, 
      color: 'bg-green-800',
      description: 'AWS SNS, SQS, and other messaging services',
      steps: ['SNS Basics', 'SQS Queues', 'Event Bridge', 'Message Patterns', 'Dead Letter Queues', 'Filtering', 'Security', 'Monitoring', 'Cost Optimization', 'Best Practices']
    },
    
    // Advanced Topics
    { 
      id: 'gitops', 
      name: 'GitOps', 
      category: 'Best Practices', 
      icon: GitBranch, 
      color: 'bg-teal-600',
      description: 'GitOps methodology and implementation',
      steps: ['GitOps Principles', 'Git Workflows', 'ArgoCD', 'Flux', 'Repository Structure', 'Security', 'Multi-environment', 'Rollbacks', 'Monitoring', 'Best Practices']
    },
    { 
      id: 'sre', 
      name: 'Site Reliability Engineering', 
      category: 'Best Practices', 
      icon: AlertTriangle, 
      color: 'bg-red-800',
      description: 'SRE principles, SLIs, SLOs, and reliability practices',
      steps: ['SRE Fundamentals', 'SLI/SLO/SLA', 'Error Budgets', 'Incident Management', 'Postmortems', 'Monitoring', 'Capacity Planning', 'Automation', 'On-call', 'Culture']
    },
    { 
      id: 'microservices', 
      name: 'Microservices Architecture', 
      category: 'Architecture', 
      icon: Globe, 
      color: 'bg-blue-800',
      description: 'Design and implement microservices architectures',
      steps: ['Microservices Patterns', 'Service Mesh', 'API Gateway', 'Service Discovery', 'Circuit Breakers', 'Distributed Tracing', 'Data Management', 'Security', 'Testing', 'Migration Strategies']
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = tools.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setCurrentView('search');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setCurrentView('tool');
  };

  const handlePlaygroundSelect = (tool) => {
    setSelectedTool(tool || tools[0]);
    setCurrentView('playground');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tool':
        return <ToolPage tool={selectedTool} onBack={() => setCurrentView('dashboard')} onPlayground={handlePlaygroundSelect} />;
      case 'search':
        return <SearchResults results={searchResults} onToolSelect={handleToolSelect} onBack={() => setCurrentView('dashboard')} />;
      case 'guides':
        return <GuidesPage tools={tools} onToolSelect={handleToolSelect} onBack={() => setCurrentView('dashboard')} />;
      case 'playground':
        return <Playground tool={selectedTool} onBack={() => setCurrentView('dashboard')} />;
      case 'profile':
        return <ProfilePage onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard tools={tools} onToolSelect={handleToolSelect} onBrowseGuides={() => setCurrentView('guides')} onPlayground={handlePlaygroundSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2 text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Code className="w-8 h-8" />
                <span>DevopsGuidebyAB</span>
              </button>
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setCurrentView('guides')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'guides' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Guides</span>
                </button>
              </nav>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tools, guides, or commands..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
             focus:ring-2 focus:ring-blue-500 focus:border-transparent 
             text-white placeholder-gray-400 focus:bg-gray-700"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:block">{profile?.full_name || 'User'}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;