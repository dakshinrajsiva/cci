import React from 'react';
import { CCIResult, CCIParameter } from '../app/types';
import { calculateParameterScore, calculateWeightedScore } from '../app/utils/cciCalculator';

interface CCIReportProps {
  result: CCIResult;
  parameters: CCIParameter[];
}

const CCIReport: React.FC<CCIReportProps> = ({ result, parameters }) => {
  // Helper function to get the color for a score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-600';
  };
  
  // Helper function to get the background color for a score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };
  
  // Get maturity level for a specific score
  const getMaturityLevelForScore = (score: number) => {
    if (score >= 91) return 'Exceptional';
    if (score >= 81) return 'Optimal';
    if (score >= 71) return 'Manageable';
    if (score >= 61) return 'Developing';
    if (score >= 51) return 'Bare Minimum';
    return 'Insufficient';
  };
  
  // Group parameters by their category (if available)
  const parametersByCategory: { [key: string]: CCIParameter[] } = {};
  parameters.forEach(param => {
    const category = param.frameworkCategory || 'Uncategorized';
    if (!parametersByCategory[category]) {
      parametersByCategory[category] = [];
    }
    parametersByCategory[category].push(param);
  });
  
  // Define the standard NIST CSF categories and their display order
  const categoryOrder = [
    'Governance: Roles and Responsibilities',
    'Identify: Risk Assessment',
    'Identify: Asset Management',
    'Protect: Identity Management, Authentication, and Access Control',
    'Protect: Awareness and Training',
    'Protect: Data Security',
    'Protect: Information Protection',
    'Detect: Continuous Monitoring',
    'Detect: Detection Processes',
    'Respond: Response Planning',
    'Respond: Communications',
    'Respond: Analysis and Mitigation',
    'Recover: Recovery Planning',
    'Recover: Improvements',
    'Uncategorized'
  ];
  
  // Sort categories according to the predefined order
  const sortedCategories = Object.keys(parametersByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    
    // If category not found in the order list, put it at the end
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });
  
  // Get friendly name for category (extract main part)
  const getCategoryName = (category: string) => {
    const parts = category.split(':');
    if (parts.length > 1) {
      return parts[0].trim();
    }
    return category;
  };
  
  // Get category subcategory
  const getCategorySubname = (category: string) => {
    const parts = category.split(':');
    if (parts.length > 1) {
      return parts[1].trim();
    }
    return '';
  };
  
  // Calculate category scores
  const categoryScores = sortedCategories.map(category => {
    const params = parametersByCategory[category];
    const totalWeightage = params.reduce((sum, param) => sum + param.weightage, 0);
    const weightedSum = params.reduce((sum, param) => {
      return sum + calculateWeightedScore(param);
    }, 0);
    
    const categoryScore = totalWeightage > 0 ? (weightedSum / totalWeightage) * 100 : 0;
    
    return {
      category,
      mainCategory: getCategoryName(category),
      subCategory: getCategorySubname(category),
      score: categoryScore,
      weightedScore: weightedSum,
      totalWeightage,
      maturityLevel: getMaturityLevelForScore(categoryScore),
      color: getScoreColor(categoryScore).replace('text-', 'bg-').replace('-600', '-500').replace('-500', '-400')
    };
  });
  
  // Group category scores by main category for the dashboard
  const scoresByMainCategory: { [key: string]: number } = {};
  const weightageByMainCategory: { [key: string]: number } = {};
  
  categoryScores.forEach(categoryScore => {
    const mainCategory = getCategoryName(categoryScore.category);
    if (!scoresByMainCategory[mainCategory]) {
      scoresByMainCategory[mainCategory] = 0;
      weightageByMainCategory[mainCategory] = 0;
    }
    scoresByMainCategory[mainCategory] += categoryScore.weightedScore;
    weightageByMainCategory[mainCategory] += categoryScore.totalWeightage;
  });
  
  // Calculate main category aggregate scores
  const mainCategoryScores = Object.keys(scoresByMainCategory).map(category => {
    const totalWeight = weightageByMainCategory[category];
    const totalScore = scoresByMainCategory[category];
    const score = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
    
    return {
      category,
      score,
      maturityLevel: getMaturityLevelForScore(score),
      color: getScoreColor(score).replace('text-', 'bg-').replace('-600', '-500').replace('-500', '-400')
    };
  }).sort((a, b) => {
    const indexA = ['Governance', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover'].indexOf(a.category);
    const indexB = ['Governance', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover'].indexOf(b.category);
    return indexA - indexB;
  });

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Cyber Capability Index - Detailed Report</h2>
      
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Assessment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="mb-2"><strong>Organization:</strong> {result.organization}</p>
            <p className="mb-2"><strong>Assessment Date:</strong> {result.date}</p>
            <p className="mb-2"><strong>Overall CCI Score:</strong> <span className={getScoreColor(result.totalScore)}>{result.totalScore.toFixed(2)}</span></p>
            <p className="mb-2"><strong>Maturity Level:</strong> {result.maturityLevel}</p>
            <p><strong>Description:</strong> {result.maturityDescription}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Main Framework Categories</h4>
            <div className="space-y-2">
              {mainCategoryScores.map((category, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <div className="w-32 font-medium">{category.category}</div>
                  <div className="flex-1 ml-2">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full ${category.color}`} 
                        style={{ width: `${Math.min(100, category.score)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-3 w-16 text-right">
                    <span className={getScoreColor(category.score)}>{category.score.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Maturity Dashboard */}
      <div className="mb-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-xl font-semibold">Category Maturity Classification</h3>
          <p className="text-sm text-gray-600">Detailed breakdown of maturity levels by security domain</p>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryScores.map((category, idx) => (
            <div key={idx} className={`p-4 rounded-lg ${getScoreBgColor(category.score)} border border-gray-200`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{category.category}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getScoreColor(category.score).replace('text', 'bg')}-100 ${getScoreColor(category.score)}`}>
                  {category.score.toFixed(1)}
                </span>
              </div>
              <p className="text-xs mb-2">Weightage: {category.totalWeightage}%</p>
              <div className="mt-2">
                <div className="text-sm font-medium">Maturity: {category.maturityLevel}</div>
                <div className="w-full bg-white bg-opacity-50 rounded-full h-2 mt-1">
                  <div 
                    className={category.color} 
                    style={{ width: `${Math.min(100, category.score)}%`, height: '0.5rem' }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Category sections with parameters */}
      {sortedCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 bg-gray-100 p-3 rounded flex justify-between items-center">
            <span>{category}</span>
            <span className={`text-sm px-3 py-1 rounded-full ${getScoreColor(categoryScores[categoryIndex].score).replace('text', 'bg')}-100 ${getScoreColor(categoryScores[categoryIndex].score)}`}>
              Score: {categoryScores[categoryIndex].score.toFixed(1)} - {categoryScores[categoryIndex].maturityLevel}
            </span>
          </h3>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numerator</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Denominator</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weightage</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weighted Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parametersByCategory[category].map((param, paramIndex) => {
                  const score = calculateParameterScore(param);
                  const weightedScore = calculateWeightedScore(param);
                  
                  return (
                    <React.Fragment key={paramIndex}>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{param.title}</div>
                          <div className="text-xs text-gray-500">{param.measureId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{param.numerator}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{param.denominator}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{param.weightage}%</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getScoreColor(score)}`}>{score.toFixed(2)}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getScoreColor(weightedScore)}`}>{weightedScore.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-700 mb-1">Description:</p>
                            <p className="text-gray-600 mb-2">{param.description}</p>
                            
                            <p className="font-medium text-gray-700 mb-1 mt-3">Control Information:</p>
                            <p className="text-gray-600 mb-2">{param.controlInfo}</p>
                            
                            <p className="font-medium text-gray-700 mb-1 mt-3">Implementation Evidence:</p>
                            <p className="text-gray-600 mb-2">{param.implementationEvidence}</p>
                            
                            {param.standardContext && (
                              <>
                                <p className="font-medium text-gray-700 mb-1 mt-3">Standard Context:</p>
                                <p className="text-gray-600 mb-2">{param.standardContext}</p>
                              </>
                            )}
                            
                            {param.bestPractices && (
                              <>
                                <p className="font-medium text-gray-700 mb-1 mt-3">Best Practices:</p>
                                <p className="text-gray-600 mb-2">{param.bestPractices}</p>
                              </>
                            )}
                            
                            {param.regulatoryGuidelines && (
                              <>
                                <p className="font-medium text-gray-700 mb-1 mt-3">Regulatory Guidelines:</p>
                                <p className="text-gray-600 mb-2">{param.regulatoryGuidelines}</p>
                              </>
                            )}
                            
                            {param.auditorComments && (
                              <>
                                <p className="font-medium text-gray-700 mb-1 mt-3">Auditor Comments:</p>
                                <p className="text-gray-600 mb-2">{param.auditorComments}</p>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="mt-10 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Notes & Observations</h3>
        <div className="text-gray-700 space-y-2">
          <p>This report provides a snapshot of the organization's cyber capability maturity based on the assessment date shown above.</p>
          <p>The CCI is calculated based on the 23 parameters across various domains as specified in the SEBI CSCRF guidelines.</p>
          <p>For areas with lower scores, consider developing action plans to enhance controls and improve overall cyber resilience.</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
            <p className="font-medium mb-1">Maturity Level Classification:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Exceptional (91-100):</span> Leading-edge security posture with advanced capabilities</li>
              <li><span className="font-medium">Optimal (81-90):</span> Robust security program with well-integrated controls</li>
              <li><span className="font-medium">Manageable (71-80):</span> Established security program with consistent implementation</li>
              <li><span className="font-medium">Developing (61-70):</span> Basic security controls with some gaps in implementation</li>
              <li><span className="font-medium">Bare Minimum (51-60):</span> Minimal security controls meeting basic requirements</li>
              <li><span className="font-medium">Insufficient (0-50):</span> Inadequate security controls requiring significant improvements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCIReport; 