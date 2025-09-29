// Code validation utilities for different DevOps tools
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  executionTime: number;
  resourcesCreated?: string[];
  nextSteps?: string[];
}

// Docker validation
export const validateDockerfile = (code: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  const lines = code.split('\n').filter(line => line.trim());
  
  // Check for FROM instruction
  const hasFrom = lines.some(line => line.trim().toUpperCase().startsWith('FROM'));
  if (!hasFrom) {
    errors.push('Dockerfile must start with a FROM instruction');
  }
  
  // Check for common issues
  lines.forEach((line, index) => {
    const trimmed = line.trim().toUpperCase();
    
    // Check for COPY before WORKDIR
    if (trimmed.startsWith('COPY') && !lines.slice(0, index).some(l => l.trim().toUpperCase().startsWith('WORKDIR'))) {
      warnings.push(`Line ${index + 1}: Consider setting WORKDIR before COPY`);
    }
    
    // Check for EXPOSE
    if (trimmed.startsWith('EXPOSE')) {
      const port = trimmed.split(' ')[1];
      if (!port || isNaN(Number(port))) {
        errors.push(`Line ${index + 1}: EXPOSE requires a valid port number`);
      }
    }
    
    // Check for RUN apt-get update without clean
    if (trimmed.includes('APT-GET UPDATE') && !trimmed.includes('APT-GET CLEAN')) {
      suggestions.push(`Line ${index + 1}: Consider adding 'apt-get clean' to reduce image size`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};

// Kubernetes validation
export const validateKubernetes = (code: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  try {
    // Basic YAML structure validation
    const yamlDocs = code.split('---').filter(doc => doc.trim());
    
    yamlDocs.forEach((doc, docIndex) => {
      // Check for required fields
      if (!doc.includes('apiVersion:')) {
        errors.push(`Document ${docIndex + 1}: Missing apiVersion field`);
      }
      if (!doc.includes('kind:')) {
        errors.push(`Document ${docIndex + 1}: Missing kind field`);
      }
      if (!doc.includes('metadata:')) {
        errors.push(`Document ${docIndex + 1}: Missing metadata field`);
      }
      
      // Check for common issues
      if (doc.includes('kind: Deployment')) {
        if (!doc.includes('replicas:')) {
          warnings.push(`Document ${docIndex + 1}: Deployment without explicit replicas (will default to 1)`);
        }
        if (!doc.includes('resources:')) {
          suggestions.push(`Document ${docIndex + 1}: Consider adding resource limits and requests`);
        }
      }
      
      // Check for security best practices
      if (doc.includes('privileged: true')) {
        warnings.push(`Document ${docIndex + 1}: Running privileged containers is a security risk`);
      }
    });
    
  } catch (error) {
    errors.push('Invalid YAML syntax');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};

// Jenkins pipeline validation
export const validateJenkinsPipeline = (code: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check for pipeline structure
  if (!code.includes('pipeline {')) {
    errors.push('Jenkins pipeline must start with "pipeline {"');
  }
  
  if (!code.includes('agent')) {
    errors.push('Pipeline must specify an agent');
  }
  
  if (!code.includes('stages {')) {
    errors.push('Pipeline must contain stages block');
  }
  
  // Check for common patterns
  const lines = code.split('\n');
  let inStage = false;
  let stageCount = 0;
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('stage(')) {
      inStage = true;
      stageCount++;
    }
    
    if (inStage && trimmed.includes('steps {')) {
      inStage = false;
    }
    
    // Check for shell commands without proper escaping
    if (trimmed.includes('sh ') && !trimmed.includes("'") && !trimmed.includes('"')) {
      warnings.push(`Line ${index + 1}: Shell commands should be quoted`);
    }
  });
  
  if (stageCount === 0) {
    errors.push('Pipeline must contain at least one stage');
  }
  
  if (!code.includes('post {')) {
    suggestions.push('Consider adding post-build actions for cleanup and notifications');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};

// Terraform validation
export const validateTerraform = (code: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  const lines = code.split('\n');
  let hasProvider = false;
  let hasResource = false;
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('provider ')) {
      hasProvider = true;
    }
    
    if (trimmed.startsWith('resource ')) {
      hasResource = true;
      
      // Check resource naming
      const resourceMatch = trimmed.match(/resource\s+"([^"]+)"\s+"([^"]+)"/);
      if (resourceMatch) {
        const [, resourceType, resourceName] = resourceMatch;
        if (resourceName.includes('-')) {
          warnings.push(`Line ${index + 1}: Resource names should use underscores, not hyphens`);
        }
      }
    }
    
    // Check for hardcoded values
    if (trimmed.includes('ami-') && !trimmed.includes('data.')) {
      suggestions.push(`Line ${index + 1}: Consider using data sources instead of hardcoded AMI IDs`);
    }
    
    // Check for missing tags
    if (trimmed.startsWith('resource "aws_instance"') && !code.includes('tags = {')) {
      suggestions.push('Consider adding tags to AWS resources for better organization');
    }
  });
  
  if (!hasProvider && hasResource) {
    warnings.push('Resources defined without provider configuration');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};

// Ansible validation
export const validateAnsible = (code: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  try {
    // Check for YAML structure
    if (!code.includes('---')) {
      warnings.push('Ansible playbooks typically start with "---"');
    }
    
    if (!code.includes('hosts:')) {
      errors.push('Playbook must specify hosts');
    }
    
    if (!code.includes('tasks:')) {
      errors.push('Playbook must contain tasks');
    }
    
    // Check for best practices
    if (code.includes('become: yes') && !code.includes('become_user:')) {
      suggestions.push('Consider specifying become_user when using privilege escalation');
    }
    
    if (code.includes('shell:') || code.includes('command:')) {
      suggestions.push('Consider using specific modules instead of shell/command when possible');
    }
    
    // Check for handlers
    if (code.includes('notify:') && !code.includes('handlers:')) {
      errors.push('Playbook uses notify but no handlers are defined');
    }
    
  } catch (error) {
    errors.push('Invalid YAML syntax');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};

// Helm validation
export const validateHelm = (code: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check for Chart.yaml
  if (code.includes('apiVersion:') && code.includes('name:') && code.includes('version:')) {
    if (!code.includes('description:')) {
      warnings.push('Chart.yaml should include a description');
    }
    if (!code.includes('appVersion:')) {
      suggestions.push('Consider adding appVersion to Chart.yaml');
    }
  }
  
  // Check for values.yaml structure
  if (code.includes('replicaCount:') || code.includes('image:')) {
    if (!code.includes('resources:')) {
      suggestions.push('Consider defining resource limits in values.yaml');
    }
  }
  
  // Check for template syntax
  const templateMatches = code.match(/\{\{[^}]+\}\}/g);
  if (templateMatches) {
    templateMatches.forEach(match => {
      if (!match.includes('.Values') && !match.includes('include')) {
        warnings.push(`Template expression "${match}" might be invalid`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};

// Main validation function
export const validateCode = (tool: string, code: string): ValidationResult => {
  switch (tool) {
    case 'docker':
      return validateDockerfile(code);
    case 'kubernetes':
      return validateKubernetes(code);
    case 'jenkins':
      return validateJenkinsPipeline(code);
    case 'terraform':
      return validateTerraform(code);
    case 'ansible':
      return validateAnsible(code);
    case 'helm':
      return validateHelm(code);
    default:
      return { isValid: true, errors: [], warnings: [], suggestions: [] };
  }
};

// Simulate code execution with realistic results
export const simulateExecution = (tool: string, code: string, validation: ValidationResult): ExecutionResult => {
  const startTime = Date.now();
  
  if (!validation.isValid) {
    return {
      success: false,
      output: `❌ Execution failed due to validation errors:\n\n${validation.errors.join('\n')}`,
      executionTime: Date.now() - startTime
    };
  }
  
  // Simulate execution time based on complexity
  const complexity = code.split('\n').length;
  const simulatedTime = Math.min(complexity * 100 + Math.random() * 1000, 5000);
  
  setTimeout(() => {}, simulatedTime);
  
  let output = '';
  let resourcesCreated: string[] = [];
  let nextSteps: string[] = [];
  
  switch (tool) {
    case 'docker':
      if (code.includes('FROM')) {
        output = `🐳 Docker Build Results:
        
Building image...
Step 1/${code.split('\n').filter(l => /^(FROM|RUN|COPY|ADD|WORKDIR|EXPOSE|CMD|ENTRYPOINT)\s/.test(l.trim())).length}: FROM ${code.match(/FROM\s+(\S+)/)?.[1] || 'base-image'}
 ---> Using cached image
${code.includes('COPY') ? 'Step 2/X: COPY . .\n ---> Copying files...' : ''}
${code.includes('RUN') ? 'Step X/X: RUN commands\n ---> Running installation...' : ''}
${code.includes('EXPOSE') ? `Step X/X: EXPOSE ${code.match(/EXPOSE\s+(\d+)/)?.[1] || '80'}\n ---> Exposing port` : ''}

✅ Successfully built image: myapp:latest
Image size: ${Math.floor(Math.random() * 500 + 100)}MB`;
        
        resourcesCreated = ['Docker Image: myapp:latest'];
        nextSteps = ['Run: docker run -p 8080:80 myapp:latest', 'Push to registry: docker push myapp:latest'];
      }
      break;
      
    case 'kubernetes':
      {
        const resources = [];
        if (code.includes('kind: Deployment')) resources.push('Deployment');
        if (code.includes('kind: Service')) resources.push('Service');
        if (code.includes('kind: Ingress')) resources.push('Ingress');
        
        output = `☸️ Kubernetes Deployment Results:

${resources.map(r => `${r.toLowerCase()}.apps/myapp created`).join('\n')}

Waiting for deployment to be ready...
deployment "myapp" successfully rolled out

Pods Status:
NAME                     READY   STATUS    RESTARTS   AGE
myapp-${Math.random().toString(36).substr(2, 9)}   1/1     Running   0          30s
myapp-${Math.random().toString(36).substr(2, 9)}   1/1     Running   0          30s

✅ All resources deployed successfully!`;
        
        resourcesCreated = resources.map(r => `${r}: myapp`);
        nextSteps = ['Check pods: kubectl get pods', 'View logs: kubectl logs -l app=myapp'];
        break;
      }
      
    case 'jenkins':
      {
        const stages = code.match(/stage\s*\(\s*['"]([^'"]+)['"]/g)?.map(s => s.match(/['"]([^'"]+)['"]/)?.[1]) || [];
        
        output = `🔧 Jenkins Pipeline Execution:

Started by user admin
Running in Durability level: MAX_SURVIVABILITY
[Pipeline] Start of Pipeline

${stages.map((stage, i) => `[Pipeline] stage (${stage})
[Pipeline] echo
✅ ${stage} completed successfully`).join('\n')}

[Pipeline] End of Pipeline
Finished: SUCCESS

Build Duration: ${Math.floor(simulatedTime / 1000)}s`;
        
        resourcesCreated = [`Build #${Math.floor(Math.random() * 100 + 1)}`];
        nextSteps = ['View build logs', 'Configure webhooks', 'Set up notifications'];
        break;
      }
      
    case 'terraform':
      {
        const resources = code.match(/resource\s+"([^"]+)"\s+"([^"]+)"/g)?.map(r => {
          const match = r.match(/resource\s+"([^"]+)"\s+"([^"]+)"/);
          return match ? `${match[1]}.${match[2]}` : '';
        }).filter(Boolean) || [];
        
        output = `🏗️ Terraform Apply Results:

Initializing the backend...
Initializing provider plugins...

Terraform used the selected providers to generate the following execution plan:

${resources.map(r => `  # ${r} will be created
  + resource "${r}" {
      + id = (known after apply)
    }`).join('\n\n')}

Plan: ${resources.length} to add, 0 to change, 0 to destroy.

Applying changes...
${resources.map(r => `${r}: Creating...
${r}: Creation complete after ${Math.floor(Math.random() * 30 + 10)}s`).join('\n')}

✅ Apply complete! Resources: ${resources.length} added, 0 changed, 0 destroyed.`;
        
        resourcesCreated = resources;
        nextSteps = ['terraform show', 'terraform output', 'terraform destroy (when done)'];
        break;
      }
      
    case 'ansible':
      {
        const tasks = code.match(/- name:\s*(.+)/g)?.map(t => t.replace(/- name:\s*/, '')) || [];
        
        output = `⚙️ Ansible Playbook Execution:

PLAY [${code.match(/name:\s*(.+)/)?.[1] || 'Playbook'}] ${'*'.repeat(50)}

${tasks.map((task, i) => `TASK [${task}] ${'*'.repeat(Math.max(50 - task.length, 10))}
${Math.random() > 0.3 ? 'changed' : 'ok'}: [target-host]`).join('\n\n')}

PLAY RECAP ${'*'.repeat(60)}
target-host                : ok=${tasks.length}    changed=${Math.floor(tasks.length * 0.7)}    unreachable=0    failed=0

✅ Playbook executed successfully!`;
        
        resourcesCreated = tasks;
        nextSteps = ['Verify changes on target hosts', 'Run with --check for dry run'];
        break;
      }
      
    case 'helm':
      output = `⎈ Helm Chart Deployment:

NAME: myapp
LAST DEPLOYED: ${new Date().toLocaleString()}
NAMESPACE: default
STATUS: deployed
REVISION: 1

RESOURCES:
==> v1/Deployment
NAME     READY  UP-TO-DATE  AVAILABLE  AGE
myapp    ${code.includes('replicaCount') ? code.match(/replicaCount:\s*(\d+)/)?.[1] || '1' : '1'}/1    1           1          30s

==> v1/Service
NAME            TYPE       CLUSTER-IP     EXTERNAL-IP  PORT(S)   AGE
myapp-service  ClusterIP  10.96.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}   <none>       80/TCP    30s

✅ Chart deployed successfully!`;
      
      resourcesCreated = ['Helm Release: myapp'];
      nextSteps = ['helm status myapp', 'helm upgrade myapp ./chart', 'helm uninstall myapp'];
      break;
  }
  
  return {
    success: true,
    output,
    executionTime: Date.now() - startTime,
    resourcesCreated,
    nextSteps
  };
};