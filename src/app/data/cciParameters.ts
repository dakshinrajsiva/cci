import { CCIParameter } from '../types';

export const initialCCIParameters: CCIParameter[] = [
  {
    id: 1,
    measureId: 'GV.RR.S4',
    title: 'Security Budget Measure',
    description: 'Percentage (%) of the organisation\'s information system budget devoted to information security.',
    formula: '(Information security budget / total organisation\'s information technology budget) × 100\nTotal IT Budget = Sum of IT Expenses in Software, Hardware, IT Personnel',
    target: 100,
    weightage: 8,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Provide resources necessary for information systems.',
    implementationEvidence: '1. Total information security budget across all organization\'s systems.\n2. Total information technology budget across all organization\'s systems.\n3. Approval Document from Competent Authority for the same.',
    auditorComments: '',
    frameworkCategory: 'Governance: Roles and Responsibilities',
    standardContext: 'Adequate funding and resource allocation is crucial for effective cybersecurity program implementation. This measure evaluates whether the organization allocates sufficient budget for information security relative to its overall IT expenditure. Industry benchmarks suggest allocating 10-15% of IT budget to security, with financial sector organizations typically allocating higher percentages.',
    bestPractices: '1. Establish a dedicated cybersecurity budget line item\n2. Conduct annual reviews of security spending effectiveness\n3. Benchmark security spending against industry peers\n4. Prioritize investments based on risk assessment outcomes\n5. Document justifications for security budget allocations',
    regulatoryGuidelines: 'SEBI Circular SEBI/HO/MIRSD/TPD/CIR/P/2023/7 emphasizes adequate resource allocation for cybersecurity measures, including budget, personnel, and technology investments.',
    numeratorHelp: 'Total information security budget including security tools, security personnel, security training, security audits, and other security-related expenses',
    denominatorHelp: 'Total IT budget including all expenses related to software, hardware, IT personnel, and IT services'
  },
  {
    id: 2,
    measureId: 'DE.CM.S5',
    title: 'Vulnerability Measure',
    description: 'Percentage of vulnerabilities mitigated pertaining to organization in a specified time frame.',
    formula: '(Number of vulnerabilities mitigated / Number of vulnerabilities identified) × 100',
    target: 100,
    weightage: 18,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Objective of this measure is to ensure that the vulnerabilities in organization\'s systems are identified and mitigated.',
    implementationEvidence: '1. Confirmation that VAPT is done by CERT-In empanelled IS auditing organization and as per the scope prescribed by SEBI.\n2. VAPT report and its closure report.\n3. Time taken to close the identified vulnerabilities.',
    auditorComments: '',
    frameworkCategory: 'Detect: Continuous Monitoring',
    standardContext: 'Vulnerability management is a critical component of cybersecurity defense. This measure tracks how effectively an organization identifies and addresses vulnerabilities in its IT infrastructure. Timely mitigation prevents exploitation of weaknesses that could lead to data breaches, system compromises, or service disruptions. The higher the percentage of mitigated vulnerabilities, the stronger the security posture.',
    bestPractices: '1. Implement a continuous vulnerability scanning program\n2. Establish a vulnerability remediation process with defined SLAs based on severity\n3. Critical vulnerabilities should be mitigated within 15 days\n4. High vulnerabilities within 30 days\n5. Medium vulnerabilities within 45 days\n6. Perform VAPT at least twice a year\n7. Maintain a vulnerability management database with tracking and reporting capabilities',
    regulatoryGuidelines: 'SEBI CSCRF Part-I requires regular vulnerability assessment and penetration testing (VAPT) by CERT-In empanelled organizations. The vulnerabilities identified must be addressed within specified timeframes based on severity levels.',
    numeratorHelp: 'Total number of vulnerabilities that have been successfully remediated within the specified timeframe',
    denominatorHelp: 'Total number of vulnerabilities identified through VAPT, scanning and other vulnerability identification methods'
  },
  {
    id: 3,
    measureId: 'PR.AT.S1',
    title: 'Security Training Measure',
    description: 'Percentage (%) of information system security personnel that have received security training within the past one years.',
    formula: '(Number of information system security personnel that have completed security training within the past year / total number of information system security personnel) × 100',
    target: 100,
    weightage: 5,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Ensure that organization\'s personnel are adequately trained to carry out their assigned information security-related duties and responsibilities.',
    implementationEvidence: '1. Details of the training/awareness sessions scheduled within the past 1 year.\n2. Cyber audit observation against Standard 1 mentioned in \'Protect: Awareness and Training\' header in CSCRF Part-I and respective guidelines in Part-II.',
    auditorComments: '',
    frameworkCategory: 'Protect: Awareness and Training',
    standardContext: 'Security training is essential for building and maintaining a strong cybersecurity workforce. This measure ensures that information security personnel receive timely and relevant training to stay current with evolving threats, technologies, and best practices. Regular training enhances the effectiveness of security operations and strengthens the organization\'s overall security posture.',
    bestPractices: '1. Develop role-based training programs tailored to specific security functions\n2. Include both technical and non-technical skills development\n3. Track training effectiveness through assessments and practical exercises\n4. Encourage staff to obtain industry certifications (CISSP, CEH, CISM, etc.)\n5. Utilize a mix of training formats: in-person, virtual, self-paced\n6. Conduct specialized training for emerging threat areas\n7. Include tabletop exercises and simulations in training curriculum',
    regulatoryGuidelines: 'SEBI CSCRF Standard 1 under "Protect: Awareness and Training" requires specialized security training for personnel with assigned security roles and responsibilities. Documentation of training completion and curriculum content must be maintained.',
    numeratorHelp: 'Number of information security personnel who have completed required security training programs within the last 12 months',
    denominatorHelp: 'Total number of information security personnel in the organization'
  },
  {
    id: 4,
    measureId: 'PR.AA.S12',
    title: 'Remote Access Control Measure',
    description: 'Percentage (%) of remote users logging through MFA.',
    formula: '(Number of remote users logging through MFA / total number of remote users) × 100',
    target: 100,
    weightage: 2,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Restrict access to information, systems, and components to individuals or machines that have been authenticated and are identifiable, known and credible.',
    implementationEvidence: '1. Does the organization use automated tools to maintain an up-to-date record that identifies all remote access points?\n2. How many remote access points exist in the organization\'s network?\n3. Does the organisation employ IDS or IPS to monitor traffic traversing remote access points?\n4. Does the organisation collect and review audit logs associated with all remote access points?\n5. Evidence of users who are allowed remote access through MFA, validated through Firewall, AD, or any dedicated system.\n6. Based on reviews of the incident database, IDS/IPS logs and alerts, and/or appropriate remote access point log files, how many access points have been used to gain unauthorized access within the reporting period?',
    auditorComments: ''
  },
  {
    id: 5,
    measureId: 'DE.CM.S1',
    title: 'Audit Record Review Measure',
    description: 'Percentage (%) of critical systems integrated with SIEM.',
    formula: '(Number of critical systems integrated with SIEM tool / total number of critical systems) × 100',
    target: 100,
    weightage: 2,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Create, protect, and retain information system audit records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful, unauthorized, suspicious or abnormal activity.',
    implementationEvidence: '1. Is logging activated on the system?\n2. Does the organization have clearly defined criteria for what constitutes evidence of "suspicious or abnormal" activity within system audit logs?\n3. For reporting period, how many system audit logs have been reviewed for past six months for suspicious or abnormal activity.',
    auditorComments: ''
  },
  {
    id: 6,
    measureId: 'DE.CM.S5',
    title: 'Configuration Changes Measure',
    description: 'Percentage (%) approved and implemented configuration changes identified in the latest automated baseline configuration.',
    formula: '(Number of approved and implemented configuration changes identified in the latest automated baseline configuration / total number of configuration changes identified through automated or manual scans) × 100',
    target: 100,
    weightage: 2,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Establish and maintain baseline configuration and inventories of organizational information systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.',
    implementationEvidence: '1. Does the organization manage configuration changes to information systems using an organizationally approved process?\n2. Does the organization use automated scanning to identify configuration changes that were implemented on its systems and networks?\n3. If yes, how many configuration changes were identified through automated scanning over the last reporting period?\n4. How many change control requests were approved and implemented over the last reporting period?\n5. Cyber audit observation against Standard 3 mentioned in \'Detect: Continuous Security Monitoring\' header in CSCRF Part-I and respective guidelines in Part-II.',
    auditorComments: ''
  },
  {
    id: 7,
    measureId: 'RS.MA.S3',
    title: 'Contingency Plan Testing Measure',
    description: 'Percentage (%) of information systems that have conducted contingency plan testing at least once in a year.',
    formula: '(Number of information systems that have conducted contingency plans testing at least once in a year / number of information systems in the system inventory) × 100',
    target: 100,
    weightage: 4,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Establish, maintain, and effectively implement plans for emergency response, backup operations, and post-disaster recovery of organizational information systems to ensure the availability of critical information resources and continuity of operations in emergency situations.',
    implementationEvidence: '1. How many information systems are in the system inventory?\n2. How many information systems have an approved contingency plan?\n3. How many contingency plans were successfully tested within the past 1 year?\n4. Reports of the contingency plan testing conducted in past one year.',
    auditorComments: ''
  },
  {
    id: 8,
    measureId: 'PR.AA.S7',
    title: 'User Accounts Measure',
    description: 'Percentage (%) of privileged access through PIM.',
    formula: '(Number of systems accessed through PIM / total number of systems) × 100',
    target: 100,
    weightage: 3,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: All privilege users are identified and authenticated in accordance with information security policy.',
    implementationEvidence: '1. Organization should have a documented and approved access control policy for systems, applications, networks, databases etc.\n2. How many users have access to the system?\n3. How many users have access to shared accounts?\n4. Cyber audit observation against Standard 7 mentioned in \'Protect: Identity Management, Authentication, and Access Control\' header in CSCRF Part-I and respective guidelines in Part-II.',
    auditorComments: '',
    frameworkCategory: 'Protect: Identity Management, Authentication, and Access Control',
    standardContext: 'Privileged Identity Management (PIM) is a critical security control for managing, monitoring, and securing privileged access. By implementing PIM, organizations can reduce the risk associated with privileged accounts by providing just-in-time access, enforcing least privilege, and generating comprehensive audit trails of administrative actions.',
    bestPractices: '1. Implement just-in-time privileged access with time-limited sessions\n2. Require multi-factor authentication for all privileged access\n3. Implement session monitoring and recording for privileged activities\n4. Enforce password vaulting for shared administrative accounts\n5. Configure automatic alerts for suspicious privileged account activities\n6. Perform regular privileged access reviews and certification\n7. Establish emergency access procedures with break-glass accounts',
    regulatoryGuidelines: 'SEBI CSCRF Standard 7 under "Protect: Identity Management, Authentication, and Access Control" requires implementation of privileged access management solutions to control and monitor administrative access to critical systems.',
    numeratorHelp: 'Number of systems with privileged access managed through a Privileged Identity Management (PIM) solution',
    denominatorHelp: 'Total number of systems in the organization that require privileged access'
  },
  {
    id: 9,
    measureId: 'RS.CO.S2',
    title: 'Incident Response Measure',
    description: 'Percentage (%) of incidents reported within required time frame.',
    formula: '(Number of incidents reported on time / total number of reported incidents) × 100',
    target: 100,
    weightage: 2,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Track, document, and report incidents to appropriate organizational officials and/or authorities.',
    implementationEvidence: '1. How many incidents were reported during the period?\n2. Of the incidents reported, how many were reported within the prescribed time frame?',
    auditorComments: ''
  },
  {
    id: 10,
    measureId: 'PR.MA.S1',
    title: 'Maintenance Measure',
    description: 'Percentage (%) of system components that undergo maintenance in accordance with planned maintenance schedules.',
    formula: '(Number of system components that undergo maintenance according to planned maintenance schedules / total number of system components) × 100',
    target: 100,
    weightage: 5,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Perform periodic and timely maintenance on organizational information systems and provide effective controls on the tools, techniques, mechanisms, and personnel used to conduct information system maintenance.',
    implementationEvidence: '1. Does the system have a planned maintenance schedule?\n2. How many components are contained within the system?\n3. How many components underwent maintenance in accordance with the planned maintenance schedule?',
    auditorComments: ''
  },
  {
    id: 11,
    measureId: 'PR.AA.S14',
    title: 'Media Sanitization Measure',
    description: 'Percentage (%) of media that passes sanitization procedures testing.',
    formula: '(Number of media that passes sanitization procedures testing / total number of media disposed or released for reuse) × 100',
    target: 100,
    weightage: 2,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Sanitize or destroy information system media before disposal or release for reuse.',
    implementationEvidence: '1. Policy/procedure for sanitizing media before it is discarded or reused.\n2. Indicative proof that policy is being followed.\n3. Cyber audit observation against Standard 14 mentioned in \'Protect: Identity Management, Authentication, and Access Control\' header in CSCRF Part-I and respective guidelines in Part-II.',
    auditorComments: ''
  },
  {
    id: 12,
    measureId: 'PR.AA.S10',
    title: 'Physical Security Incidents Measure',
    description: 'Percentage (%) of physical security incidents allowing unauthorized entry into facilities containing information systems.',
    formula: '(Number of physical security incidents allowing unauthorized entry into facilities containing information systems / total number of physical security incidents) × 100',
    target: 0, // This one is inverse - lower is better
    weightage: 1,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Integrate physical and information security protection mechanisms to ensure appropriate protection of the organization\'s information resources.',
    implementationEvidence: '1. Policy/procedure ensuring the secure physical access to critical systems?\n2. How many physical security incidents occurred during the specified period?\n3. How many of the physical security incidents allowed unauthorized entry into facilities containing information systems?\n4. Cyber audit Observation against Standard 10 mentioned in \'Protect: Identity Management, Authentication, and Access Control\' header in CSCRF Part-I and respective guidelines in Part-II.',
    auditorComments: '',
    numeratorHelp: 'Number of physical security incidents that resulted in unauthorized access to facilities housing information systems',
    denominatorHelp: 'Total number of physical security incidents recorded during the assessment period'
  },
  {
    id: 13,
    measureId: 'GV.RR.S5',
    title: 'Planning Measure',
    description: 'Percentage of employees who get authorized access to information systems only after they sign an acknowledgement that they have read and understood confidentiality and integrity agreement.',
    formula: '(Number of users who are granted system access after signing confidentiality and integrity agreement / total number of users who are granted system access) × 100',
    target: 100,
    weightage: 1,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Develop, document, periodically update, and implement security measures for authorised access to the information systems of the organisation.',
    implementationEvidence: '1. How many users accessed the system?\n2. How many users signed confidentiality and integrity agreement acknowledgements?\n3. How many users have been granted access to the information system only after signing confidentiality and integrity agreement acknowledgements?',
    auditorComments: ''
  },
  {
    id: 14,
    measureId: 'PR.AA.S10',
    title: 'Personnel Security Screening Measure',
    description: 'Percentage (%) of individuals screened before being granted access to organizational information and information systems.',
    formula: '(Number of individuals screened / total number of individuals having access to organization\'s information and information systems) × 100',
    target: 100,
    weightage: 1,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Ensure that individuals occupying positions of responsibility within organizations are trustworthy and meet established security criteria for those positions.',
    implementationEvidence: '1. How many individuals have been granted access to organizational information and information systems?\n2. What is the number of individuals who have completed personnel screening?',
    auditorComments: ''
  },
  {
    id: 15,
    measureId: 'ID.RA.S2',
    title: 'Risk Assessment Measure',
    description: 'Percentage of organization\'s information systems, and assets covered under risk assessment.',
    formula: '(Number of organization\'s information systems, and assets covered under risk assessment / Total number of organization information systems, and assets) × 100',
    target: 100,
    weightage: 5,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Objective of this measure is to periodically assess the risk to organization\'s IT assets and operations. Cybersecurity risks to the organization\'s information systems, and assets are understood and assessed.',
    implementationEvidence: '1. Has the organization completed a cyber-risk assessment?\n2. Cyber Audit observation against this Standard 2 mentioned in \'Identify: Risk Assessment\' header in CSCRF Part-I and respective guidelines in Part-II.',
    auditorComments: '',
    frameworkCategory: 'Identify: Risk Assessment',
    standardContext: 'Comprehensive risk assessment is foundational to effective cybersecurity management. This measure evaluates the coverage of risk assessment activities across an organization\'s IT systems and assets. Risk assessments help identify vulnerabilities, threats, and potential impacts, enabling informed decisions about controls implementation and resource allocation.',
    bestPractices: '1. Conduct risk assessments at least annually and after significant changes\n2. Use a consistent risk assessment methodology across the organization\n3. Document risk assessment results in a centralized repository\n4. Prioritize risks based on likelihood and impact\n5. Develop risk treatment plans for identified high and critical risks\n6. Include both technical and non-technical risks in assessments\n7. Involve business stakeholders in the risk assessment process\n8. Integrate threat intelligence into the risk assessment process',
    regulatoryGuidelines: 'SEBI CSCRF Standard 2 under "Identify: Risk Assessment" requires regular organization-wide cyber risk assessments, with documentation of methodologies, findings, and risk treatment plans. Risk assessments must consider threats, vulnerabilities, likelihood, and potential business impacts.',
    numeratorHelp: 'Number of information systems and assets that have undergone a formal risk assessment process within the required timeframe',
    denominatorHelp: 'Total number of information systems and assets in the organization\'s inventory'
  },
  {
    id: 16,
    measureId: 'GV.SC.S3',
    title: 'Service Acquisition Contract Measure',
    description: 'Percentage (%) of system and service acquisition contracts that include security requirements and/or specifications.',
    formula: '(Number of system and service acquisition contracts that include security requirements and specifications / total number of system and service acquisition contracts) × 100',
    target: 100,
    weightage: 3,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Ensure third-party providers employ adequate security measures to protect information, applications, and/or services outsourced by the organization.',
    implementationEvidence: '1. How many active service acquisition contracts does the organization have?\n2. How many active service acquisition contracts include security requirements and specifications?\n3. How many contracts includes integration of systems with SOC technologies?\n4. Whether the acquisition contract includes SLA for vulnerabilities closure and timely implementation of patches?\n5. Contracts for adoption of Cloud includes implementation of \'security of the cloud\', etc.',
    auditorComments: ''
  },
  {
    id: 17,
    measureId: 'PR.DS.S4',
    title: 'System and Communication Protection Measure',
    description: 'Percentage of mobile computers and devices that perform all cryptographic operations.',
    formula: '(Number of mobile computers and devices that perform all cryptographic operations / total number of mobile computers and devices) × 100',
    target: 100,
    weightage: 1,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Information Security Goal: Allocate sufficient resources to adequately protect electronic information infrastructure.',
    implementationEvidence: '1. How many mobile computers and devices are used in the organization?\n2. How many mobile computers and devices employ cryptography?\n3. How many mobile computers and devices have cryptography implementation waivers?',
    auditorComments: ''
  },
  {
    id: 18,
    measureId: 'GV.RM.S1, GV.RM.S2',
    title: 'Risk Management',
    description: 'Percentage (%) of organization information systems, and assets covered under risk management.',
    formula: '(Number of organization information systems, and assets covered under risk management / Total number of organization information systems, and assets) × 100',
    target: 100,
    weightage: 8,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Based on risk appetite of the organization, cybersecurity risks are identified, analysed, evaluated, prioritized, responded, and monitored.',
    implementationEvidence: '1. Does organization have a cyber-risk management framework?\n2. Has the organization established, communicated, and maintained its risk appetite and risk tolerance statements?\n3. Has organization responded to risk observations based on its risk appetite?',
    auditorComments: ''
  },
  {
    id: 19,
    measureId: 'ID.AM.S1, ID.AM.S2',
    title: 'Critical Assets Identified',
    description: 'Percentage (%) of the critical systems identified by REs among all other IT systems.',
    formula: '(Number of critical systems Identified / Total IT systems integrated with SOC) × 100',
    target: 50, // This is 50% as per documentation
    weightage: 9,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Objective of this measure is to ensure identification and management of assets in accordance with their relative importance to the organizational objectives and the organization\'s risk strategy.',
    implementationEvidence: '1. Process to identify and approve the list of critical assets.\n2. List of critical assets identified as per the ID.AM.S1.\n3. Auditors reports on identification of assets as critical/non-critical.',
    auditorComments: '',
    numeratorHelp: 'Number of systems formally identified and classified as critical through the organization\'s asset classification process',
    denominatorHelp: 'Total number of IT systems integrated with Security Operations Center (SOC)'
  },
  {
    id: 20,
    measureId: 'RS.MA.S5',
    title: 'CSK Events',
    description: 'Number of CSK reported events closed in timely manner.',
    formula: '(Total number of CSK reported events closed in 15 days / Total number of CSK reported events to the organization) × 100',
    target: 100,
    weightage: 4,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Objective of this measure is to mitigate threats upon external IPs.',
    implementationEvidence: '1. Summary report of the events reported by CSK.',
    auditorComments: ''
  },
  {
    id: 21,
    measureId: 'GV.PO.S1',
    title: 'Cybersecurity Policy Document',
    description: 'Develop, document, periodically update, and implement cybersecurity policies and procedures for organizational information systems that describe the security controls in place or planned for information systems.',
    formula: 'Non-quantifiable measure',
    target: 100,
    weightage: 4,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Develop, document, periodically update, and implement cybersecurity policies and procedures for organizational information systems.',
    implementationEvidence: '1. Cybersecurity Policy document of the organization.\n2. Frequency of the revision of the policy document.\n3. Approval of the policy document.\n4. Cyber audit observation against Standard 1 mentioned in \'Governance: Policy\' header in CSCRF Part-I and respective guidelines in Part-II.',
    auditorComments: ''
  },
  {
    id: 22,
    measureId: 'SOC efficacy',
    title: 'SOC efficacy',
    description: 'How effective is our SOC operational?',
    formula: 'As specified in SOC efficacy (Annexure-N)',
    target: 100,
    weightage: 5,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Measure the effectiveness of Security Operations Center.',
    implementationEvidence: '1. How effective is the functioning of RE\'s SOC?',
    auditorComments: ''
  },
  {
    id: 23,
    measureId: 'Automated compliance with CSCRF',
    title: 'Automated compliance with CSCRF',
    description: 'Develop an automated tool (preferably integrated with log aggregator) to submit compliance with CSCRF.',
    formula: '(Number of standards for which compliance has been automated for CSCRF compliance / Total number of CSCRF standards) × 100',
    target: 100,
    weightage: 5,
    numerator: 0,
    denominator: 1,
    selfAssessmentScore: 0,
    controlInfo: 'Develop an automated tool to submit compliance with CSCRF.',
    implementationEvidence: '1. Automated dashboard to get detailed reports of CSCRF standards compliance.',
    auditorComments: '',
    numeratorHelp: 'Number of CSCRF standards for which compliance tracking has been automated using tools',
    denominatorHelp: 'Total number of standards in the CSCRF framework applicable to the organization'
  }
];

// Function to generate sample data for demonstration
export const generateSampleData = (): CCIParameter[] => {
  return initialCCIParameters.map(param => {
    // Generate random numerator and denominator for demonstration
    const denom = Math.floor(Math.random() * 100) + 1; // Random denominator between 1-100
    // For most parameters, we want a high percentage (70-100%)
    const percentSuccess = param.id === 12 
      ? Math.random() * 0.1 // For physical security incidents, we want low (0-10%)
      : 0.7 + (Math.random() * 0.3); // For others 70-100%
    
    const num = Math.floor(denom * percentSuccess);
    
    // Add auditor comments based on the score
    const percentage = (num / denom) * 100;
    let comments = '';
    
    if (percentage >= 90) {
      comments = 'Excellent implementation. Meets or exceeds all requirements.';
    } else if (percentage >= 70) {
      comments = 'Good implementation. Minor improvements recommended.';
    } else if (percentage >= 50) {
      comments = 'Satisfactory implementation. Several areas need attention.';
    } else {
      comments = 'Inadequate implementation. Immediate remediation required.';
    }
    
    return {
      ...param,
      numerator: num,
      denominator: denom,
      auditorComments: comments
    };
  });
}; 

// Sample data for Annexure K form
export const generateAnnexureKSampleData = (organization: string) => {
  return {
    organization,
    entityType: 'Stock Exchange',
    entityCategory: 'Market Infrastructure Institution (MII)',
    rationale: 'As a Stock Exchange, our entity plays a critical role in providing a marketplace for trading securities. This classification aligns with SEBI CSCRF guidelines for MIIs, which require the highest level of cybersecurity compliance due to the systemic importance and potential impact on financial markets.',
    period: 'January 2023 - December 2023',
    auditingOrganization: 'Deloitte Cyber Risk Services',
    signatoryName: 'Rajesh Sharma',
    designation: 'Chief Information Security Officer'
  };
}; 