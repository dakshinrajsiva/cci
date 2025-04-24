import React from 'react';
import { CCIResult, maturityLevels } from '../app/types';

export interface CCIResultsProps {
  result: CCIResult;
  onViewReport: () => void;
  onReset: () => void;
  onShowAnnexureK: () => void;
}

interface CategoryScore {
  name: string;
  score: number;
}

interface ImprovementArea {
  measureId: string;
  title: string;
  score: number;
  impact: number;
}

const CCIResults: React.FC<CCIResultsProps> = ({ result, onViewReport, onReset, onShowAnnexureK }) => {
  // Helper functions for score categories and color
  const getScoreCategory = (score: number): string => {
    const level = maturityLevels.find(level => score >= level.min && score <= level.max);
    return level ? level.level : 'Undetermined';
  };
  
  const getCategoryBadgeColor = (score: number): string => {
    if (score >= 80) return 'bg-gray-800 text-white';
    if (score >= 60) return 'bg-gray-700 text-white';
    if (score >= 40) return 'bg-gray-600 text-white';
    return 'bg-gray-500 text-white';
  };

  // Format date as DD-MM-YYYY
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Sample category scores for the black and white theme
  const sampleCategoryScores: CategoryScore[] = [
    { name: 'Governance', score: 75.5 },
    { name: 'Identify', score: 82.3 },
    { name: 'Protect', score: 68.9 },
    { name: 'Detect', score: 71.2 },
    { name: 'Respond', score: 65.8 },
    { name: 'Recover', score: 60.1 }
  ];

  // Sample improvement areas
  const sampleImprovementAreas: ImprovementArea[] = [
    { measureId: 'PR.5.2', title: 'Multi-factor Authentication', score: 50, impact: 5.2 },
    { measureId: 'DE.2.1', title: 'Security Monitoring', score: 60, impact: 4.8 },
    { measureId: 'GV.1.3', title: 'Security Policies', score: 65, impact: 4.3 },
    { measureId: 'RS.3.1', title: 'Incident Response', score: 55, impact: 3.9 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-scaleIn">
      <div className="p-6 bg-black border-b">
        <h2 className="text-xl font-semibold text-white">Cyber Capability Index Results</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Organization</h3>
            <p className="text-xl font-bold text-black">{result.organization}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Assessment Date</h3>
            <p className="text-xl font-bold text-black">{formatDate(result.date)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Overall CCI Score</h3>
            <p className="text-xl font-bold text-black">
              {result.totalScore.toFixed(2)}
              <span className="ml-2 text-sm font-normal">
                ({result.maturityLevel})
              </span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-black mb-4">Score Breakdown by Category</h3>
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleCategoryScores.map((category, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {category.score.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getCategoryBadgeColor(category.score)}`}>
                        {getScoreCategory(category.score)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-black mb-4">Top Improvement Areas</h3>
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Measure ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Current Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Impact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleImprovementAreas.map((area, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {area.measureId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {area.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {area.score.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      +{area.impact.toFixed(2)} points
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onReset}
            className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-6 rounded-md transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset
          </button>
          <button
            onClick={onShowAnnexureK}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Annexure-K Form
          </button>
          <button
            onClick={onViewReport}
            className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            View Detailed Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default CCIResults; 