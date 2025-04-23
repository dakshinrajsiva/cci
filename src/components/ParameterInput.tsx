import React, { useState } from 'react';
import { CCIParameter } from '../app/types';
import { calculateParameterScore } from '../app/utils/cciCalculator';

export interface ParameterInputProps {
  parameter: CCIParameter;
  onChange: (paramId: number, field: keyof CCIParameter, value: number | string) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

const ParameterInput: React.FC<ParameterInputProps> = ({ parameter, onChange, expanded, onToggleExpand }) => {
  const [showDetails, setShowDetails] = useState(false);
  const score = calculateParameterScore(parameter);
  const percentage = parameter.denominator > 0 
    ? (parameter.numerator / parameter.denominator) * 100 
    : 0;
  
  const scoreColor = score >= 80 
    ? 'text-green-600' 
    : score >= 50 
      ? 'text-yellow-600' 
      : 'text-red-600';

  return (
    <div className="w-full mb-6 border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex-1">
          <h3 className="text-lg font-medium">{parameter.title}</h3>
          <p className="text-sm text-gray-500">{parameter.measureId} (Weightage: {parameter.weightage}%)</p>
          {parameter.frameworkCategory && (
            <span className="inline-block mt-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
              {parameter.frameworkCategory}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className={`text-xl font-bold ${scoreColor}`}>{score.toFixed(1)}</span>
          </div>
          <svg className={`w-6 h-6 transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Basic parameter information */}
          <div>
            <p className="text-sm">{parameter.description}</p>
          </div>
          
          {/* Formula and calculation section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Formula and Calculation</h4>
            <p className="text-sm mb-4">{parameter.formula}</p>
            <p className="text-sm mb-2">Target: {parameter.target === 100 ? '100% (Higher is better)' : parameter.target === 0 ? '0% (Lower is better)' : `${parameter.target}%`}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Numerator</label>
                <input
                  type="number"
                  value={parameter.numerator}
                  onChange={(e) => onChange(parameter.id, 'numerator', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {parameter.numeratorHelp && (
                  <p className="mt-1 text-xs text-gray-500 italic">{parameter.numeratorHelp}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Denominator</label>
                <input
                  type="number"
                  value={parameter.denominator}
                  onChange={(e) => onChange(parameter.id, 'denominator', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {parameter.denominatorHelp && (
                  <p className="mt-1 text-xs text-gray-500 italic">{parameter.denominatorHelp}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Current: {percentage.toFixed(1)}%</span>
                <span className="text-sm font-medium text-gray-700">Score: {score.toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${score >= 80 ? 'bg-green-600' : score >= 50 ? 'bg-yellow-500' : 'bg-red-600'}`} 
                  style={{ width: `${Math.min(100, score)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Tabs for additional information */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setShowDetails(false)}
                className={`pb-2 px-1 ${!showDetails ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                Implementation Details
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className={`pb-2 px-1 ${showDetails ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                Standard Information
              </button>
            </div>
            
            {/* Implementation details view */}
            {!showDetails && (
              <div className="pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Control Information</label>
                  <textarea
                    value={parameter.controlInfo}
                    onChange={(e) => onChange(parameter.id, 'controlInfo', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Implementation Evidence</label>
                  <textarea
                    value={parameter.implementationEvidence}
                    onChange={(e) => onChange(parameter.id, 'implementationEvidence', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Auditor Comments</label>
                  <textarea
                    value={parameter.auditorComments}
                    onChange={(e) => onChange(parameter.id, 'auditorComments', e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
            
            {/* Standard information view */}
            {showDetails && (
              <div className="pt-4 space-y-4">
                {parameter.standardContext && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Standard Context</label>
                    <textarea
                      value={parameter.standardContext}
                      onChange={(e) => onChange(parameter.id, 'standardContext', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                )}
                
                {parameter.bestPractices && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Best Practices</label>
                    <textarea
                      value={parameter.bestPractices}
                      onChange={(e) => onChange(parameter.id, 'bestPractices', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                )}
                
                {parameter.regulatoryGuidelines && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Regulatory Guidelines</label>
                    <textarea
                      value={parameter.regulatoryGuidelines}
                      onChange={(e) => onChange(parameter.id, 'regulatoryGuidelines', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Framework Category</label>
                  <input
                    type="text"
                    value={parameter.frameworkCategory || ''}
                    onChange={(e) => onChange(parameter.id, 'frameworkCategory', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g., Identify, Protect, Detect, Respond, Recover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParameterInput; 