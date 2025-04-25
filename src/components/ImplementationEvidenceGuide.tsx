import React, { useState } from 'react';

export const ImplementationEvidenceGuide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (sectionId: number) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  const evidenceData = [
    {
      id: 1,
      name: "Vulnerability Management Measure",
      evidence: [
        "Vulnerability scan reports from the last assessment period",
        "Remediation tracking documentation showing timeline of fixes",
        "Change management records for vulnerability patches",
        "Screenshots of vulnerability management dashboard"
      ]
    },
    {
      id: 2,
      name: "Security Training Measure",
      evidence: [
        "Training completion certificates for security personnel",
        "Training attendance logs with dates and content covered",
        "Skills assessment results for role-specific security training",
        "Training program documentation showing role-specific modules"
      ]
    },
    {
      id: 3,
      name: "Security Budget Measure",
      evidence: [
        "Annual budget allocation documents showing security budget",
        "Financial reports showing actual security expenditures",
        "Budget comparison documents showing IT vs security allocations",
        "Purchase orders for security tools, services, and personnel"
      ]
    },
    {
      id: 4,
      name: "Risk Assessment Measure",
      evidence: [
        "Risk assessment reports with dates and system coverage",
        "System inventory documentation",
        "Risk assessment methodology documentation",
        "Screenshots of risk register or GRC tool"
      ]
    },
    {
      id: 5,
      name: "Audit Record Review Measure",
      evidence: [
        "SIEM architecture diagrams showing connected systems",
        "Log collection/forwarding configuration files",
        "Documentation of critical systems inventory",
        "Screenshots of SIEM dashboard showing system coverage"
      ]
    },
    {
      id: 6,
      name: "Configuration Changes Measure",
      evidence: [
        "Change management records showing approved configuration changes",
        "Screenshots of configuration management database",
        "Baseline configuration documentation",
        "Audit logs showing configuration drift detection"
      ]
    },
    {
      id: 7,
      name: "Contingency Plan Testing Measure",
      evidence: [
        "Contingency plan test records and after-action reports",
        "BCP/DR exercise documentation",
        "Test schedule showing systems covered",
        "Screenshots of test execution or exercise logs"
      ]
    },
    {
      id: 8,
      name: "Privileged Access Management Measure",
      evidence: [
        "Privileged access management system inventory reports",
        "PIM solution architecture diagrams",
        "Privileged account inventory documentation",
        "Screenshots of privileged session recordings"
      ]
    },
    {
      id: 9,
      name: "Incident Response Measure",
      evidence: [
        "Incident response logs with timestamps",
        "Security incident reports with reporting timeline",
        "Screenshots from incident management system",
        "Incident classification documentation"
      ]
    },
    {
      id: 10,
      name: "Malicious Code Protection Measure",
      evidence: [
        "Anti-malware deployment inventory reports",
        "Configuration settings for malware protection tools",
        "System coverage reports for anti-malware solutions",
        "Screenshots of management console showing coverage"
      ]
    },
    {
      id: 11,
      name: "Remote Access Measure",
      evidence: [
        "MFA configuration documentation for remote access systems",
        "VPN session logs showing authentication methods",
        "Remote access policy documentation",
        "Screenshots of MFA enrollment status for users"
      ]
    },
    {
      id: 12,
      name: "Physical Security Incidents Measure",
      evidence: [
        "Physical security incident reports",
        "Access control logs for physical entry points",
        "Badge system reports for unauthorized access attempts",
        "CCTV footage or records of physical security events"
      ]
    },
    {
      id: 13,
      name: "Planning Measure",
      evidence: [
        "Signed confidentiality agreements",
        "System access request forms showing agreement requirements",
        "User onboarding process documentation",
        "HR records of agreement completion"
      ]
    },
    {
      id: 14,
      name: "Personnel Security Screening Measure",
      evidence: [
        "Background check records for personnel",
        "Security clearance documentation",
        "Screening policy documentation",
        "Personnel security verification records"
      ]
    },
    {
      id: 15,
      name: "Policy Document Measure",
      evidence: [
        "Policy document inventory with approval signatures and dates",
        "Policy review schedule and completion records",
        "Documentation of policy approval workflow",
        "Screenshots of policy management system"
      ]
    },
    {
      id: 16,
      name: "Service Acquisition Contract Measure",
      evidence: [
        "Contract language samples showing security requirements",
        "Vendor assessment documentation",
        "Procurement policy showing security requirement integration",
        "Third-party security agreement examples"
      ]
    },
    {
      id: 17,
      name: "User Accounts Measure",
      evidence: [
        "User termination records with timestamps",
        "Account deactivation logs",
        "HR/IT coordination documentation for departures",
        "Screenshots of offboarding workflow system"
      ]
    },
    {
      id: 18,
      name: "Continuous Monitoring Measure",
      evidence: [
        "Continuous monitoring strategy documentation",
        "Automated control testing reports",
        "Dashboard screenshots showing control monitoring",
        "Continuous assessment workflow documentation"
      ]
    },
    {
      id: 19,
      name: "Critical Assets Identified",
      evidence: [
        "Asset classification documentation",
        "Critical asset inventory reports",
        "Business impact analysis records",
        "System dependency mappings for critical assets"
      ]
    },
    {
      id: 20,
      name: "CSK Events",
      evidence: [
        "CSK event logs with resolution timestamps",
        "Event management system screenshots",
        "CSK report handling procedures",
        "SLA documentation for event resolution"
      ]
    },
    {
      id: 21,
      name: "Password Complexity Measure",
      evidence: [
        "Password policy documentation",
        "System configuration screenshots showing password settings",
        "Compliance reports for password complexity",
        "Group policy objects or equivalent settings"
      ]
    },
    {
      id: 22,
      name: "Cyber Insurance",
      evidence: [
        "Cyber insurance policy documentation",
        "Coverage details showing limits and inclusions",
        "Insurance renewal documentation",
        "Cyber coverage assessment reports"
      ]
    },
    {
      id: 23,
      name: "Automated Compliance with CSCRF",
      evidence: [
        "Automated compliance monitoring tool configuration",
        "Documentation showing CSCRF mapping to automated controls",
        "Compliance dashboard screenshots",
        "Automated assessment reports for CSCRF standards"
      ]
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Implementation Evidence Guide</h2>
      <p className="mb-6">
        This guide provides a comprehensive list of required implementation evidence for each of the 23 parameters
        measured in the SEBI CSCRF compliance framework. Use this guide to prepare the necessary documentation
        for your CCI assessment and audit.
      </p>

      <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <p className="font-medium">Important Note:</p>
        <p className="text-sm">All evidence must be current (within the assessment period) and should clearly demonstrate compliance with the specific parameter requirements. Documentation should include dates, system identifiers, and be properly approved where applicable.</p>
      </div>

      <div className="space-y-4 mt-6">
        {evidenceData.map((param) => (
          <div key={param.id} className="border border-gray-200 rounded-lg">
            <div 
              className={`p-4 cursor-pointer flex justify-between items-center ${expandedSection === param.id ? 'bg-gray-100' : 'bg-white'}`}
              onClick={() => toggleSection(param.id)}
            >
              <h3 className="font-medium text-lg">
                {param.id}. {param.name}
              </h3>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${expandedSection === param.id ? 'transform rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            {expandedSection === param.id && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <ul className="list-disc pl-6 space-y-2">
                  {param.evidence.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-lg mb-2">Evidence Collection Best Practices</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Maintain a centralized repository of all evidence for easy access during audits</li>
          <li>Ensure all evidence is properly dated and versioned</li>
          <li>Include screenshots with timestamps where applicable</li>
          <li>Redact sensitive information while preserving the relevant context</li>
          <li>Organize evidence by parameter number for streamlined assessment</li>
          <li>Update evidence regularly to reflect current system configurations</li>
        </ul>
      </div>
    </div>
  );
};

export default ImplementationEvidenceGuide; 