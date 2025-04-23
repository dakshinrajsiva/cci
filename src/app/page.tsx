"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ParameterInput from '../components/ParameterInput';
import CCIResults from '../components/CCIResults';
import CCIReport from '../components/CCIReport';
import { initialCCIParameters, generateSampleData } from './data/cciParameters';
import { CCIParameter, CCIResult } from './types';
import { calculateCCIIndex } from './utils/cciCalculator';
import { exportToPDF } from './utils/exportUtils';
import DataCollectionForm from '../components/DataCollectionForm';
import AnnexureKReport from '../components/AnnexureKReport';
import { exportAnnexureKToPDF } from './utils/exportUtils';

export default function Home() {
  const [parameters, setParameters] = useState<CCIParameter[]>(initialCCIParameters);
  const [showResults, setShowResults] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showDataCollection, setShowDataCollection] = useState(false);
  const [organizationName, setOrganizationName] = useState('Your Organization');
  const [expandedParameter, setExpandedParameter] = useState<number | null>(null);
  const [assessmentDate, setAssessmentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showAnnexureK, setShowAnnexureK] = useState(false);
  const [entityType, setEntityType] = useState('');
  const [entityCategory, setEntityCategory] = useState('');
  const [rationale, setRationale] = useState('');
  const [period, setPeriod] = useState('');
  const [auditingOrganization, setAuditingOrganization] = useState('');
  const [signatoryName, setSignatoryName] = useState('');
  const [designation, setDesignation] = useState('');

  const handleParameterChange = (paramId: number, field: keyof CCIParameter, value: number | string) => {
    setParameters(prevParams => 
      prevParams.map(param => 
        param.id === paramId 
          ? { ...param, [field]: value } 
          : param
      )
    );
  };

  const cciResult: CCIResult = {
    ...calculateCCIIndex(parameters),
    date: assessmentDate,
    organization: organizationName
  };

  const handleCalculate = () => {
    setShowResults(true);
    setShowReport(false);
    setShowDataCollection(false);
    // Smooth scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleReset = () => {
    setParameters(initialCCIParameters);
    setShowResults(false);
    setShowReport(false);
    setShowDataCollection(false);
    setExpandedParameter(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewReport = () => {
    setShowReport(true);
    setShowResults(false);
    setShowDataCollection(false);
    // Smooth scroll to report
    setTimeout(() => {
      const reportElement = document.getElementById('report');
      if (reportElement) {
        reportElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleExportPDF = () => {
    // Show loading indicator while PDF is being generated
    const exportBtn = document.getElementById('export-pdf-btn');
    if (exportBtn) {
      exportBtn.textContent = 'Generating PDF...';
      exportBtn.classList.add('opacity-70');
      exportBtn.setAttribute('disabled', 'true');
    }

    // Use setTimeout to allow the UI to update before starting the potentially heavy PDF generation
    setTimeout(() => {
      // Export the full detailed report
      exportToPDF(parameters, cciResult);
      
      // Restore button state
      if (exportBtn) {
        exportBtn.textContent = 'Export as PDF';
        exportBtn.classList.remove('opacity-70');
        exportBtn.removeAttribute('disabled');
      }
      
      // Notify user
      alert('Detailed report has been exported as PDF. The PDF includes all parameter details and audit information.');
    }, 100);
  };

  const handleLoadSample = () => {
    setParameters(generateSampleData());
  };

  const toggleExpanded = (paramId: number) => {
    setExpandedParameter(expandedParameter === paramId ? null : paramId);
  };

  const expandAll = () => {
    // If all are expanded, collapse all
    if (parameters.every(param => expandedParameter === param.id)) {
      setExpandedParameter(null);
    } else {
      // Otherwise expand the first one (just to mark something as expanded)
      setExpandedParameter(parameters[0].id);
    }
  };

  const handleShowDataCollection = () => {
    setShowDataCollection(true);
    setShowResults(false);
    setShowReport(false);
    // Smooth scroll to data collection form
    setTimeout(() => {
      const formElement = document.getElementById('data-collection');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDataCollectionComplete = (updatedParameters: CCIParameter[]) => {
    setParameters(updatedParameters);
    setShowDataCollection(false);
    handleCalculate();
  };

  // Group parameters by category for better organization
  const groupedParameters: Record<string, CCIParameter[]> = {};
  parameters.forEach(param => {
    const category = param.measureId.split('.')[0] || 'Other';
    if (!groupedParameters[category]) {
      groupedParameters[category] = [];
    }
    groupedParameters[category].push(param);
  });

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      'GV': 'Governance',
      'ID': 'Identify',
      'PR': 'Protect',
      'DE': 'Detect',
      'RS': 'Respond',
      'RC': 'Recover'
    };
    return categories[category] || category;
  };

  const handleViewAnnexureK = () => {
    setShowAnnexureK(true);
    setShowResults(false);
    setShowReport(false);
    setShowDataCollection(false);
    // Smooth scroll to annexure K
    setTimeout(() => {
      const annexureElement = document.getElementById('annexure-k');
      if (annexureElement) {
        annexureElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleExportAnnexureK = () => {
    // Show loading indicator while PDF is being generated
    const exportBtn = document.getElementById('export-annexure-k-btn');
    if (exportBtn) {
      exportBtn.textContent = 'Generating Annexure-K...';
      exportBtn.classList.add('opacity-70');
      exportBtn.setAttribute('disabled', 'true');
    }

    // Use setTimeout to allow the UI to update before starting the PDF generation
    setTimeout(() => {
      // Export the Annexure-K report
      exportAnnexureKToPDF(
        parameters, 
        cciResult,
        entityType,
        entityCategory,
        rationale,
        period,
        auditingOrganization,
        signatoryName,
        designation
      );
      
      // Restore button state
      if (exportBtn) {
        exportBtn.textContent = 'Export Annexure-K as PDF';
        exportBtn.classList.remove('opacity-70');
        exportBtn.removeAttribute('disabled');
      }
      
      // Notify user
      alert('Annexure-K has been exported as PDF.');
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-b-xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-center">
          Cyber Capability Index Calculator
        </h1>
        <p className="mt-4 text-center text-blue-100">
          SEBI CSCRF Compliance Assessment Tool<br />
          <span className="bg-yellow-500 text-blue-900 px-2 py-1 mt-2 inline-block rounded-md font-medium">
            Deadline: June 30, 2025
          </span>
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-blue-100">Organization Name</label>
            <input 
              type="text" 
              id="organization" 
              value={organizationName} 
              onChange={(e) => setOrganizationName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring-blue-300 text-gray-900 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="assessmentDate" className="block text-sm font-medium text-blue-100">Assessment Date</label>
            <input 
              type="date" 
              id="assessmentDate" 
              value={assessmentDate} 
              onChange={(e) => setAssessmentDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring-blue-300 text-gray-900 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={handleLoadSample}
            className="bg-blue-900 hover:bg-blue-950 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Load Sample Data
          </button>
          <button
            onClick={handleShowDataCollection}
            className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Detailed Data Collection
          </button>
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset All
          </button>
          <button
            onClick={handleCalculate}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Calculate CCI
          </button>
          {showResults && (
            <button
              onClick={handleViewAnnexureK}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              View Annexure-K Report
            </button>
          )}
        </div>
      </div>

      {!showDataCollection && !showResults && !showReport && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-blue-800">CCI Parameters</h2>
            <button 
              onClick={expandAll}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Toggle All
            </button>
          </div>
          
          <div className="p-6">
            {Object.keys(groupedParameters).map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <h3 className="text-lg font-medium text-blue-800 mb-4 pb-2 border-b">
                  {getCategoryName(category)} Parameters
                </h3>
                
                <div className="space-y-4">
                  {groupedParameters[category].map((param) => (
                    <div key={param.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                      <ParameterInput 
                        parameter={param} 
                        onChange={handleParameterChange}
                        expanded={expandedParameter === param.id}
                        onToggleExpand={() => toggleExpanded(param.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDataCollection && (
        <div id="data-collection" className="mb-8 animate-fadeIn">
          <DataCollectionForm 
            parameters={parameters} 
            onComplete={handleDataCollectionComplete}
            onCancel={() => setShowDataCollection(false)}
          />
        </div>
      )}

      {showResults && (
        <div id="results" className="bg-white rounded-xl shadow-md overflow-hidden mb-8 animate-fadeIn">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-blue-800">CCI Results</h2>
          </div>
          <div className="p-6">
            <CCIResults result={cciResult} onViewReport={handleViewReport} />
          </div>
        </div>
      )}

      {showReport && (
        <div id="report" className="mb-8 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-blue-800">CCI Detailed Report</h2>
              <button
                onClick={handleExportPDF}
                id="export-pdf-btn"
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-200 shadow-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Export as PDF
              </button>
            </div>
          </div>
          <CCIReport parameters={parameters} result={cciResult} />
        </div>
      )}

      {showAnnexureK && (
        <div id="annexure-k" className="mt-8">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Annexure-K Additional Information</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please fill in the additional information required for Annexure-K:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="entity-type" className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                <input
                  type="text"
                  id="entity-type"
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  placeholder="e.g., Intermediary Type"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="entity-category" className="block text-sm font-medium text-gray-700 mb-1">Entity Category</label>
                <input
                  type="text"
                  id="entity-category"
                  value={entityCategory}
                  onChange={(e) => setEntityCategory(e.target.value)}
                  placeholder="Category of the RE as per CSCRF"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="rationale" className="block text-sm font-medium text-gray-700 mb-1">Rationale for the Category</label>
                <input
                  type="text"
                  id="rationale"
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Rationale for categorization"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <input
                  type="text"
                  id="period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="e.g., Jan 2023 - Jun 2023"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="auditing-org" className="block text-sm font-medium text-gray-700 mb-1">Auditing Organization (for MIIs)</label>
                <input
                  type="text"
                  id="auditing-org"
                  value={auditingOrganization}
                  onChange={(e) => setAuditingOrganization(e.target.value)}
                  placeholder="Name of auditing organization"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="signatory-name" className="block text-sm font-medium text-gray-700 mb-1">Name of Signatory</label>
                <input
                  type="text"
                  id="signatory-name"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  placeholder="Name of authorized signatory"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <select
                  id="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Designation</option>
                  <option value="MD">MD</option>
                  <option value="CEO">CEO</option>
                  <option value="Board member">Board member</option>
                  <option value="Partners">Partners</option>
                  <option value="Proprietor">Proprietor</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                id="export-annexure-k-btn"
                onClick={handleExportAnnexureK}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center mx-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export Annexure-K as PDF
              </button>
              
              <button
                onClick={() => {
                  setShowAnnexureK(false);
                  setShowResults(true);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center mx-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Results
              </button>
            </div>
          </div>
          
          <AnnexureKReport 
            result={cciResult}
            parameters={parameters}
            entityType={entityType}
            entityCategory={entityCategory}
            rationale={rationale}
            period={period}
            auditingOrganization={auditingOrganization}
            signatoryName={signatoryName}
            designation={designation}
          />
        </div>
      )}
    </div>
  );
} 