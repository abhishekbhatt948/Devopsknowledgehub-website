// validators.ts
export const validators: Record<string, (code: string) => string[]> = {
  docker: (code: string) => {
    const errors: string[] = [];
    if (!/^FROM\s+/m.test(code)) {
      errors.push("Dockerfile must start with a FROM instruction.");
    }
    if (/FROM\s+[^\s:]+$/.test(code)) {
      errors.push("FROM instruction should include a version tag (e.g., node:16).");
    }
    if (!/CMD\s+\[.*\]/m.test(code) && !/ENTRYPOINT/m.test(code)) {
      errors.push("Missing CMD or ENTRYPOINT instruction.");
    }
    return errors;
  },

  kubernetes: (code: string) => {
    const errors: string[] = [];
    if (!/apiVersion:/m.test(code)) errors.push("Missing apiVersion field.");
    if (!/kind:/m.test(code)) errors.push("Missing kind field.");
    if (!/metadata:/m.test(code)) errors.push("Missing metadata field.");
    if (!/spec:/m.test(code)) errors.push("Missing spec field.");
    return errors;
  },

  terraform: (code: string) => {
    const errors: string[] = [];
    if (!/resource\s+"/.test(code)) errors.push("Terraform config must define at least one resource.");
    if (!/provider\s+"/.test(code)) errors.push("Provider block is missing.");
    return errors;
  },

  ansible: (code: string) => {
    const errors: string[] = [];
    if (!/hosts:/.test(code)) errors.push("Playbook must define 'hosts'.");
    if (!/tasks:/.test(code)) errors.push("Playbook must contain tasks.");
    return errors;
  },

  jenkins: (code: string) => {
    const errors: string[] = [];
    if (!/pipeline\s*\{/.test(code)) errors.push("Jenkinsfile must start with a pipeline block.");
    if (!/stages\s*\{/.test(code)) errors.push("Pipeline must contain stages.");
    return errors;
  },

  helm: (code: string) => {
    const errors: string[] = [];
    if (!/apiVersion: v2/.test(code)) errors.push("Chart.yaml must define apiVersion: v2.");
    if (!/name:/.test(code)) errors.push("Chart.yaml must include a name.");
    return errors;
  }
};
