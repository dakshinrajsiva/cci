import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CCIParameter, CCIResult } from '../app/types';
import { calculateParameterScore } from '../app/utils/cciCalculator';
import { calculateCCIIndex } from '../app/utils/cciCalculator';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface DataCollectionFormProps {
  parameters: CCIParameter[];
  onComplete: (updatedParameters: CCIParameter[]) => void;
  onCancel: () => void;
}

// Define walkthrough steps
interface WalkthroughStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const DataCollectionForm: React.FC<DataCollectionFormProps> = ({
  parameters,
  onComplete,
  onCancel
}) => {
  const [formData, setFormData] = useState<CCIParameter[]>(parameters);
  const [detailedData, setDetailedData] = useState<Record<number, { 
    numeratorBreakdown: { question: string, value: number }[], 
    denominatorBreakdown: { question: string, value: number }[] 
  }>>({});
  const [isExporting, setIsExporting] = useState(false);
  
  // Walkthrough state
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  
  // Refs for walkthrough targets
  const parameterHeaderRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const numeratorSectionRef = useRef<HTMLDivElement>(null);
  const denominatorSectionRef = useRef<HTMLDivElement>(null);
  const addQuestionButtonRef = useRef<HTMLButtonElement>(null);
  const evidenceSectionRef = useRef<HTMLDivElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  // Define walkthrough steps
  const walkthroughSteps: WalkthroughStep[] = [
    {
      target: 'header',
      title: 'Welcome to the CCI Data Collection Form',
      content: 'This form allows you to enter detailed data for each parameter of the Cyber Capability Index. Follow this walkthrough to learn how to use it.',
      placement: 'bottom'
    },
    {
      target: 'parameter',
      title: 'Parameter Details',
      content: 'Each parameter has a title, description, and formula. The score is calculated automatically as you enter data.',
      placement: 'top'
    },
    {
      target: 'numerator',
      title: 'Numerator Questions',
      content: 'Enter values for each question in the numerator section. These values will be summed automatically to calculate the total numerator.',
      placement: 'right'
    },
    {
      target: 'denominator',
      title: 'Denominator Questions',
      content: 'Enter values for each question in the denominator section. These values will be summed automatically to calculate the total denominator.',
      placement: 'left'
    },
    {
      target: 'addQuestion',
      title: 'Add Custom Questions',
      content: 'You can add custom questions if needed for more detailed breakdowns.',
      placement: 'top'
    },
    {
      target: 'evidence',
      title: 'Implementation Evidence',
      content: 'Document your implementation evidence and auditor comments in these sections.',
      placement: 'bottom'
    },
    {
      target: 'export',
      title: 'Export Your Data',
      content: 'You can export your data to PDF at any time using this button.',
      placement: 'bottom'
    },
    {
      target: 'save',
      title: 'Save and Calculate',
      content: 'Once you\'ve entered all your data, click "Save and Calculate" to update your CCI index.',
      placement: 'top'
    }
  ];

  const handleChange = (paramId: number, field: keyof CCIParameter, value: any) => {
    setFormData(prevData =>
      prevData.map(param =>
        param.id === paramId ? { ...param, [field]: value } : param
      )
    );
  };

  const handleDetailedValueChange = (
    paramId: number, 
    type: 'numerator' | 'denominator', 
    index: number, 
    value: number
  ) => {
    setDetailedData(prev => {
      const paramData = prev[paramId] || {
        numeratorBreakdown: [],
        denominatorBreakdown: []
      };
      
      const updatedData = { ...prev };
      
      // Update the specific value
      if (type === 'numerator') {
        const updatedNumerator = [...paramData.numeratorBreakdown];
        updatedNumerator[index] = { ...updatedNumerator[index], value };
        updatedData[paramId] = {
          ...paramData,
          numeratorBreakdown: updatedNumerator
        };
      } else {
        const updatedDenominator = [...paramData.denominatorBreakdown];
        updatedDenominator[index] = { ...updatedDenominator[index], value };
        updatedData[paramId] = {
          ...paramData,
          denominatorBreakdown: updatedDenominator
        };
      }
      
      // Calculate and update the totals in formData
      if (type === 'numerator') {
        const numeratorTotal = updatedData[paramId].numeratorBreakdown.reduce(
          (sum, item) => sum + (item.value || 0), 0
        );
        handleChange(paramId, 'numerator', numeratorTotal);
      } else {
        const denominatorTotal = updatedData[paramId].denominatorBreakdown.reduce(
          (sum, item) => sum + (item.value || 0), 0
        );
        // Ensure denominator is not zero
        handleChange(paramId, 'denominator', denominatorTotal || 1);
      }
      
      return updatedData;
    });
  };

  const initializeDetailedData = (paramId: number) => {
    if (detailedData[paramId]) return;
    
    const param = formData.find(p => p.id === paramId);
    if (!param) return;
    
    // Set framework category based on measureId prefix if not already set
    if (!param.frameworkCategory) {
      // Handle special cases first
      if (param.measureId.includes(',')) {
        // For cases like "ID.AM.S1, ID.AM.S2" - take the first prefix
        const prefix = param.measureId.split('.')[0];
        handleCategoryAssignment(param, prefix);
      } else if (param.measureId === "Automated compliance with CSCRF") {
        // Special case for the automated compliance parameter
        handleChange(param.id, 'frameworkCategory', 'Governance');
      } else if (!param.measureId.includes('.')) {
        // For cases without the standard dot notation
        if (param.measureId.startsWith('GV') || 
            param.measureId.toLowerCase().includes('governance') ||
            param.measureId.toLowerCase().includes('policy')) {
          handleChange(param.id, 'frameworkCategory', 'Governance');
        } else {
          // Default category for unusual cases
          handleChange(param.id, 'frameworkCategory', 'Other');
        }
      } else {
        // Standard case - extract the prefix
        const prefix = param.measureId.split('.')[0];
        handleCategoryAssignment(param, prefix);
      }
    }
    
    // Create questions based on the parameter formula
    let numeratorQuestions: { question: string, value: number }[] = [];
    let denominatorQuestions: { question: string, value: number }[] = [];
    
    // Generate questions based on parameter type
    switch(param.id) {
      case 1: // Vulnerability Management Measure
        numeratorQuestions = [
          { question: "How many critical vulnerabilities were remediated within the required timeframe?", value: 0 },
          { question: "How many high vulnerabilities were remediated within the required timeframe?", value: 0 },
          { question: "How many medium vulnerabilities were remediated within the required timeframe?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of critical vulnerabilities identified during assessment?", value: 0 },
          { question: "What is the total number of high vulnerabilities identified during assessment?", value: 0 },
          { question: "What is the total number of medium vulnerabilities identified during assessment?", value: 0 }
        ];
        break;
      case 2: // Security Training Measure 
        numeratorQuestions = [
          { question: "How many security personnel completed role-specific security training?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of security personnel in your organization?", value: 0 }
        ];
        break;
      case 3: // Security Budget Measure
        numeratorQuestions = [
          { question: "What is your current information security budget (in currency units)?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is your total IT budget (in the same currency units)?", value: 0 }
        ];
        break;
      case 4: // Risk Assessment Measure
        numeratorQuestions = [
          { question: "How many information systems have undergone formal risk assessment in the past year?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of information systems in your organization's inventory?", value: 0 }
        ];
        break;
      case 5: // Audit Record Review Measure
        numeratorQuestions = [
          { question: "How many critical systems are fully integrated with your SIEM solution?", value: 0 },
          { question: "How many critical systems have partial SIEM integration?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of systems classified as critical in your organization?", value: 0 }
        ];
        break;
      case 6: // Configuration Changes Measure
        numeratorQuestions = [
          { question: "How many configuration changes were properly approved and implemented?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of configuration changes identified through automated or manual scans?", value: 0 }
        ];
        break;
      case 7: // Contingency Plan Testing Measure
        numeratorQuestions = [
          { question: "How many information systems have conducted contingency plan testing at least once in the past year?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of information systems in the system inventory?", value: 0 }
        ];
        break;
      case 8: // Privileged Access Management Measure
        numeratorQuestions = [
          { question: "How many systems have privileged access managed through a PIM solution?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of systems that require privileged access?", value: 0 }
        ];
        break;
      case 9: // Incident Response Measure
        numeratorQuestions = [
          { question: "How many security incidents were reported within the required timeframe?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of security incidents that occurred?", value: 0 }
        ];
        break;
      case 10: // Malicious Code Protection Measure
        numeratorQuestions = [
          { question: "How many systems have malware detection tools installed and operational?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of systems in the organization?", value: 0 }
        ];
        break;
      case 11: // Remote Access Measure
        numeratorQuestions = [
          { question: "How many remote access sessions use multi-factor authentication?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of remote access sessions?", value: 0 }
        ];
        break;
      case 12: // Physical Security Incidents Measure
        numeratorQuestions = [
          { question: "How many physical security incidents resulted in unauthorized access to facilities with information systems?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of physical security incidents recorded?", value: 0 }
        ];
        break;
      case 13: // Planning Measure
        numeratorQuestions = [
          { question: "How many users signed confidentiality agreements before being granted system access?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of users who were granted system access?", value: 0 }
        ];
        break;
      case 14: // Personnel Security Screening Measure
        numeratorQuestions = [
          { question: "How many individuals were properly screened before being granted access?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of individuals with access to organizational information and systems?", value: 0 }
        ];
        break;
      case 15: // Policy Document Measure
        numeratorQuestions = [
          { question: "How many required security policies are documented, approved, and current?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of required security policies?", value: 0 }
        ];
        break;
      case 16: // Service Acquisition Contract Measure
        numeratorQuestions = [
          { question: "How many acquisition contracts include specific security requirements?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of system and service acquisition contracts?", value: 0 }
        ];
        break;
      case 17: // User Accounts Measure
        numeratorQuestions = [
          { question: "How many user accounts were terminated within the required timeframe?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of users who departed the organization?", value: 0 }
        ];
        break;
      case 18: // Continuous Monitoring Measure
        numeratorQuestions = [
          { question: "How many controls are continuously monitored?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of information security controls?", value: 0 }
        ];
        break;
      case 19: // Critical Assets Identified
        numeratorQuestions = [
          { question: "How many business-critical systems have been identified through formal classification?", value: 0 },
          { question: "How many supporting systems have been classified as critical?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of IT systems integrated with your SOC?", value: 0 }
        ];
        break;
      case 20: // CSK Events
        numeratorQuestions = [
          { question: "How many CSK reported events were closed within 15 days?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of CSK events reported to your organization?", value: 0 }
        ];
        break;
      case 21: // Password Complexity Measure
        numeratorQuestions = [
          { question: "How many systems enforce the required password complexity policies?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of systems that require password authentication?", value: 0 }
        ];
        break;
      case 22: // Cyber insurance
        numeratorQuestions = [
          { question: "Does your organization have cyber insurance coverage? (1 for Yes, 0 for No)", value: 0 }
        ];
        denominatorQuestions = [
          { question: "Total possible count (always 1)", value: 1 }
        ];
        break;
      case 23: // Automated compliance with CSCRF
        numeratorQuestions = [
          { question: "How many CSCRF standards have automated compliance monitoring?", value: 0 }
        ];
        denominatorQuestions = [
          { question: "What is the total number of applicable CSCRF standards?", value: 0 }
        ];
        break;
      default:
        // Default pattern if no specific questions are defined
        numeratorQuestions = [
          { question: param.numeratorHelp || "Enter the numerator value for this parameter", value: 0 }
        ];
        denominatorQuestions = [
          { question: param.denominatorHelp || "Enter the denominator value for this parameter", value: 0 }
        ];
    }
    
    setDetailedData(prev => ({
      ...prev,
      [paramId]: {
        numeratorBreakdown: numeratorQuestions,
        denominatorBreakdown: denominatorQuestions
      }
    }));
  };

  // Helper function for category assignment
  const handleCategoryAssignment = (param: CCIParameter, prefix: string) => {
    // Enhanced mapping with more detailed categories
    const categoryMap: Record<string, string> = {
      'GV': 'Governance: Roles and Responsibilities',
      'ID': 'Identify: Asset Management',
      'PR': 'Protect: Data Security'
    };
    
    // More specific mappings based on full prefix pattern
    if (param.measureId.startsWith('ID.AM')) {
      handleChange(param.id, 'frameworkCategory', 'Identify: Asset Management');
    } else if (param.measureId.startsWith('ID.RA')) {
      handleChange(param.id, 'frameworkCategory', 'Identify: Risk Assessment');
    } else if (param.measureId.startsWith('PR.AA')) {
      handleChange(param.id, 'frameworkCategory', 'Protect: Identity Management, Authentication, and Access Control');
    } else if (param.measureId.startsWith('PR.AT')) {
      handleChange(param.id, 'frameworkCategory', 'Protect: Awareness and Training');
    } else if (param.measureId.startsWith('PR.DS')) {
      handleChange(param.id, 'frameworkCategory', 'Protect: Data Security');
    } else if (param.measureId.startsWith('PR.IP')) {
      handleChange(param.id, 'frameworkCategory', 'Protect: Information Protection');
    } else if (param.measureId.startsWith('DE.CM')) {
      handleChange(param.id, 'frameworkCategory', 'Detect: Continuous Monitoring');
    } else if (param.measureId.startsWith('DE.DP')) {
      handleChange(param.id, 'frameworkCategory', 'Detect: Detection Processes');
    } else if (param.measureId.startsWith('RS.RP')) {
      handleChange(param.id, 'frameworkCategory', 'Respond: Response Planning');
    } else if (param.measureId.startsWith('RS.CO')) {
      handleChange(param.id, 'frameworkCategory', 'Respond: Communications');
    } else if (param.measureId.startsWith('RS.AN') || param.measureId.startsWith('RS.MI')) {
      handleChange(param.id, 'frameworkCategory', 'Respond: Analysis and Mitigation');
    } else if (param.measureId.startsWith('RC.RP')) {
      handleChange(param.id, 'frameworkCategory', 'Recover: Recovery Planning');
    } else if (param.measureId.startsWith('RC.IM')) {
      handleChange(param.id, 'frameworkCategory', 'Recover: Improvements');
    }
    // Basic category fallback if no specific pattern matches
    else if (categoryMap[prefix]) {
      handleChange(param.id, 'frameworkCategory', categoryMap[prefix]);
    } else {
      // Fallback for unrecognized prefixes
      handleChange(param.id, 'frameworkCategory', 'Other');
    }
  };

  const addCustomQuestion = (paramId: number, type: 'numerator' | 'denominator') => {
    setDetailedData(prev => {
      const paramData = prev[paramId] || {
        numeratorBreakdown: [],
        denominatorBreakdown: []
      };
      
      if (type === 'numerator') {
        return {
          ...prev,
          [paramId]: {
            ...paramData,
            numeratorBreakdown: [
              ...paramData.numeratorBreakdown,
              { question: `Additional item ${paramData.numeratorBreakdown.length + 1}`, value: 0 }
            ]
          }
        };
      } else {
        return {
          ...prev,
          [paramId]: {
            ...paramData,
            denominatorBreakdown: [
              ...paramData.denominatorBreakdown,
              { question: `Additional item ${paramData.denominatorBreakdown.length + 1}`, value: 0 }
            ]
          }
        };
      }
    });
  };

  const updateQuestionText = (
    paramId: number, 
    type: 'numerator' | 'denominator', 
    index: number, 
    question: string
  ) => {
    setDetailedData(prev => {
      const paramData = prev[paramId] || {
        numeratorBreakdown: [],
        denominatorBreakdown: []
      };
      
      if (type === 'numerator') {
        const updatedNumerator = [...paramData.numeratorBreakdown];
        updatedNumerator[index] = { ...updatedNumerator[index], question };
        return {
          ...prev,
          [paramId]: {
            ...paramData,
            numeratorBreakdown: updatedNumerator
          }
        };
      } else {
        const updatedDenominator = [...paramData.denominatorBreakdown];
        updatedDenominator[index] = { ...updatedDenominator[index], question };
        return {
          ...prev,
          [paramId]: {
            ...paramData,
            denominatorBreakdown: updatedDenominator
          }
        };
      }
    });
  };

  const removeQuestion = (
    paramId: number, 
    type: 'numerator' | 'denominator', 
    index: number
  ) => {
    setDetailedData(prev => {
      const paramData = prev[paramId] || {
        numeratorBreakdown: [],
        denominatorBreakdown: []
      };
      
      if (type === 'numerator') {
        const updatedNumerator = [...paramData.numeratorBreakdown];
        updatedNumerator.splice(index, 1);
        
        const numeratorTotal = updatedNumerator.reduce(
          (sum, item) => sum + (item.value || 0), 0
        );
        handleChange(paramId, 'numerator', numeratorTotal);
        
        return {
          ...prev,
          [paramId]: {
            ...paramData,
            numeratorBreakdown: updatedNumerator
          }
        };
      } else {
        const updatedDenominator = [...paramData.denominatorBreakdown];
        updatedDenominator.splice(index, 1);
        
        const denominatorTotal = updatedDenominator.reduce(
          (sum, item) => sum + (item.value || 0), 0
        );
        handleChange(paramId, 'denominator', denominatorTotal || 1);
        
        return {
          ...prev,
          [paramId]: {
            ...paramData,
            denominatorBreakdown: updatedDenominator
          }
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleExportPDF = () => {
    // Alert the user that PDF export is no longer available
    alert('PDF export is no longer available. Please use Word export in the detailed report view.');
  };

  // Walkthrough functions
  const startWalkthrough = () => {
    setCurrentStep(0);
    setShowWalkthrough(true);
  };

  const nextStep = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowWalkthrough(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeWalkthrough = () => {
    setShowWalkthrough(false);
  };

  // Update tooltip position based on current step
  useEffect(() => {
    if (!showWalkthrough) return;

    const currentTarget = walkthroughSteps[currentStep].target;
    let targetElement: HTMLElement | null = null;

    switch (currentTarget) {
      case 'header':
        targetElement = parameterHeaderRef.current;
        break;
      case 'parameter':
        targetElement = document.querySelector('.border-gray-200');
        break;
      case 'numerator':
        targetElement = numeratorSectionRef.current;
        break;
      case 'denominator':
        targetElement = denominatorSectionRef.current;
        break;
      case 'addQuestion':
        targetElement = addQuestionButtonRef.current;
        break;
      case 'evidence':
        targetElement = evidenceSectionRef.current;
        break;
      case 'export':
        targetElement = exportButtonRef.current;
        break;
      case 'save':
        targetElement = saveButtonRef.current;
        break;
      default:
        break;
    }

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const placement = walkthroughSteps[currentStep].placement || 'bottom';
      const scrollTop = window.scrollY;
      
      // Calculate position based on placement
      let top = 0;
      let left = 0;
      
      switch (placement) {
        case 'top':
          top = rect.top + scrollTop - 150;
          left = rect.left + rect.width / 2 - 150;
          break;
        case 'bottom':
          top = rect.bottom + scrollTop + 10;
          left = rect.left + rect.width / 2 - 150;
          break;
        case 'left':
          top = rect.top + scrollTop + rect.height / 2 - 75;
          left = rect.left - 310;
          break;
        case 'right':
          top = rect.top + scrollTop + rect.height / 2 - 75;
          left = rect.right + 10;
          break;
      }
      
      setTooltipPosition({ top, left });
      
      // Scroll to make sure the element is visible
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, showWalkthrough]);

  // Tooltip component
  const Tooltip = () => {
    if (!showWalkthrough) return null;
    
    const step = walkthroughSteps[currentStep];
    
    return (
      <div
        className="fixed z-50 bg-white shadow-xl rounded-lg p-4 border border-gray-200 w-300"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          width: '300px',
        }}
      >
        <div className="font-bold text-lg mb-2">{step.title}</div>
        <p className="text-gray-600 mb-4">{step.content}</p>
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-sm px-3 py-1 rounded border border-gray-300 mr-2 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              className="text-sm px-3 py-1 rounded bg-black text-white"
            >
              {currentStep === walkthroughSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
          <button
            onClick={closeWalkthrough}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip
          </button>
        </div>
      </div>
    );
  };

  // Function to get color class based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'bg-black';
    if (score >= 60) return 'bg-gray-600';
    if (score >= 40) return 'bg-gray-400';
    return 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-black border-b">
        <div className="flex justify-between items-center" ref={parameterHeaderRef}>
        <h2 className="text-xl font-semibold text-white">Detailed Data Collection</h2>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExporting}
              ref={exportButtonRef}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center disabled:opacity-70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              {isExporting ? 'Generating PDF...' : 'Export as PDF'}
            </button>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-8">
          {formData.map((param) => {
            // Initialize detailed data if not already done
            initializeDetailedData(param.id);
            
            // Calculate current score
            const score = calculateParameterScore(param);
            const paramData = detailedData[param.id] || {
              numeratorBreakdown: [],
              denominatorBreakdown: []
            };
            
            return (
            <div key={param.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-black mb-2">{param.measureId}: {param.title}</h3>
                <p className="text-gray-600 mb-2">{param.description}</p>
                
                {param.frameworkCategory && (
                  <div className="mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      param.frameworkCategory.startsWith('Governance') ? 'bg-purple-100 text-purple-800' :
                      param.frameworkCategory.startsWith('Identify') ? 'bg-blue-100 text-blue-800' :
                      param.frameworkCategory.startsWith('Protect') ? 'bg-green-100 text-green-800' :
                      param.frameworkCategory.startsWith('Detect') ? 'bg-yellow-100 text-yellow-800' :
                      param.frameworkCategory.startsWith('Respond') ? 'bg-orange-100 text-orange-800' :
                      param.frameworkCategory.startsWith('Recover') ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {/* Icon based on category */}
                      {param.frameworkCategory.startsWith('Governance') && (
                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {param.frameworkCategory.startsWith('Identify') && (
                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      )}
                      {param.frameworkCategory.startsWith('Protect') && (
                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {param.frameworkCategory.startsWith('Detect') && (
                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {param.frameworkCategory.startsWith('Respond') && (
                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      )}
                      {param.frameworkCategory.startsWith('Recover') && (
                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                      )}
                      {param.frameworkCategory}
                    </span>
                  </div>
                )}
                
                <div className="text-sm text-gray-500 mb-4">
                  <strong>Formula:</strong> {param.formula}
                </div>
                
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium">Current Score:</span> {score.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Target: {param.target}% | Weightage: {param.weightage}%
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getScoreColorClass(score)}`} 
                      style={{ width: `${Math.min(score, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-4">
                  {/* Numerator Section */}
                  <div ref={numeratorSectionRef} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium">
                        Numerator Questions 
                        {param.numeratorHelp && (
                          <span className="text-xs text-gray-500 block mt-1">
                            ({param.numeratorHelp})
                          </span>
                        )}
                      </h4>
                      <span className="text-sm font-semibold bg-black text-white px-2 py-1 rounded">
                        Total: {param.numerator}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {paramData.numeratorBreakdown.map((item, index) => (
                        <div key={`num-${index}`} className="bg-gray-50 p-3 rounded">
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              {item.question}
                  </label>
                  <input
                    type="number"
                              value={item.value}
                              onChange={(e) => handleDetailedValueChange(param.id, 'numerator', index, Number(e.target.value))}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    min="0"
                  />
                </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => updateQuestionText(param.id, 'numerator', index, item.question)}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Edit Question
                            </button>
                            <button
                              type="button"
                              onClick={() => removeQuestion(param.id, 'numerator', index)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        ref={addQuestionButtonRef}
                        onClick={() => addCustomQuestion(param.id, 'numerator')}
                        className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      >
                        + Add Custom Question
                      </button>
                    </div>
                  </div>
                  
                  {/* Denominator Section */}
                  <div ref={denominatorSectionRef} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium">
                        Denominator Questions
                        {param.denominatorHelp && (
                          <span className="text-xs text-gray-500 block mt-1">
                            ({param.denominatorHelp})
                          </span>
                        )}
                      </h4>
                      <span className="text-sm font-semibold bg-black text-white px-2 py-1 rounded">
                        Total: {param.denominator}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {paramData.denominatorBreakdown.map((item, index) => (
                        <div key={`den-${index}`} className="bg-gray-50 p-3 rounded">
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              {item.question}
                  </label>
                  <input
                    type="number"
                              value={item.value}
                              onChange={(e) => handleDetailedValueChange(param.id, 'denominator', index, Number(e.target.value))}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                              min="0"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => updateQuestionText(param.id, 'denominator', index, item.question)}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Edit Question
                            </button>
                            <button
                              type="button"
                              onClick={() => removeQuestion(param.id, 'denominator', index)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => addCustomQuestion(param.id, 'denominator')}
                        className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      >
                        + Add Custom Question
                      </button>
                    </div>
                </div>
              </div>
              
                <div ref={evidenceSectionRef} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Implementation Evidence</label>
                <div className="mb-2 bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-700">
                  <p className="font-medium mb-1">Suggested Evidence:</p>
                  {param.id === 1 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Vulnerability scan reports from the last assessment period</li>
                      <li>Remediation tracking documentation showing timeline of fixes</li>
                      <li>Change management records for vulnerability patches</li>
                      <li>Screenshots of vulnerability management dashboard</li>
                    </ul>
                  )}
                  {param.id === 2 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Training completion certificates for security personnel</li>
                      <li>Training attendance logs with dates and content covered</li>
                      <li>Skills assessment results for role-specific security training</li>
                      <li>Training program documentation showing role-specific modules</li>
                    </ul>
                  )}
                  {param.id === 3 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Annual budget allocation documents showing security budget</li>
                      <li>Financial reports showing actual security expenditures</li>
                      <li>Budget comparison documents showing IT vs security allocations</li>
                      <li>Purchase orders for security tools, services, and personnel</li>
                    </ul>
                  )}
                  {param.id === 4 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Risk assessment reports with dates and system coverage</li>
                      <li>System inventory documentation</li>
                      <li>Risk assessment methodology documentation</li>
                      <li>Screenshots of risk register or GRC tool</li>
                    </ul>
                  )}
                  {param.id === 5 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>SIEM architecture diagrams showing connected systems</li>
                      <li>Log collection/forwarding configuration files</li>
                      <li>Documentation of critical systems inventory</li>
                      <li>Screenshots of SIEM dashboard showing system coverage</li>
                    </ul>
                  )}
                  {param.id === 6 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Change management records showing approved configuration changes</li>
                      <li>Screenshots of configuration management database</li>
                      <li>Baseline configuration documentation</li>
                      <li>Audit logs showing configuration drift detection</li>
                    </ul>
                  )}
                  {param.id === 7 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Contingency plan test records and after-action reports</li>
                      <li>BCP/DR exercise documentation</li>
                      <li>Test schedule showing systems covered</li>
                      <li>Screenshots of test execution or exercise logs</li>
                    </ul>
                  )}
                  {param.id === 8 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Privileged access management system inventory reports</li>
                      <li>PIM solution architecture diagrams</li>
                      <li>Privileged account inventory documentation</li>
                      <li>Screenshots of privileged session recordings</li>
                    </ul>
                  )}
                  {param.id === 9 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Incident response logs with timestamps</li>
                      <li>Security incident reports with reporting timeline</li>
                      <li>Screenshots from incident management system</li>
                      <li>Incident classification documentation</li>
                    </ul>
                  )}
                  {param.id === 10 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Anti-malware deployment inventory reports</li>
                      <li>Configuration settings for malware protection tools</li>
                      <li>System coverage reports for anti-malware solutions</li>
                      <li>Screenshots of management console showing coverage</li>
                    </ul>
                  )}
                  {param.id === 11 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>MFA configuration documentation for remote access systems</li>
                      <li>VPN session logs showing authentication methods</li>
                      <li>Remote access policy documentation</li>
                      <li>Screenshots of MFA enrollment status for users</li>
                    </ul>
                  )}
                  {param.id === 12 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Physical security incident reports</li>
                      <li>Access control logs for physical entry points</li>
                      <li>Badge system reports for unauthorized access attempts</li>
                      <li>CCTV footage or records of physical security events</li>
                    </ul>
                  )}
                  {param.id === 13 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Signed confidentiality agreements</li>
                      <li>System access request forms showing agreement requirements</li>
                      <li>User onboarding process documentation</li>
                      <li>HR records of agreement completion</li>
                    </ul>
                  )}
                  {param.id === 14 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Background check records for personnel</li>
                      <li>Security clearance documentation</li>
                      <li>Screening policy documentation</li>
                      <li>Personnel security verification records</li>
                    </ul>
                  )}
                  {param.id === 15 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Policy document inventory with approval signatures and dates</li>
                      <li>Policy review schedule and completion records</li>
                      <li>Documentation of policy approval workflow</li>
                      <li>Screenshots of policy management system</li>
                    </ul>
                  )}
                  {param.id === 16 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Contract language samples showing security requirements</li>
                      <li>Vendor assessment documentation</li>
                      <li>Procurement policy showing security requirement integration</li>
                      <li>Third-party security agreement examples</li>
                    </ul>
                  )}
                  {param.id === 17 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>User termination records with timestamps</li>
                      <li>Account deactivation logs</li>
                      <li>HR/IT coordination documentation for departures</li>
                      <li>Screenshots of offboarding workflow system</li>
                    </ul>
                  )}
                  {param.id === 18 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Continuous monitoring strategy documentation</li>
                      <li>Automated control testing reports</li>
                      <li>Dashboard screenshots showing control monitoring</li>
                      <li>Continuous assessment workflow documentation</li>
                    </ul>
                  )}
                  {param.id === 19 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Asset classification documentation</li>
                      <li>Critical asset inventory reports</li>
                      <li>Business impact analysis records</li>
                      <li>System dependency mappings for critical assets</li>
                    </ul>
                  )}
                  {param.id === 20 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>CSK event logs with resolution timestamps</li>
                      <li>Event management system screenshots</li>
                      <li>CSK report handling procedures</li>
                      <li>SLA documentation for event resolution</li>
                    </ul>
                  )}
                  {param.id === 21 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Password policy documentation</li>
                      <li>System configuration screenshots showing password settings</li>
                      <li>Compliance reports for password complexity</li>
                      <li>Group policy objects or equivalent settings</li>
                    </ul>
                  )}
                  {param.id === 22 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Cyber insurance policy documentation</li>
                      <li>Coverage details showing limits and inclusions</li>
                      <li>Insurance renewal documentation</li>
                      <li>Cyber coverage assessment reports</li>
                    </ul>
                  )}
                  {param.id === 23 && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Automated compliance monitoring tool configuration</li>
                      <li>Documentation showing CSCRF mapping to automated controls</li>
                      <li>Compliance dashboard screenshots</li>
                      <li>Automated assessment reports for CSCRF standards</li>
                    </ul>
                  )}
                  {param.id > 23 && (
                    <p>Provide relevant documentation, screenshots, logs, or other evidence that demonstrates your compliance with this control requirement.</p>
                  )}
                </div>
                <textarea
                  value={param.implementationEvidence || ''}
                  onChange={(e) => handleChange(param.id, 'implementationEvidence', e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  placeholder="Provide evidence of implementation..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auditor Comments</label>
                <textarea
                  value={param.auditorComments || ''}
                  onChange={(e) => handleChange(param.id, 'auditorComments', e.target.value)}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  placeholder="Auditor comments..."
                />
              </div>
            </div>
            );
          })}
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-6 rounded-md transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            ref={saveButtonRef}
            className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition duration-200"
          >
            Save and Calculate
          </button>
        </div>
      </form>
      
      {/* Render tooltip component */}
      <Tooltip />
    </div>
  );
};

export default DataCollectionForm; 