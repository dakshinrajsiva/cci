import React, { useState, useEffect } from 'react';
import { CCIParameter } from '../app/types';
import { calculateParameterScore, calculateWeightedScore } from '../app/utils/cciCalculator';

interface DataCollectionFormProps {
  parameters: CCIParameter[];
  onComplete: (updatedParameters: CCIParameter[]) => void;
  onCancel: () => void;
}

interface ParameterDetailedData {
  id: number;
  numeratorBreakdown: { label: string; value: string }[];
  denominatorBreakdown: { label: string; value: string }[];
}

const DataCollectionForm: React.FC<DataCollectionFormProps> = ({ parameters, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [detailedData, setDetailedData] = useState<ParameterDetailedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWeightedScoreAlert, setShowWeightedScoreAlert] = useState(false);
  
  // Generate the form structure on component mount
  useEffect(() => {
    const initialDetailedData = parameters.map(param => {
      const paramId = param.id;
      const numeratorFields = generateNumeratorBreakdownFields(paramId);
      const denominatorFields = generateDenominatorBreakdownFields(paramId);
      
      return {
        id: paramId,
        numeratorBreakdown: numeratorFields,
        denominatorBreakdown: denominatorFields
      };
    });
    
    setDetailedData(initialDetailedData);
  }, [parameters]);
  
  // Helper function to generate numerator breakdown fields based on parameter ID
  const generateNumeratorBreakdownFields = (paramId: number) => {
    // Get parameter title to determine relevant default fields
    const param = parameters.find(p => p.id === paramId);
    
    // Default fields based on parameter type instead of generic "Components"
    let defaultNumeratorFields = [
      { label: 'Primary systems', value: '' },
      { label: 'Secondary systems', value: '' },
      { label: 'Support systems', value: '' },
      { label: 'Manual processes', value: '' },
      { label: 'Other elements', value: '' }
    ];
    
    // Customize fields based on parameter ID
    switch (paramId) {
      case 1: // Security Budget Measure
        return [
          { label: 'Security hardware and appliances', value: '' },
          { label: 'Security software and licenses', value: '' },
          { label: 'Security personnel salaries and benefits', value: '' },
          { label: 'Security training and awareness', value: '' },
          { label: 'Security assessments and audits', value: '' },
          { label: 'Security consulting services', value: '' },
          { label: 'Other security expenses', value: '' }
        ];
      case 2: // Vulnerability Measure
        return [
          { label: 'Critical vulnerabilities remediated', value: '' },
          { label: 'High vulnerabilities remediated', value: '' },
          { label: 'Medium vulnerabilities remediated', value: '' },
          { label: 'Low vulnerabilities remediated', value: '' },
          { label: 'Other vulnerabilities remediated', value: '' }
        ];
      case 3: // Security Training Measure
        return [
          { label: 'Full-time security personnel trained', value: '' },
          { label: 'IT staff with security responsibilities trained', value: '' },
          { label: 'Security contractors/consultants trained', value: '' },
          { label: 'Security management trained', value: '' },
          { label: 'Other security personnel trained', value: '' }
        ];
      case 4: // Remote Access Control Measure
        return [
          { label: 'Employees using MFA for remote access', value: '' },
          { label: 'Contractors using MFA for remote access', value: '' },
          { label: 'Vendors using MFA for remote access', value: '' },
          { label: 'Third-party service providers using MFA', value: '' },
          { label: 'Other remote users with MFA', value: '' }
        ];
      case 5: // Audit Record Review Measure
        return [
          { label: 'Production systems with SIEM integration', value: '' },
          { label: 'Database systems with SIEM integration', value: '' },
          { label: 'Network devices with SIEM integration', value: '' },
          { label: 'Security tools with SIEM integration', value: '' },
          { label: 'Other systems with SIEM integration', value: '' }
        ];
      case 6: // Configuration Changes Measure
        return [
          { label: 'Server configuration changes approved', value: '' },
          { label: 'Network device configuration changes approved', value: '' },
          { label: 'Application configuration changes approved', value: '' },
          { label: 'Database configuration changes approved', value: '' },
          { label: 'Other configuration changes approved', value: '' }
        ];
      case 7: // Contingency Plan Testing Measure
        return [
          { label: 'Production systems with tested contingency plans', value: '' },
          { label: 'Database systems with tested contingency plans', value: '' },
          { label: 'Network systems with tested contingency plans', value: '' },
          { label: 'Security systems with tested contingency plans', value: '' },
          { label: 'Other systems with tested contingency plans', value: '' }
        ];
      case 8: // User Accounts Measure (PIM)
        return [
          { label: 'Production systems with PIM', value: '' },
          { label: 'Database systems with PIM', value: '' },
          { label: 'Network devices with PIM', value: '' },
          { label: 'Security systems with PIM', value: '' },
          { label: 'Cloud services with PIM', value: '' }
        ];
      case 9: // Incident Response Measure
        return [
          { label: 'Critical incidents reported on time', value: '' },
          { label: 'High severity incidents reported on time', value: '' },
          { label: 'Medium severity incidents reported on time', value: '' },
          { label: 'Low severity incidents reported on time', value: '' },
          { label: 'Other incidents reported on time', value: '' }
        ];
      case 10: // Maintenance Measure
        return [
          { label: 'Servers with scheduled maintenance performed', value: '' },
          { label: 'Network devices with maintenance performed', value: '' },
          { label: 'Security appliances with maintenance performed', value: '' },
          { label: 'Applications with maintenance performed', value: '' },
          { label: 'Other systems with maintenance performed', value: '' }
        ];
      case 11: // Media Sanitization Measure
        return [
          { label: 'Hard drives properly sanitized', value: '' },
          { label: 'Removable media properly sanitized', value: '' },
          { label: 'Mobile devices properly sanitized', value: '' },
          { label: 'Backup media properly sanitized', value: '' },
          { label: 'Other media properly sanitized', value: '' }
        ];
      case 12: // Physical Security Incidents Measure (inverse)
        return [
          { label: 'Unauthorized access incidents to server rooms', value: '' },
          { label: 'Unauthorized access incidents to network closets', value: '' },
          { label: 'Unauthorized access incidents to secure workspaces', value: '' },
          { label: 'Other unauthorized access incidents', value: '' }
        ];
      case 13: // System monitoring
        return [
          { label: 'Production servers with monitoring', value: '' },
          { label: 'Network devices with monitoring', value: '' },
          { label: 'Applications with monitoring', value: '' },
          { label: 'Security devices with monitoring', value: '' },
          { label: 'Other systems with monitoring', value: '' }
        ];
      case 14: // Data Protection
        return [
          { label: 'Critical data stores with encryption', value: '' },
          { label: 'Sensitive data with access controls', value: '' },
          { label: 'Backups with encryption', value: '' },
          { label: 'Data transfers with encryption', value: '' },
          { label: 'Other data protection measures implemented', value: '' }
        ];
      case 15: // Risk Assessment Measure
        return [
          { label: 'Production systems risk-assessed', value: '' },
          { label: 'Database systems risk-assessed', value: '' },
          { label: 'Network infrastructure risk-assessed', value: '' },
          { label: 'Critical applications risk-assessed', value: '' },
          { label: 'Critical data assets risk-assessed', value: '' }
        ];
      case 16: // Supply Chain Risk
        return [
          { label: 'Critical suppliers assessed', value: '' },
          { label: 'Key service providers assessed', value: '' },
          { label: 'Software vendors assessed', value: '' },
          { label: 'Hardware suppliers assessed', value: '' },
          { label: 'Other third parties assessed', value: '' }
        ];
      case 17: // Recovery time
        return [
          { label: 'Critical systems with recovery testing', value: '' },
          { label: 'Business applications with recovery testing', value: '' },
          { label: 'Infrastructure with recovery testing', value: '' },
          { label: 'Data stores with recovery testing', value: '' },
          { label: 'Other systems with recovery testing', value: '' }
        ];
      case 18: // Awareness Training
        return [
          { label: 'Employees completing awareness training', value: '' },
          { label: 'Managers completing awareness training', value: '' },
          { label: 'Contractors completing awareness training', value: '' },
          { label: 'Executive staff completing awareness training', value: '' },
          { label: 'Other personnel completing awareness training', value: '' }
        ];
      case 19: // Critical Assets Identified
        return [
          { label: 'Production servers classified as critical', value: '' },
          { label: 'Databases classified as critical', value: '' },
          { label: 'Network devices classified as critical', value: '' },
          { label: 'Applications classified as critical', value: '' },
          { label: 'Other systems classified as critical', value: '' }
        ];
      case 20: // Incident Detection
        return [
          { label: 'Security incidents detected by monitoring', value: '' },
          { label: 'Incidents detected by automated tools', value: '' },
          { label: 'Incidents detected by alerting', value: '' },
          { label: 'Incidents detected by users/staff', value: '' },
          { label: 'Other detection methods', value: '' }
        ];
      case 21: // Patch Management
        return [
          { label: 'Critical patches applied on time', value: '' },
          { label: 'High-priority patches applied on time', value: '' },
          { label: 'Medium-priority patches applied on time', value: '' },
          { label: 'Low-priority patches applied on time', value: '' },
          { label: 'Other patches applied on time', value: '' }
        ];
      case 22: // Backup Testing
        return [
          { label: 'Critical systems with successful backup testing', value: '' },
          { label: 'Databases with successful backup testing', value: '' },
          { label: 'User data with successful backup testing', value: '' },
          { label: 'Configuration data with successful backup testing', value: '' },
          { label: 'Other data with successful backup testing', value: '' }
        ];
      case 23: // Automated compliance with CSCRF
        return [
          { label: 'Governance standards with automated compliance', value: '' },
          { label: 'Identify standards with automated compliance', value: '' },
          { label: 'Protect standards with automated compliance', value: '' },
          { label: 'Detect standards with automated compliance', value: '' },
          { label: 'Respond standards with automated compliance', value: '' },
          { label: 'Recover standards with automated compliance', value: '' }
        ];
      // Add more customized breakdowns for other parameters
      default:
        // If we don't have a specific definition, create relevant defaults based on parameter title
        if (param?.title.toLowerCase().includes('security')) {
          return [
            { label: 'Critical security controls', value: '' },
            { label: 'High-priority security controls', value: '' },
            { label: 'Medium-priority security controls', value: '' },
            { label: 'Low-priority security controls', value: '' },
            { label: 'Other security elements', value: '' }
          ];
        } else if (param?.title.toLowerCase().includes('compliance')) {
          return [
            { label: 'Regulatory requirements met', value: '' },
            { label: 'Policy requirements met', value: '' },
            { label: 'Standard requirements met', value: '' },
            { label: 'Contractual requirements met', value: '' },
            { label: 'Other requirements met', value: '' }
          ];
        }
        return defaultNumeratorFields;
    }
  };
  
  // Helper function to generate denominator breakdown fields based on parameter ID
  const generateDenominatorBreakdownFields = (paramId: number) => {
    // For most parameters, numerator and denominator fields are the same
    if (paramId !== 1) {
      return generateNumeratorBreakdownFields(paramId);
    }
    
    // Special case for Security Budget Measure (ID: 1)
    switch (paramId) {
      case 1: // Security Budget Measure - IT Budget breakdown
        return [
          { label: 'IT Hardware and Infrastructure', value: '' },
          { label: 'IT Software and Licenses', value: '' },
          { label: 'IT Personnel Salaries and Benefits', value: '' },
          { label: 'IT Services and Consulting', value: '' },
          { label: 'Cloud and Hosting Services', value: '' },
          { label: 'IT Training and Development', value: '' },
          { label: 'Other IT Expenses', value: '' }
        ];
      default:
        return generateNumeratorBreakdownFields(paramId);
    }
  };
  
  const handleNumeratorChange = (paramIndex: number, fieldIndex: number, value: string) => {
    const updatedData = [...detailedData];
    updatedData[paramIndex].numeratorBreakdown[fieldIndex].value = value;
    setDetailedData(updatedData);
  };
  
  const handleDenominatorChange = (paramIndex: number, fieldIndex: number, value: string) => {
    const updatedData = [...detailedData];
    updatedData[paramIndex].denominatorBreakdown[fieldIndex].value = value;
    setDetailedData(updatedData);
  };
  
  const calculateTotalNumerator = (paramIndex: number) => {
    return detailedData[paramIndex]?.numeratorBreakdown.reduce((total, field) => {
      const numValue = field.value === '' ? 0 : parseFloat(field.value);
      return total + (isNaN(numValue) ? 0 : numValue);
    }, 0) || 0;
  };
  
  const calculateTotalDenominator = (paramIndex: number) => {
    return detailedData[paramIndex]?.denominatorBreakdown.reduce((total, field) => {
      const numValue = field.value === '' ? 0 : parseFloat(field.value);
      return total + (isNaN(numValue) ? 0 : numValue);
    }, 0) || 0;
  };
  
  // Create a parameter object with current totals for score calculation
  const getCurrentParameterWithTotals = (paramIndex: number) => {
    const param = parameters[paramIndex];
    return {
      ...param,
      numerator: calculateTotalNumerator(paramIndex),
      denominator: calculateTotalDenominator(paramIndex)
    };
  };
  
  // Calculate parameter score (0-100)
  const getParameterScore = (paramIndex: number) => {
    const paramWithTotals = getCurrentParameterWithTotals(paramIndex);
    return calculateParameterScore(paramWithTotals);
  };
  
  // Calculate weighted score (contribution to final CCI)
  const getWeightedScore = (paramIndex: number) => {
    const paramWithTotals = getCurrentParameterWithTotals(paramIndex);
    return calculateWeightedScore(paramWithTotals);
  };
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const handleSubmit = () => {
    setLoading(true);
    
    // Update the parameters with the calculated totals
    const updatedParameters = parameters.map((param, index) => {
      return {
        ...param,
        numerator: calculateTotalNumerator(index),
        denominator: calculateTotalDenominator(index)
      };
    });
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      onComplete(updatedParameters);
    }, 500);
  };
  
  const handleNextStep = () => {
    // Show the weighted score alert before proceeding
    setShowWeightedScoreAlert(true);
    
    // Set a timeout to automatically proceed after showing the alert
    setTimeout(() => {
      setShowWeightedScoreAlert(false);
      
      if (currentStep < parameters.length - 1) {
        setCurrentStep(currentStep + 1);
        // Scroll to top of form
        const formElement = document.getElementById('detailed-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        handleSubmit();
      }
    }, 2000); // Show for 2 seconds
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of form
      const formElement = document.getElementById('detailed-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  // Function to populate the current parameter with sample data
  const populateWithSampleData = () => {
    const updatedData = [...detailedData];
    const currentParamData = updatedData[currentStep];
    
    // Function to generate random value for a component
    const getRandomValue = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    // Populate numerator breakdown with sample data
    currentParamData.numeratorBreakdown = currentParamData.numeratorBreakdown.map(field => {
      // Different ranges based on field position to make data look realistic
      const position = currentParamData.numeratorBreakdown.indexOf(field);
      let value;
      
      if (position === 0) {
        value = getRandomValue(30, 50).toString(); // First field - higher value
      } else if (position === currentParamData.numeratorBreakdown.length - 1) {
        value = getRandomValue(1, 10).toString(); // Last field (often "Other") - lower value
      } else {
        value = getRandomValue(10, 30).toString(); // Middle fields - medium values
      }
      
      return { ...field, value };
    });
    
    // Populate denominator breakdown with sample data
    currentParamData.denominatorBreakdown = currentParamData.denominatorBreakdown.map(field => {
      // Different ranges based on field position to make data look realistic
      const position = currentParamData.denominatorBreakdown.indexOf(field);
      let value;
      
      if (position === 0) {
        value = getRandomValue(50, 80).toString(); // First field - higher value
      } else if (position === currentParamData.denominatorBreakdown.length - 1) {
        value = getRandomValue(5, 15).toString(); // Last field (often "Other") - lower value
      } else {
        value = getRandomValue(20, 50).toString(); // Middle fields - medium values
      }
      
      return { ...field, value };
    });
    
    // Special case handling for certain parameter types
    if (currentParameter.id === 12) { // Physical Security Incidents (inverse parameter)
      // For inverse parameters, we want very low numerator values
      currentParamData.numeratorBreakdown = currentParamData.numeratorBreakdown.map(field => {
        return { ...field, value: getRandomValue(0, 3).toString() };
      });
    }
    
    setDetailedData(updatedData);
  };
  
  // Ensure detailedData is loaded before rendering
  if (detailedData.length === 0) {
    return <div className="p-8 text-center">Loading form...</div>;
  }
  
  const currentParameter = parameters[currentStep];
  const parameterData = detailedData[currentStep];
  const parameterScore = getParameterScore(currentStep);
  const weightedScore = getWeightedScore(currentStep);
  const scoreColor = getScoreColor(parameterScore);
  
  return (
    <div id="detailed-form" className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6 bg-gray-50 border-b">
        <h2 className="text-xl font-semibold text-blue-800">Detailed Data Collection Form</h2>
        <div className="flex flex-wrap justify-between items-center">
          <p className="text-sm text-gray-500 mt-2">
            Step {currentStep + 1} of {parameters.length}: {currentParameter.title}
          </p>
          <p className="text-sm">
            <span className="font-medium">Weightage:</span> <span className="font-bold">{currentParameter.weightage}%</span> of total CCI
          </p>
        </div>
        <div className="w-full bg-gray-200 h-2 mt-4 rounded-full">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${((currentStep + 1) / parameters.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Weighted Score Alert Overlay */}
      {showWeightedScoreAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto text-center animate-popIn">
            <h3 className="text-xl font-bold mb-2">Score Calculated</h3>
            <p className="mb-4">Parameter score for <strong>{currentParameter.title}</strong>:</p>
            <div className="flex justify-center items-center space-x-8 mb-4">
              <div>
                <p className="text-sm text-gray-600">Raw Score</p>
                <p className={`text-2xl font-bold ${scoreColor}`}>{parameterScore.toFixed(1)}</p>
              </div>
              <div className="h-12 border-r border-gray-300"></div>
              <div>
                <p className="text-sm text-gray-600">Weighted Score</p>
                <p className={`text-2xl font-bold ${scoreColor}`}>{weightedScore.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              This parameter contributes {weightedScore.toFixed(2)} points to your total CCI score
            </p>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="mb-6">
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{currentParameter.title}</h3>
              <p className="text-sm text-gray-500">{currentParameter.measureId}</p>
            </div>
            <div className="text-right flex items-center">
              <button
                onClick={populateWithSampleData}
                className="mr-4 bg-purple-100 hover:bg-purple-200 text-purple-800 py-1 px-3 text-sm rounded-md transition-colors duration-200"
              >
                Populate with Sample Data
              </button>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                <span className="font-medium mr-2">Score:</span>
                <span className={`font-bold ${scoreColor}`}>{parameterScore.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <p className="text-sm mt-2">{currentParameter.description}</p>
          <div className="mt-2 p-3 bg-blue-50 text-blue-800 text-sm rounded">
            <strong>Formula:</strong> {currentParameter.formula}
          </div>
          {currentParameter.controlInfo && (
            <div className="mt-2 p-3 bg-gray-50 text-gray-800 text-sm rounded">
              <strong>Control Info:</strong> {currentParameter.controlInfo}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Numerator Section */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4 pb-2 border-b">Numerator Breakdown</h4>
            {currentParameter.numeratorHelp && (
              <div className="mb-4 p-3 bg-gray-50 text-gray-700 text-sm rounded">
                <strong>Help:</strong> {currentParameter.numeratorHelp}
              </div>
            )}
            
            {parameterData.numeratorBreakdown.map((field, fieldIndex) => (
              <div key={fieldIndex} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  type="number"
                  min="0"
                  value={field.value}
                  onChange={(e) => handleNumeratorChange(currentStep, fieldIndex, e.target.value)}
                  placeholder="Enter value"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800">Total Numerator:</span>
                <span className="font-bold text-green-800">{calculateTotalNumerator(currentStep)}</span>
              </div>
            </div>
          </div>
          
          {/* Denominator Section */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4 pb-2 border-b">Denominator Breakdown</h4>
            {currentParameter.denominatorHelp && (
              <div className="mb-4 p-3 bg-gray-50 text-gray-700 text-sm rounded">
                <strong>Help:</strong> {currentParameter.denominatorHelp}
              </div>
            )}
            
            {parameterData.denominatorBreakdown.map((field, fieldIndex) => (
              <div key={fieldIndex} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  type="number"
                  min="0"
                  value={field.value}
                  onChange={(e) => handleDenominatorChange(currentStep, fieldIndex, e.target.value)}
                  placeholder="Enter value"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800">Total Denominator:</span>
                <span className="font-bold text-green-800">{calculateTotalDenominator(currentStep)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {calculateTotalDenominator(currentStep) > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-center">
                <span className="block text-sm font-medium text-blue-800 mb-1">Raw Percentage</span>
                <span className="font-bold text-blue-800 text-xl">
                  {((calculateTotalNumerator(currentStep) / calculateTotalDenominator(currentStep)) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-center">
                <span className="block text-sm font-medium text-purple-800 mb-1">Parameter Score</span>
                <span className={`font-bold text-xl ${scoreColor}`}>
                  {parameterScore.toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="text-center">
                <span className="block text-sm font-medium text-indigo-800 mb-1">Weighted Score</span>
                <span className={`font-bold text-xl ${scoreColor}`}>
                  {weightedScore.toFixed(2)}
                </span>
                <span className="block text-xs text-indigo-600 mt-1">
                  ({currentParameter.weightage}% of total CCI)
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
          <div>
            <button
              onClick={onCancel}
              className="mr-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            
            {currentStep > 0 && (
              <button
                onClick={handlePreviousStep}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
              >
                Previous
              </button>
            )}
          </div>
          
          <button
            onClick={handleNextStep}
            disabled={loading || calculateTotalDenominator(currentStep) === 0}
            className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-200 ${(loading || calculateTotalDenominator(currentStep) === 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : currentStep === parameters.length - 1 ? 'Submit' : 'Calculate & Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataCollectionForm; 