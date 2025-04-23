import React, { forwardRef } from 'react';
import { CCIResult, CCIParameter } from '../app/types';

interface AnnexureKReportProps {
  result: CCIResult;
  parameters: CCIParameter[];
  entityType?: string;
  entityCategory?: string;
  rationale?: string;
  period?: string;
  auditingOrganization?: string;
  signatoryName?: string;
  designation?: string;
}

const AnnexureKReport = forwardRef<HTMLDivElement, AnnexureKReportProps>(
  ({ 
    result, 
    parameters, 
    entityType = '', 
    entityCategory = '', 
    rationale = '', 
    period = '', 
    auditingOrganization = '', 
    signatoryName = '',
    designation = ''
  }, ref) => {
    return (
      <div ref={ref} className="w-full max-w-6xl mx-auto mt-8 mb-12 bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Annexure-K: Cyber Capability Index (CCI)</h1>
        <h2 className="text-xl font-semibold text-center mb-6">REPORTING FORMAT FOR MIIs AND QUALIFIED REs TO SUBMIT THEIR CCI SCORE</h2>
        
        <div className="mb-8 border border-gray-300 p-6 rounded-md">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex">
              <div className="w-1/2 font-semibold">NAME OF THE ORGANISATION:</div>
              <div className="w-1/2">{result.organization}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/2 font-semibold">ENTITY TYPE:</div>
              <div className="w-1/2">{entityType}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/2 font-semibold">ENTITY CATEGORY:</div>
              <div className="w-1/2">{entityCategory}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/2 font-semibold">RATIONALE FOR THE CATEGORY:</div>
              <div className="w-1/2">{rationale}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/2 font-semibold">PERIOD:</div>
              <div className="w-1/2">{period}</div>
            </div>
            
            <div className="flex">
              <div className="w-1/2 font-semibold">NAME OF THE AUDITING ORGANISATION (applicable for MIIs):</div>
              <div className="w-1/2">{auditingOrganization}</div>
            </div>
          </div>
        </div>
        
        <div className="mb-8 border border-gray-300 p-6 rounded-md">
          <h3 className="text-lg font-semibold mb-4">RE's Authorised signatory declaration:</h3>
          
          <div className="mb-6">
            <p className="mb-2">
              I/ We hereby confirm that Cyber Capability Index (CCI) has been verified by me/ us
              and I/ We shall take the responsibility and ownership of the CCI report.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="font-semibold mb-2">Signature:</p>
              <div className="border-b border-gray-400 h-10"></div>
            </div>
            
            <div>
              <p className="font-semibold mb-2">Name of the signatory:</p>
              <div className="border-b border-gray-400 h-10 flex items-end">
                <span>{signatoryName}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold mb-2">Designation (choose whichever applicable):</p>
              <div className="border-b border-gray-400 h-10 flex items-end">
                <span>{designation}</span>
              </div>
            </div>
            
            <div className="flex items-end">
              <div className="border border-gray-400 w-32 h-32 flex items-center justify-center text-gray-500">
                Company stamp
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Annexures:</h3>
          <ol className="list-decimal pl-8">
            <li>CCI report as per the format given in Table 27 and CCI score</li>
          </ol>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Cyber Capability Index (CCI)</h3>
          
          <div className="mb-4">
            <h4 className="text-md font-semibold">A. Background-</h4>
            <p className="text-sm text-gray-700">
              CCI is an index-framework to rate the preparedness and resilience of the cybersecurity framework of the Market Infrastructure Institutions (MIIs) and Qualified REs. While MIIs are required to conduct third-party assessment of their cyber resilience on a half-yearly basis, Qualified REs are directed to conduct self-assessment of their cyber resilience on an annual basis.
            </p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-md font-semibold">B. Index Calculation Methodology-</h4>
            <ol className="list-decimal pl-8 text-sm text-gray-700">
              <li>The index is calculated on the basis of 23 parameters. These parameters have been given different weightages.</li>
              <li>Implementation evidence to be submitted to SEBI only on demand.</li>
              <li>All implementation evidences shall be verified by the auditor for conducting third-party assessment of MIIs.</li>
              <li>The list of CCI parameters, their corresponding target and weightages in the index, is as follows:</li>
            </ol>
          </div>
        </div>
        
        <div className="mb-8">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-300 text-sm">Parameter ID</th>
                <th className="p-2 border border-gray-300 text-sm">Parameter Title</th>
                <th className="p-2 border border-gray-300 text-sm">Weightage</th>
                <th className="p-2 border border-gray-300 text-sm">Target</th>
                <th className="p-2 border border-gray-300 text-sm">Numerator</th>
                <th className="p-2 border border-gray-300 text-sm">Denominator</th>
                <th className="p-2 border border-gray-300 text-sm">Score</th>
                <th className="p-2 border border-gray-300 text-sm">Weighted Score</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((param, index) => {
                const score = param.numerator / param.denominator * 100;
                const weightedScore = (score / 100) * param.weightage;
                
                return (
                  <tr key={param.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="p-2 border border-gray-300 text-sm">{param.measureId}</td>
                    <td className="p-2 border border-gray-300 text-sm">{param.title}</td>
                    <td className="p-2 border border-gray-300 text-sm text-center">{param.weightage}%</td>
                    <td className="p-2 border border-gray-300 text-sm text-center">{param.target}%</td>
                    <td className="p-2 border border-gray-300 text-sm text-center">{param.numerator}</td>
                    <td className="p-2 border border-gray-300 text-sm text-center">{param.denominator}</td>
                    <td className="p-2 border border-gray-300 text-sm text-center">{score.toFixed(2)}%</td>
                    <td className="p-2 border border-gray-300 text-sm text-center">{weightedScore.toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={2} className="p-2 border border-gray-300 text-right">Total</td>
                <td className="p-2 border border-gray-300 text-center">100%</td>
                <td className="p-2 border border-gray-300"></td>
                <td className="p-2 border border-gray-300"></td>
                <td className="p-2 border border-gray-300"></td>
                <td className="p-2 border border-gray-300"></td>
                <td className="p-2 border border-gray-300 text-center">{result.totalScore.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-10">
          <p>Version 1.0</p>
          <p>Page 164 of 205</p>
        </div>
      </div>
    );
  }
);

AnnexureKReport.displayName = 'AnnexureKReport';

export default AnnexureKReport; 