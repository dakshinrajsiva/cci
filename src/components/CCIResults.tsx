import React from 'react';
import { CCIResult } from '../app/types';

export interface CCIResultsProps {
  result: CCIResult;
  onViewReport: () => void;
}

const CCIResults: React.FC<CCIResultsProps> = ({ result, onViewReport }) => {
  // Determine color based on maturity level
  const getScoreColor = () => {
    const score = result.totalScore;
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-600';
  };

  const getBgColor = () => {
    const score = result.totalScore;
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };
  
  const getIconColor = () => {
    const score = result.totalScore;
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };
  
  const getMaturityIcon = () => {
    const score = result.totalScore;
    if (score >= 80) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    } else if (score >= 60) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (score >= 40) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  return (
    <div className="w-full">      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">CCI Score</h3>
            <div className="flex flex-col items-center">
              <div className="relative">
                <svg className="w-36 h-36" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={result.totalScore >= 80 ? "#10B981" : result.totalScore >= 60 ? "#F59E0B" : result.totalScore >= 40 ? "#F97316" : "#EF4444"}
                    strokeWidth="3"
                    strokeDasharray={`${result.totalScore}, 100`}
                  />
                  <text x="18" y="20.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill={result.totalScore >= 80 ? "#10B981" : result.totalScore >= 60 ? "#F59E0B" : result.totalScore >= 40 ? "#F97316" : "#EF4444"}>
                    {result.totalScore.toFixed(1)}
                  </text>
                </svg>
              </div>
              <span className="text-sm text-gray-500 mt-2">out of 100</span>
            </div>
          </div>
        </div>
        
        {/* Maturity Level Card */}
        <div className={`rounded-xl shadow-md overflow-hidden border border-gray-100 ${getBgColor()}`}>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Maturity Level</h3>
            <div className="flex flex-col items-center">
              <div className={getIconColor()}>
                {getMaturityIcon()}
              </div>
              <div className="text-2xl font-bold mt-4 text-center">{result.maturityLevel}</div>
              <p className="text-sm text-gray-600 mt-2 text-center">{result.maturityDescription}</p>
            </div>
          </div>
        </div>
        
        {/* Details Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Assessment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Organization:</span>
                <span className="font-medium">{result.organization}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Assessment Date:</span>
                <span className="font-medium">{result.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Compliance Status:</span>
                <span className={`font-medium ${result.totalScore >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.totalScore >= 60 ? 'Compliant' : 'Non-Compliant'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Score Gauge */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Score Distribution</h3>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">0</span>
              <span className="text-xs text-gray-500">25</span>
              <span className="text-xs text-gray-500">50</span>
              <span className="text-xs text-gray-500">75</span>
              <span className="text-xs text-gray-500">100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  result.totalScore >= 80 ? 'bg-green-500' : 
                  result.totalScore >= 60 ? 'bg-yellow-500' : 
                  result.totalScore >= 40 ? 'bg-orange-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${result.totalScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <div className="text-center">
                <span className="block bg-red-500 text-white px-2 py-1 rounded mb-1">0-50</span>
                <span className="text-xs text-gray-500">Fail</span>
              </div>
              <div className="text-center">
                <span className="block bg-orange-500 text-white px-2 py-1 rounded mb-1">51-60</span>
                <span className="text-xs text-gray-500">Bare Minimum</span>
              </div>
              <div className="text-center">
                <span className="block bg-yellow-500 text-white px-2 py-1 rounded mb-1">61-70</span>
                <span className="text-xs text-gray-500">Developing</span>
              </div>
              <div className="text-center">
                <span className="block bg-green-400 text-white px-2 py-1 rounded mb-1">71-80</span>
                <span className="text-xs text-gray-500">Manageable</span>
              </div>
              <div className="text-center">
                <span className="block bg-green-500 text-white px-2 py-1 rounded mb-1">81-90</span>
                <span className="text-xs text-gray-500">Optimal</span>
              </div>
              <div className="text-center">
                <span className="block bg-green-600 text-white px-2 py-1 rounded mb-1">91-100</span>
                <span className="text-xs text-gray-500">Exceptional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Next Steps</h3>
          <div className="mb-6">
            <p className="text-gray-600">
              {result.totalScore >= 80 
                ? "Your organization has demonstrated strong cybersecurity practices. Continue maintaining this high standard and stay updated with emerging threats."
                : result.totalScore >= 60
                ? "Your organization meets compliance requirements but has opportunities for improvement. Review the detailed report to identify areas for enhancement."
                : "Your organization needs significant improvements to meet SEBI CSCRF requirements. Review the detailed report to prioritize critical areas for immediate attention."}
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={onViewReport}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition duration-200 shadow-md flex items-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              View Detailed Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCIResults; 