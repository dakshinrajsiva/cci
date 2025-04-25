import React, { useState, useEffect } from 'react';
import { CCIResult, CCIParameter } from '../app/types';
import AnnexureKReport from './AnnexureKReport';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { generateAnnexureKSampleData } from '../app/data/cciParameters';

interface AnnexureKFormProps {
  result: CCIResult;
  parameters: CCIParameter[];
  onCancel: () => void;
  onComplete: (formData: FormState) => void;
}

// Interface for form validation errors
interface FormErrors {
  organization?: string;
  entityType?: string;
  entityCategory?: string;
  rationale?: string;
  period?: string;
  auditingOrganization?: string;
  signatoryName?: string;
  designation?: string;
}

// Form state interface
export interface FormState {
  organization: string;
  entityType: string;
  entityCategory: string;
  rationale: string;
  period: string;
  auditingOrganization: string;
  signatoryName: string;
  designation: string;
}

const FORM_STORAGE_KEY = 'annexureK_form_data';

const AnnexureKForm: React.FC<AnnexureKFormProps> = ({ 
  result, 
  parameters, 
  onCancel,
  onComplete
}) => {
  const [formState, setFormState] = useState<FormState>({
    organization: result.organization || '',
    entityType: '',
    entityCategory: '',
    rationale: '',
    period: '',
    auditingOrganization: '',
    signatoryName: '',
    designation: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Form field is required only if it's a MII
  const isMII = formState.entityType === 'Stock Exchange' || 
                formState.entityType === 'Depository' || 
                formState.entityType === 'Clearing Corporation';

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Only restore data if organization matches to prevent confusion
        if (parsedData.organization === result.organization) {
          setFormState(parsedData);
        }
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    }
  }, [result.organization]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (formState.organization) {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formState));
    }
  }, [formState]);

  // Validate form fields
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formState.organization.trim()) {
      newErrors.organization = 'Organization name is required';
    }
    
    if (!formState.entityType) {
      newErrors.entityType = 'Entity type is required';
    }
    
    if (!formState.entityCategory) {
      newErrors.entityCategory = 'Entity category is required';
    }
    
    if (!formState.rationale.trim()) {
      newErrors.rationale = 'Rationale is required';
    } else if (formState.rationale.trim().length < 10) {
      newErrors.rationale = 'Please provide a more detailed rationale (minimum 10 characters)';
    }
    
    if (!formState.period.trim()) {
      newErrors.period = 'Period is required';
    } else if (!/^[A-Za-z]+\s+\d{4}\s+-\s+[A-Za-z]+\s+\d{4}$/.test(formState.period.trim())) {
      newErrors.period = 'Period should be in format "Month YYYY - Month YYYY"';
    }
    
    if (isMII && !formState.auditingOrganization.trim()) {
      newErrors.auditingOrganization = 'Auditing organization is required for MIIs';
    }
    
    if (!formState.signatoryName.trim()) {
      newErrors.signatoryName = 'Signatory name is required';
    }
    
    if (!formState.designation) {
      newErrors.designation = 'Designation is required';
    }
    
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate single field on blur
    const fieldErrors = validateForm();
    if (fieldErrors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name as keyof FormErrors]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formState).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // If no errors, submit the form
    if (Object.keys(formErrors).length === 0) {
      // Clear localStorage after successful submission
      localStorage.removeItem(FORM_STORAGE_KEY);
      onComplete(formState);
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(formErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
    }
  };

  const togglePreview = () => {
    // If switching to preview, validate form first
    if (!previewMode) {
      const formErrors = validateForm();
      setErrors(formErrors);
      
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(formState).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
      
      // Only show preview if no errors
      if (Object.keys(formErrors).length === 0) {
        setPreviewMode(true);
      } else {
        // Scroll to first error
        const firstErrorField = Object.keys(formErrors)[0];
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }
    } else {
      setPreviewMode(false);
    }
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
      const initialState = {
        organization: result.organization || '',
        entityType: '',
        entityCategory: '',
        rationale: '',
        period: '',
        auditingOrganization: '',
        signatoryName: '',
        designation: ''
      };
      setFormState(initialState);
      setErrors({});
      setTouched({});
      setFormSubmitted(false);
      localStorage.removeItem(FORM_STORAGE_KEY);
    }
  };

  const loadSampleData = () => {
    const sampleData = generateAnnexureKSampleData(result.organization);
    setFormState(sampleData);
    setErrors({});
    setTouched({});
  };

  // Helper function to determine if a field has an error
  const hasError = (fieldName: keyof FormState) => {
    return (touched[fieldName] || formSubmitted) && errors[fieldName];
  };

  // Generate and export form data as Word document
  const exportToWord = async () => {
    try {
      // Create document with a single section
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: "Annexure-K Form",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: "SEBI Reporting Format for MIIs and Qualified REs to Submit CCI Score",
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: " " }), // Empty line
            new Paragraph({
              text: "Organization Information",
              heading: HeadingLevel.HEADING_2,
            }),
            
            // Create organization info table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Name of the Organisation")] }),
                    new TableCell({ children: [new Paragraph(formState.organization)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Entity Type")] }),
                    new TableCell({ children: [new Paragraph(formState.entityType)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Entity Category (as per CSCRF)")] }),
                    new TableCell({ children: [new Paragraph(formState.entityCategory)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Period")] }),
                    new TableCell({ children: [new Paragraph(formState.period)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Rationale for the Category")] }),
                    new TableCell({ children: [new Paragraph(formState.rationale)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Name of the Auditing Organisation")] }),
                    new TableCell({ children: [new Paragraph(formState.auditingOrganization || "Not Applicable")] }),
                  ],
                }),
              ],
            }),
            
            new Paragraph({ text: " " }), // Empty line
            new Paragraph({
              text: "CCI Score",
              heading: HeadingLevel.HEADING_2,
            }),
            
            // Create CCI Score table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("CCI Score")] }),
                    new TableCell({ children: [new Paragraph(result.totalScore.toString())] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Maturity Level")] }),
                    new TableCell({ children: [new Paragraph(result.maturityLevel)] }),
                  ],
                }),
              ],
            }),
            
            new Paragraph({ text: " " }), // Empty line
            new Paragraph({
              text: "Parameters Summary",
              heading: HeadingLevel.HEADING_2,
            }),
            
            // Create parameters table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Parameter")] }),
                    new TableCell({ children: [new Paragraph("Score")] }),
                    new TableCell({ children: [new Paragraph("Weightage")] }),
                  ],
                }),
                // Add rows for top 5 parameters by weightage
                ...parameters
                  .sort((a, b) => b.weightage - a.weightage)
                  .slice(0, 5)
                  .map(param => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(param.title)] }),
                        new TableCell({ 
                          children: [
                            new Paragraph(
                              ((param.numerator / param.denominator) * 100).toFixed(1) + "%"
                            )
                          ] 
                        }),
                        new TableCell({ children: [new Paragraph(param.weightage.toString())] }),
                      ],
                    })
                  ),
              ],
            }),
            
            new Paragraph({ text: " " }), // Empty line
            new Paragraph({
              text: "Authorised Signatory Declaration",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: "I/ We hereby confirm that Cyber Capability Index (CCI) has been verified by me/ us and I/ We shall take the responsibility and ownership of the CCI report.",
            }),
            new Paragraph({ text: " " }), // Empty line
            
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Name of the Signatory")] }),
                    new TableCell({ children: [new Paragraph(formState.signatoryName)] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Designation")] }),
                    new TableCell({ children: [new Paragraph(formState.designation)] }),
                  ],
                }),
              ],
            }),
            
            new Paragraph({ text: " " }), // Empty line
            new Paragraph({ text: " " }), // Empty line
            new Paragraph({
              text: "Signature: ________________________",
            }),
            new Paragraph({ text: " " }), // Empty line
            new Paragraph({
              text: "Date: ________________________",
            }),
          ],
        }],
      });
      
      // Generate and save document
      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, `Annexure-K_${formState.organization}_${new Date().toISOString().split('T')[0]}.docx`);
    } catch (error) {
      console.error("Error generating Word document:", error);
      alert("Failed to export document. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-black border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">Annexure-K Form</h2>
            <p className="text-sm text-gray-400 mt-1">SEBI Reporting Format for MIIs and Qualified REs to Submit CCI Score</p>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={loadSampleData}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 flex items-center"
              title="Load example data to see how the form should be filled"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Load Sample Data
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={togglePreview}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
              {previewMode ? 'Edit Form' : 'Preview Report'}
            </button>
          </div>
        </div>
      </div>

      {previewMode ? (
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Preview Mode</h3>
            <p className="text-sm text-blue-700">
              This is a preview of your Annexure-K report. Please review all information carefully before submitting.
            </p>
          </div>
          
          <AnnexureKReport 
            result={result}
            parameters={parameters}
            entityType={formState.entityType}
            entityCategory={formState.entityCategory}
            rationale={formState.rationale}
            period={formState.period}
            auditingOrganization={formState.auditingOrganization}
            signatoryName={formState.signatoryName}
            designation={formState.designation}
          />
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={exportToWord}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export as Word
            </button>
            <button
              type="button"
              onClick={togglePreview}
              className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-6 rounded-md transition duration-200"
            >
              Back to Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition duration-200"
            >
              Complete and Save
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Once completed, this form will be included in the detailed CCI report for submission to SEBI.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6">
          {/* Form progress indicator */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Annexure-K Form Instructions</h3>
              <p className="text-sm text-blue-700 mb-4">
                This form is required for SEBI compliance reporting. Please complete all required fields marked with an asterisk (*).
              </p>
              
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">Form Progress:</div>
                <div className="text-sm text-gray-600">
                  {Object.keys(errors).length === 0 ? (
                    <span className="text-green-600 font-medium">Ready for submission</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">{Object.keys(errors).length} issue(s) to resolve</span>
                  )}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${Object.keys(errors).length === 0 ? 'bg-green-600' : 'bg-yellow-400'}`}
                  style={{ width: `${Math.min(100, Math.max(0, (100 - Object.keys(errors).length * 12.5)))}%` }}
                ></div>
              </div>
              
              <div className="mt-4 flex items-center justify-end text-sm">
                <button 
                  type="button"
                  onClick={loadSampleData}
                  className="text-blue-600 hover:text-blue-800 underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Need help? Load sample data to see an example
                </button>
              </div>
            </div>
          </div>
          
          {/* Remove the top export button in form mode - it's confusing */}
          <div className="mb-6 flex justify-end items-center">
            <div className="text-xs text-gray-500 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Form auto-saves as you type
            </div>
          </div>
        
          <div className="space-y-8">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-black mb-4">
                <span className="inline-flex items-center justify-center rounded-full bg-blue-100 h-6 w-6 text-blue-800 mr-2">1</span>
                Organization Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                    Name of the Organisation <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formState.organization}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`block w-full rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm ${
                      hasError('organization') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    required
                    aria-invalid={hasError('organization') ? "true" : "false"}
                    aria-describedby={hasError('organization') ? 'organization-error' : undefined}
                  />
                  {hasError('organization') && (
                    <p className="mt-1 text-sm text-red-600" id="organization-error">{errors.organization}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="entityType" className="block text-sm font-medium text-gray-700 mb-1">
                    Entity Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="entityType"
                    name="entityType"
                    value={formState.entityType}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`block w-full rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm ${
                      hasError('entityType') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    required
                    aria-invalid={hasError('entityType') ? "true" : "false"}
                    aria-describedby={hasError('entityType') ? 'entityType-error' : undefined}
                  >
                    <option value="">Select Entity Type</option>
                    <optgroup label="Market Infrastructure Institutions (MIIs)">
                      <option value="Stock Exchange">Stock Exchange</option>
                      <option value="Depository">Depository</option>
                      <option value="Clearing Corporation">Clearing Corporation</option>
                    </optgroup>
                    <optgroup label="Qualified Registered Entities (REs)">
                      <option value="Stock Broker">Stock Broker</option>
                      <option value="Depository Participant">Depository Participant</option>
                      <option value="Mutual Fund">Mutual Fund</option>
                      <option value="Registrar and Transfer Agent">Registrar and Transfer Agent</option>
                      <option value="Portfolio Manager">Portfolio Manager</option>
                      <option value="Investment Advisor">Investment Advisor</option>
                      <option value="Research Analyst">Research Analyst</option>
                      <option value="Other RE">Other Qualified RE</option>
                    </optgroup>
                  </select>
                  {hasError('entityType') ? (
                    <p className="mt-1 text-sm text-red-600" id="entityType-error">{errors.entityType}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Select the type of entity you represent under SEBI's classification</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="entityCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Entity Category (as per CSCRF) <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="entityCategory"
                    name="entityCategory"
                    value={formState.entityCategory}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`block w-full rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm ${
                      hasError('entityCategory') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    required
                    aria-invalid={hasError('entityCategory') ? "true" : "false"}
                    aria-describedby={hasError('entityCategory') ? 'entityCategory-error' : undefined}
                  >
                    <option value="">Select Category</option>
                    <option value="Market Infrastructure Institution (MII)">Market Infrastructure Institution (MII)</option>
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                  {hasError('entityCategory') ? (
                    <p className="mt-1 text-sm text-red-600" id="entityCategory-error">{errors.entityCategory}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      {formState.entityType && ['Stock Exchange', 'Depository', 'Clearing Corporation'].includes(formState.entityType) 
                        ? 'MIIs are automatically categorized as Market Infrastructure Institutions' 
                        : 'Select the appropriate category as defined in SEBI CSCRF'}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                    Period <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="period"
                    name="period"
                    value={formState.period}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="e.g., April 2023 - March 2024"
                    className={`block w-full rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm ${
                      hasError('period') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    required
                    aria-invalid={hasError('period') ? "true" : "false"}
                    aria-describedby={hasError('period') ? 'period-error' : undefined}
                  />
                  {hasError('period') ? (
                    <p className="mt-1 text-sm text-red-600" id="period-error">{errors.period}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Enter the assessment period in the format "Month Year - Month Year"</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label htmlFor="rationale" className="block text-sm font-medium text-gray-700 mb-1">
                    Rationale for the Category <span className="text-red-600">*</span>
                  </label>
                  <div className="mb-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <p className="font-medium">Guidance:</p>
                    <p>Explain why your entity belongs to the selected category as per SEBI CSCRF classification criteria. Include your cybersecurity posture, systemic importance, and business impact.</p>
                  </div>
                  <textarea
                    id="rationale"
                    name="rationale"
                    value={formState.rationale}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={3}
                    className={`block w-full rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm ${
                      hasError('rationale') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Provide detailed reasoning for the selected entity category based on CSCRF criteria..."
                    required
                    aria-invalid={hasError('rationale') ? "true" : "false"}
                    aria-describedby={hasError('rationale') ? 'rationale-error' : undefined}
                  />
                  {hasError('rationale') ? (
                    <p className="mt-1 text-sm text-red-600" id="rationale-error">{errors.rationale}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Minimum 10 characters required</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="auditingOrganization" className="block text-sm font-medium text-gray-700 mb-1">
                  Name of the Auditing Organisation {isMII && <span className="text-red-600">*</span>}
                </label>
                <input
                  type="text"
                  id="auditingOrganization"
                  name="auditingOrganization"
                  value={formState.auditingOrganization}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter the name of third-party auditing organization (for MIIs only)"
                  className={`block w-full rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm ${
                    hasError('auditingOrganization') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  required={isMII}
                  aria-invalid={hasError('auditingOrganization') ? "true" : "false"}
                  aria-describedby={hasError('auditingOrganization') ? 'auditingOrganization-error' : undefined}
                />
                {hasError('auditingOrganization') ? (
                  <p className="mt-1 text-sm text-red-600" id="auditingOrganization-error">{errors.auditingOrganization}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    {isMII ? 
                      'Required for Market Infrastructure Institutions (MIIs) - enter the official name of your auditing partner' :
                      'Only required for MIIs. Leave blank if not applicable.'}
                  </p>
                )}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-black mb-4">
                <span className="inline-flex items-center justify-center rounded-full bg-blue-100 h-6 w-6 text-blue-800 mr-2">2</span>
                Authorised Signatory Declaration
              </h3>
              
              <p className="mb-6 text-sm text-gray-700">
                I/ We hereby confirm that Cyber Capability Index (CCI) has been verified by me/ us and I/ We shall take the responsibility and ownership of the CCI report.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="signatoryName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name of the Signatory <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="signatoryName"
                    name="signatoryName"
                    value={formState.signatoryName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Full name of authorized signatory"
                    className={`block w-full rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm ${
                      hasError('signatoryName') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    required
                    aria-invalid={hasError('signatoryName') ? "true" : "false"}
                    aria-describedby={hasError('signatoryName') ? 'signatoryName-error' : undefined}
                  />
                  {hasError('signatoryName') ? (
                    <p className="mt-1 text-sm text-red-600" id="signatoryName-error">{errors.signatoryName}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Enter the full name of the person authorized to sign this document</p>
                  )}
                </div>
                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                    Designation <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="designation"
                    name="designation"
                    value={formState.designation}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`block w-full rounded-md shadow-sm focus:border-black focus:ring-black sm:text-sm ${
                      hasError('designation') ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    required
                    aria-invalid={hasError('designation') ? "true" : "false"}
                    aria-describedby={hasError('designation') ? 'designation-error' : undefined}
                  >
                    <option value="">Select Designation</option>
                    <option value="MD">MD</option>
                    <option value="CEO">CEO</option>
                    <option value="Board member">Board member</option>
                    <option value="Partners">Partners</option>
                    <option value="Proprietor">Proprietor</option>
                  </select>
                  {hasError('designation') ? (
                    <p className="mt-1 text-sm text-red-600" id="designation-error">{errors.designation}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">This must be a senior executive authorized to represent the organization (MD/CEO/Board member/Partners/Proprietor)</p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-600">
                <p><strong>Note:</strong> The authorised signatory declaration confirms that the reported CCI score has been verified and the organization takes responsibility for the accuracy of the report. As per SEBI requirements, this must be signed by a person in a position of authority.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-800">Before submitting:</h4>
                <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
                  <li>Verify all information is accurate and complete</li>
                  <li>Ensure the authorized signatory has approved this submission</li>
                  <li>Click "Preview Report" to review the final document</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-6 rounded-md transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={togglePreview}
                className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Preview Report
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AnnexureKForm; 