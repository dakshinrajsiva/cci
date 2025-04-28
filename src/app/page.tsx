"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ParameterInput from '../components/ParameterInput';
import CCIResults from '../components/CCIResults';
import CCIReport from '../components/CCIReport';
import AnnexureKForm from '../components/AnnexureKForm';
import { initialCCIParameters, generateSampleData } from './data/cciParameters';
import { CCIParameter, CCIResult, AnnexureKData } from './types';
import { calculateCCIIndex } from './utils/cciCalculator';
import { exportToWord } from './utils/exportUtils';
import DataCollectionForm from '../components/DataCollectionForm';
import { FormState as AnnexureKFormState } from '../components/AnnexureKForm';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [parameters, setParameters] = useState<CCIParameter[]>(initialCCIParameters);
  const [showResults, setShowResults] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showDataCollection, setShowDataCollection] = useState(false);
  const [showAnnexureK, setShowAnnexureK] = useState<boolean>(false);
  const [organizationName, setOrganizationName] = useState('Your Organization');
  const [expandedParameter, setExpandedParameter] = useState<number | null>(null);
  const [assessmentDate, setAssessmentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [annexureKData, setAnnexureKData] = useState<AnnexureKData | null>(null);
  const [isExporting, setIsExporting] = useState(false);

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
    setShowAnnexureK(false);
    setExpandedParameter(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewReport = () => {
    // Show the report view and hide other views
    setShowReport(true);
    setShowResults(false);
    setShowDataCollection(false);
    setShowAnnexureK(false);
    
    // Smooth scroll to report section
    setTimeout(() => {
      const reportElement = document.getElementById('report');
      if (reportElement) {
        reportElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleExportWord = () => {
    // Show loading indicator while Word document is being generated
    setIsExporting(true);
    
    try {
      // Export the full detailed report with parameters, result and annexureKData
      exportToWord(parameters, cciResult, annexureKData || undefined)
        .then(() => {
          setIsExporting(false);
          toast.success('Word document exported successfully!');
        })
        .catch(error => {
          console.error('Error exporting Word document:', error);
          setIsExporting(false);
          toast.error('Failed to export Word document');
        });
    } catch (error) {
      console.error('Error starting Word export:', error);
      setIsExporting(false);
      toast.error('Failed to start Word export');
    }
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
    setShowAnnexureK(false);
    // Smooth scroll to data collection form
    setTimeout(() => {
      const formElement = document.getElementById('data-collection');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleShowAnnexureK = () => {
    setShowAnnexureK(true);
    setShowResults(false);
    setShowReport(false);
    setShowDataCollection(false);
    // Smooth scroll to Annexure K form
    setTimeout(() => {
      const formElement = document.getElementById('annexure-k-form');
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

  const handleAnnexureKComplete = (formData: AnnexureKData) => {
    setAnnexureKData(formData);
    setShowAnnexureK(false);
    handleViewReport();
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

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="p-8 bg-black text-white rounded-b-xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-center">
          Cyber Capability Index Calculator
        </h1>
        <p className="mt-4 text-center text-gray-300">
          SEBI CSCRF Compliance Assessment Tool<br />
          <span className="bg-white text-black px-2 py-1 mt-2 inline-block rounded-md font-medium">
            Deadline: June 30, 2025
          </span>
        </p>

        <div className="mt-4 flex justify-center">
          <a 
            href="https://dakshinrajsiva.github.io/cci/sebi-cscrf" 
            className="bg-white text-black hover:bg-gray-200 py-2 px-6 rounded-md transition duration-200 font-bold flex items-center shadow-md"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            View SEBI CSCRF Implementation Guide
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-300">Organization Name</label>
            <input 
              type="text" 
              id="organization" 
              value={organizationName} 
              onChange={(e) => setOrganizationName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-gray-900 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="assessmentDate" className="block text-sm font-medium text-gray-300">Assessment Date</label>
            <input 
              type="date" 
              id="assessmentDate" 
              value={assessmentDate} 
              onChange={(e) => setAssessmentDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-gray-900 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={handleLoadSample}
            className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Load Sample Data
          </button>
          <button
            onClick={handleShowDataCollection}
            className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Detailed Assessment
          </button>
          <a 
            href="https://dakshinrajsiva.github.io/cci/sebi-cscrf" 
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Implementation Guide
          </a>
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset All
          </button>
          <button
            onClick={handleCalculate}
            className="bg-black hover:bg-gray-900 text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center border border-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Calculate CCI
          </button>
          <button
            onClick={handleShowAnnexureK}
            className="bg-gray-800 hover:bg-black text-white py-2 px-6 rounded-md transition duration-200 shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            {annexureKData ? 'Edit Annexure K' : 'Add Annexure K'}
          </button>
        </div>
      </div>

      {!showDataCollection && !showResults && !showReport && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 bg-black border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">CCI Parameters</h2>
            <button 
              onClick={expandAll}
              className="text-white hover:text-gray-300 font-medium flex items-center"
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
                <h3 className="text-lg font-medium text-black mb-4 pb-2 border-b">
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

      {showAnnexureK && (
        <div id="annexure-k-form" className="mb-8 animate-fadeIn">
          <AnnexureKForm 
            result={cciResult}
            parameters={parameters} 
            onComplete={handleAnnexureKComplete}
            onCancel={() => setShowAnnexureK(false)}
          />
        </div>
      )}

      {showResults && (
        <div id="results" className="bg-white rounded-xl shadow-md overflow-hidden mb-8 animate-fadeIn">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-black">CCI Results</h2>
          </div>
          <div className="p-6">
            <CCIResults result={cciResult} onViewReport={handleViewReport} onReset={handleReset} onShowAnnexureK={handleShowAnnexureK} />
          </div>
        </div>
      )}

      {showReport && (
        <div id="report" className="mb-8 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <div className="p-6 bg-gray-50 border-b">
              <div>
                <h2 className="text-xl font-semibold text-black">CCI Detailed Report</h2>
                {annexureKData && (
                  <p className="text-sm text-black mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Annexure K included
                  </p>
                )}
              </div>
            </div>
          </div>
          <CCIReport parameters={parameters} result={cciResult} onExportWord={handleExportWord} />
        </div>
      )}

      {/* Bottom Calculate CCI Button */}
      <div className="flex justify-center mb-12">
        <button
          onClick={handleCalculate}
          className="bg-black hover:bg-gray-800 text-white py-3 px-8 rounded-lg transition duration-200 shadow-lg flex items-center text-lg font-bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Calculate CCI Score
        </button>
      </div>

      {/* Bottom Call-to-Action for Implementation Guide */}
      <div className="bg-black text-white p-6 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">Need guidance for SEBI CSCRF implementation?</h2>
          <p className="text-gray-300 mt-2">
            Our comprehensive guide provides detailed requirements and evidence examples for each parameter
          </p>
        </div>
        <a 
          href="https://dakshinrajsiva.github.io/cci/sebi-cscrf" 
          className="bg-white text-black hover:bg-gray-200 py-3 px-8 rounded-md transition duration-200 font-bold flex items-center shadow-md"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          View Implementation Guide
        </a>
      </div>
    </div>
  );
} 