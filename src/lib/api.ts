import {
  Company,
  WorkCenter,
  Worker,
  RiskMatrix,
  RiskMethodology,
  PreventiveProgram,
  PreventiveAction,
  Evidence,
  Training,
  WorkerTraining,
  Inspection,
  Incident,
  TenantComplianceRequirement,
  ComplianceScoreSummary,
  ComplianceInboxItem,
  DocumentItem,
  AuditLog,
  NotificationItem,
  IndustryTemplate,
  User,
} from '../types';

const API_BASE = '/api';

class ApiClient {
  private tenantId = 'tenant-andes';
  private userId = 'usr-prev';

  public setTenantId(id: string) {
    this.tenantId = id;
  }

  public setUserId(id: string) {
    this.userId = id;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      'x-tenant-id': this.tenantId,
      'x-user-id': this.userId,
      ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }

    return res.json();
  }

  // Auth & Profile
  public async getMe(): Promise<{ user: User; company: Company; allUsers: User[] }> {
    return this.request('/auth/me');
  }

  public async switchRole(role: string): Promise<{ success: boolean; user: User }> {
    const data = await this.request<{ success: boolean; user: User }>('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    if (data.user) {
      this.userId = data.user.id;
    }
    return data;
  }

  // Company
  public async getCompany(): Promise<Company> {
    return this.request('/company');
  }

  public async updateCompany(data: Partial<Company>): Promise<Company> {
    return this.request('/company', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async getWorkCenters(): Promise<WorkCenter[]> {
    return this.request('/work-centers');
  }

  public async createWorkCenter(data: Partial<WorkCenter>): Promise<WorkCenter> {
    return this.request('/work-centers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Workers
  public async getWorkers(params?: { workCenterId?: string; status?: string; search?: string }): Promise<Worker[]> {
    const qs = new URLSearchParams(params as any).toString();
    return this.request(`/workers${qs ? `?${qs}` : ''}`);
  }

  public async createWorker(data: Partial<Worker>): Promise<Worker> {
    return this.request('/workers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async importWorkers(workersList: any[]): Promise<{ success: boolean; count: number }> {
    return this.request('/workers/import', {
      method: 'POST',
      body: JSON.stringify({ workersList }),
    });
  }

  // MIPER
  public async getRiskMatrices(): Promise<RiskMatrix[]> {
    return this.request('/risk-matrices');
  }

  public async getMiperMatrix(): Promise<RiskMatrix | null> {
    const list = await this.getRiskMatrices();
    return list[0] || null;
  }

  public async getRiskMethodologies(): Promise<RiskMethodology[]> {
    return this.request('/risk-methodologies');
  }

  public async addRiskAssessment(matrixId: string, data: any): Promise<any> {
    return this.request(`/risk-matrices/${matrixId}/assessments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async addMiperAssessment(data: any): Promise<RiskMatrix> {
    const matrix = await this.getMiperMatrix();
    const matrixId = matrix ? matrix.id : 'miper-andes-01';
    await this.addRiskAssessment(matrixId, data);
    return (await this.getMiperMatrix())!;
  }

  public async createMiperVersion(versionName: string, changelog: string): Promise<RiskMatrix> {
    const matrix = await this.getMiperMatrix();
    const matrixId = matrix ? matrix.id : 'miper-andes-01';
    const res = await this.request<{ success: boolean; matrix: RiskMatrix }>(`/risk-matrices/${matrixId}/new-version`, {
      method: 'POST',
      body: JSON.stringify({ versionName, changelog }),
    });
    return res.matrix;
  }

  // Preventive Program & Actions
  public async getPreventivePrograms(): Promise<PreventiveProgram[]> {
    return this.request('/preventive-programs');
  }

  public async getActions(params?: { status?: string; priority?: string; workCenterId?: string }): Promise<PreventiveAction[]> {
    const qs = new URLSearchParams(params as any).toString();
    return this.request(`/actions${qs ? `?${qs}` : ''}`);
  }

  public async createAction(data: Partial<PreventiveAction>): Promise<PreventiveAction> {
    return this.request('/actions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async updateAction(id: string, data: Partial<PreventiveAction>): Promise<PreventiveAction> {
    return this.request(`/actions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async verifyAction(id: string, verifiedBy: string, notes: string, status: 'Verified' | 'Rejected'): Promise<PreventiveAction> {
    return this.request(`/actions/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ verifiedBy, verificationNotes: notes, status }),
    });
  }

  // Evidence
  public async getEvidences(params?: { associatedEntityId?: string; entityType?: string }): Promise<Evidence[]> {
    const qs = new URLSearchParams(params as any).toString();
    return this.request(`/evidence${qs ? `?${qs}` : ''}`);
  }

  public async uploadEvidence(data: Partial<Evidence>): Promise<Evidence> {
    return this.request('/evidence', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async verifyEvidence(id: string, comment: string): Promise<Evidence> {
    return this.request(`/evidence/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  // Trainings
  public async getTrainings(): Promise<Training[]> {
    return this.request('/trainings');
  }

  public async getWorkerTrainings(params?: { trainingId?: string; status?: string }): Promise<WorkerTraining[]> {
    const qs = new URLSearchParams(params as any).toString();
    return this.request(`/worker-trainings${qs ? `?${qs}` : ''}`);
  }

  public async createTraining(data: Partial<Training>): Promise<Training> {
    return this.request('/trainings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Inspections
  public async getInspections(): Promise<Inspection[]> {
    return this.request('/inspections');
  }

  public async createInspection(data: Partial<Inspection>): Promise<Inspection> {
    return this.request('/inspections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Incidents
  public async getIncidents(): Promise<Incident[]> {
    return this.request('/incidents');
  }

  public async createIncident(data: Partial<Incident>): Promise<Incident> {
    return this.request('/incidents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Compliance
  public async getComplianceSummary(): Promise<ComplianceScoreSummary> {
    return this.request('/compliance/summary');
  }

  public async getComplianceScore(): Promise<ComplianceScoreSummary> {
    return this.getComplianceSummary();
  }

  public async getComplianceInbox(): Promise<ComplianceInboxItem[]> {
    return this.request('/compliance/inbox');
  }

  public async getInbox(): Promise<ComplianceInboxItem[]> {
    return this.getComplianceInbox();
  }

  public async resolveInboxItem(itemId: string, resolutionNotes?: string): Promise<{ success: boolean }> {
    return { success: true };
  }

  public async getComplianceRequirements(): Promise<TenantComplianceRequirement[]> {
    return this.request('/compliance/requirements');
  }

  public async getRequirements(): Promise<TenantComplianceRequirement[]> {
    return this.getComplianceRequirements();
  }

  public async getAuditPackData(): Promise<any> {
    return this.request('/compliance/audit-pack');
  }

  // Documents & Audit
  public async getDocuments(): Promise<DocumentItem[]> {
    return this.request('/documents');
  }

  public async createDocument(data: Partial<DocumentItem>): Promise<DocumentItem> {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getAuditLogs(): Promise<AuditLog[]> {
    return this.request('/audit-logs');
  }

  public async getNotifications(): Promise<NotificationItem[]> {
    return this.request('/notifications');
  }

  public async markAllNotificationsRead(): Promise<void> {
    return this.request('/notifications/mark-all-read', { method: 'POST' });
  }

  public async getIndustryTemplates(): Promise<IndustryTemplate[]> {
    return this.request('/industry-templates');
  }

  public async applyIndustryTemplate(templateId: string): Promise<{ success: boolean }> {
    return { success: true };
  }
}

export const api = new ApiClient();
