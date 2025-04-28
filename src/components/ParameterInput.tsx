import React, { useState } from 'react';
import { CCIParameter } from '../app/types';
import { calculateParameterScore } from '../app/utils/cciCalculator';

export interface ParameterInputProps {
  parameter: CCIParameter;
  onChange: (paramId: number, field: keyof CCIParameter, value: number | string) => void;
  expanded: boolean;
  onToggleExpand: (paramId: number) => void;
}

const ParameterInput: React.FC<ParameterInputProps> = ({ parameter, onChange, expanded, onToggleExpand }) => {
  const [showDetails, setShowDetails] = useState(false);
  const score = calculateParameterScore(parameter);
  const percentage = parameter.denominator > 0 
    ? (parameter.numerator / parameter.denominator) * 100 
    : 0;
  
  const scoreStyle = score >= 80 
    ? 'font-semibold' 
    : score >= 50 
      ? 'font-medium' 
      : 'font-normal';

  const handleToggleExpand = (paramId: number) => {
    onToggleExpand(paramId);
  };

  const handleParameterChange = (paramId: number, field: keyof CCIParameter, value: number | string) => {
    onChange(paramId, field, value);
  };

  return (
    <div
      className={`border border-gray-200 rounded-xl shadow-sm transition-all duration-200 overflow-hidden ${
        expanded ? 'shadow-md' : ''
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
          expanded ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'
        }`}
        onClick={() => handleToggleExpand(parameter.id)}
      >
        <div>
          <h3 className={`text-base ${expanded ? 'font-semibold text-white' : 'font-medium text-gray-900'}`}>
            {parameter.measureId} - {parameter.title}
          </h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className={`${scoreStyle} text-sm ${expanded ? 'text-gray-300' : 'text-gray-700'}`}>
              Score: {percentage.toFixed(0)}%
            </span>
            <span
              className={`ml-2 inline-block h-3 w-3 rounded-full ${
                percentage >= 80
                  ? 'bg-black'
                  : percentage >= 60
                  ? 'bg-gray-700'
                  : percentage >= 40
                  ? 'bg-gray-400'
                  : 'bg-gray-300'
              }`}
            ></span>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleExpand(parameter.id);
            }}
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="mb-4">
            <p className="text-sm text-gray-600">{parameter.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formula
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                {parameter.formula}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                {parameter.target}% (Weightage: {parameter.weightage}%)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor={`numerator-${parameter.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Numerator {parameter.numeratorHelp && <span className="text-xs text-gray-500">({parameter.numeratorHelp})</span>}
              </label>
              <input
                type="number"
                id={`numerator-${parameter.id}`}
                value={parameter.numerator}
                onChange={(e) => handleParameterChange(parameter.id, 'numerator', Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                min="0"
              />
            </div>
            <div>
              <label htmlFor={`denominator-${parameter.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Denominator {parameter.denominatorHelp && <span className="text-xs text-gray-500">({parameter.denominatorHelp})</span>}
              </label>
              <input
                type="number"
                id={`denominator-${parameter.id}`}
                value={parameter.denominator}
                onChange={(e) => handleParameterChange(parameter.id, 'denominator', Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                min="1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="relative pt-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parameter Score
              </label>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">0%</div>
                <div className="text-xs text-gray-600">50%</div>
                <div className="text-xs text-gray-600">100%</div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 mt-1">
                <div
                  style={{ width: `${percentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black"
                ></div>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-600">{percentage.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor={`evidence-${parameter.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Implementation Evidence
              </label>
              <textarea
                id={`evidence-${parameter.id}`}
                value={parameter.implementationEvidence || ''}
                onChange={(e) => handleParameterChange(parameter.id, 'implementationEvidence', e.target.value)}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                placeholder="Provide evidence of implementation..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor={`comments-${parameter.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Auditor Comments
              </label>
              <textarea
                id={`comments-${parameter.id}`}
                value={parameter.auditorComments || ''}
                onChange={(e) => handleParameterChange(parameter.id, 'auditorComments', e.target.value)}
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                placeholder="Auditor comments..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParameterInput; 