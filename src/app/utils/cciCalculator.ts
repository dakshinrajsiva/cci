import { CCIParameter, CCIResult, maturityLevels } from '../types';

/**
 * Calculate the individual score for a parameter
 */
export const calculateParameterScore = (parameter: CCIParameter): number => {
  if (parameter.denominator === 0) return 0;
  
  // Calculate raw percentage
  const percentage = (parameter.numerator / parameter.denominator) * 100;
  
  // For most parameters, higher is better (target is 100%)
  if (parameter.target === 100) {
    return Math.min(percentage, 100);
  }
  
  // For parameter #12 (Physical Security Incidents), lower is better (target is 0%)
  if (parameter.target === 0) {
    return Math.max(0, 100 - percentage);
  }
  
  // For parameter #19 (Critical Assets) which has a target of 50%
  if (parameter.target === 50) {
    // If percentage is 50% or higher, score is 100
    if (percentage >= 50) return 100;
    // Otherwise, score is proportionally calculated
    return (percentage / 50) * 100;
  }
  
  return 0; // Default fallback
};

/**
 * Calculate the weighted score for a parameter
 */
export const calculateWeightedScore = (parameter: CCIParameter): number => {
  const score = calculateParameterScore(parameter);
  return (score * parameter.weightage) / 100;
};

/**
 * Calculate the overall CCI index and maturity level
 */
export const calculateCCIIndex = (parameters: CCIParameter[]): CCIResult => {
  // Update self-assessment scores
  const updatedParameters = parameters.map(param => ({
    ...param,
    selfAssessmentScore: calculateParameterScore(param)
  }));
  
  // Calculate total weighted score
  const totalScore = updatedParameters.reduce((sum, param) => {
    return sum + calculateWeightedScore(param);
  }, 0);
  
  // Determine maturity level
  const maturityLevel = maturityLevels.find(
    level => totalScore >= level.min && totalScore <= level.max
  ) || maturityLevels[maturityLevels.length - 1];
  
  return {
    totalScore,
    maturityLevel: maturityLevel.level,
    maturityDescription: maturityLevel.level === 'Fail' 
      ? 'The organization has scored below the cut-off in at least one domain/sub-domain'
      : `The organization has achieved ${maturityLevel.level}`
  };
}; 