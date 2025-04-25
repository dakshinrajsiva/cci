export interface CCIParameter {
  id: number;
  measureId: string;
  title: string;
  description: string;
  formula: string;
  target: number; // Usually 100%
  weightage: number; // As percentage (e.g., 8 for 8%)
  numerator: number;
  denominator: number;
  selfAssessmentScore: number;
  controlInfo: string; // Information about the control
  implementationEvidence: string; // Required implementation evidence
  auditorComments: string; // Comments from auditor
  standardContext?: string; // Additional context about the standard
  bestPractices?: string; // Best practices for implementation
  regulatoryGuidelines?: string; // Relevant regulatory guidelines and references
  frameworkCategory?: string; // Category within the CSCRF framework
  numeratorHelp?: string; // Help text for calculating the numerator
  denominatorHelp?: string; // Help text for calculating the denominator
}

export interface CCIResult {
  totalScore: number;
  maturityLevel: string;
  maturityDescription: string;
  date: string; // Date of assessment
  organization: string; // Organization name
}

// Annexure K form data interface
export interface AnnexureKData {
  organization: string;
  entityType: string;
  entityCategory: string;
  rationale: string;
  period: string;
  auditingOrganization: string;
  signatoryName: string;
  designation: string;
}

export const maturityLevels = [
  { min: 91, max: 100, level: 'Exceptional Cybersecurity Maturity' },
  { min: 81, max: 90, level: 'Optimal Cybersecurity Maturity' },
  { min: 71, max: 80, level: 'Manageable Cybersecurity Maturity' },
  { min: 61, max: 70, level: 'Developing Cybersecurity Maturity' },
  { min: 51, max: 60, level: 'Bare Minimum Cybersecurity Maturity' },
  { min: 0, max: 50, level: 'Fail' },
]; 