"use client";

import React, { useEffect } from 'react';
import SEBICSCRFIntroduction from '../../components/SEBICSCRFIntroduction';
import ImplementationEvidenceGuide from '../../components/ImplementationEvidenceGuide';

export default function SEBICSCRFPage() {
  // For debugging during deployment
  useEffect(() => {
    console.log('SEBICSCRFPage mounted');
    console.log('ImplementationEvidenceGuide component available:', !!ImplementationEvidenceGuide);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Add CSS for shiny animation */}
      <style jsx global>{`
        @keyframes shine {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shine-effect {
          position: relative;
          overflow: hidden;
        }
        .shine-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          transform: skewX(-20deg);
          animation: shine 3s infinite;
          pointer-events: none;
        }
      `}</style>

      {/* SEO-optimized content with structured data */}
      <div itemScope itemType="https://schema.org/WebApplication" className="hidden">
        <meta itemProp="name" content="SEBI CCI Index Calculator" />
        <meta itemProp="description" content="Official SEBI CCI Index Calculator for measuring compliance with SEBI CSCRF framework. Calculate your organization's Cyber Capability Index score now." />
        <meta itemProp="applicationCategory" content="Compliance Tool" />
        <meta itemProp="keywords" content="SEBI CCI Index Calculator, Cyber Capability Index, SEBI CSCRF, cybersecurity compliance, Qualified REs, MIIs, CCI score calculation" />
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">SEBI CCI Index Calculator</h1>
      
      <div className="prose lg:prose-xl mx-auto mb-6">
        <p>The official <strong>SEBI CCI Index Calculator</strong> provides detailed assessment for the Securities and Exchange Board of India (SEBI) Cyber Security and Cyber Resilience Framework (CSCRF) compliance within regulated financial entities. Calculate your Cyber Capability Index score now.</p>
      </div>
      
      {/* Top CTA - Floating Banner */}
      <div className="bg-black text-white p-4 rounded-lg shadow-lg mb-10 sticky top-4 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <div className="bg-white text-black rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">SEBI Compliance Deadline Approaching</p>
              <p className="text-sm">Use the <span className="font-medium">SEBI CCI Index Calculator</span> to assess your readiness</p>
            </div>
          </div>
          <a 
            href="https://dakshinrajsiva.github.io/cci/" 
            className="bg-white hover:bg-gray-200 text-black py-2 px-6 rounded-md transition duration-200 font-bold flex items-center shine-effect"
          >
            Calculate CCI Score →
          </a>
        </div>
      </div>
      
      <SEBICSCRFIntroduction />
      
      {/* Implementation Evidence Guide */}
      <div className="mt-12 mb-12 border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-bold mb-4">Implementation Evidence Guide</h2>
        <p className="mb-4">The Implementation Evidence Guide provides detailed information about the documentation required for each parameter in the SEBI CSCRF framework.</p>
        <ImplementationEvidenceGuide />
      </div>
      
      {/* Mid-page CTA - Card */}
      <div className="bg-gray-900 text-white p-5 rounded-lg border-l-4 border-white flex flex-col md:flex-row justify-between items-center my-10 gap-4">
        <div>
          <h3 className="font-bold text-lg">Ready to use the SEBI CCI Index Calculator?</h3>
          <p className="text-gray-300">Determine your organization's Cyber Capability Index score and maturity level instantly.</p>
        </div>
        <a 
          href="https://dakshinrajsiva.github.io/cci/" 
          className="bg-black hover:bg-gray-800 border border-white text-white py-2 px-6 rounded-md transition duration-200 whitespace-nowrap shine-effect"
        >
          Start Assessment
        </a>
      </div>
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Why Use Our SEBI CCI Index Calculator?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Key Regulatory Aspects</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Mandatory compliance for all SEBI Qualified Regulated Entities</li>
              <li>Quantifiable assessment methodology through CCI</li>
              <li>Bi-annual independent audit requirements</li>
              <li>Board-level oversight and reporting mandates</li>
              <li>Minimum maturity level thresholds based on entity classification</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Focus Areas for REs and MIIs</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Critical Asset Classification and Protection</li>
              <li>Vulnerability Management and Remediation</li>
              <li>Access Control and Identity Management</li>
              <li>Security Incident Response Capabilities</li>
              <li>Third-Party Risk Management</li>
              <li>Continuous Security Monitoring</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold mb-3">Importance of CCI in SEBI CSCRF Compliance</h3>
          <p className="mb-4">
            The <strong>SEBI CCI Index Calculator</strong> serves as the primary measurement tool for SEBI CSCRF compliance, transforming qualitative security 
            assessments into quantifiable metrics. This approach enables:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Objective Measurement:</strong> Standardized scoring across all regulated entities</li>
            <li className="mb-2"><strong>Targeted Improvement:</strong> Identification of specific control gaps for remediation</li>
            <li className="mb-2"><strong>Regulatory Reporting:</strong> Consistent format for SEBI compliance submissions</li>
            <li className="mb-2"><strong>Resource Allocation:</strong> Data-driven approach to security investment decisions</li>
            <li className="mb-2"><strong>Board Communication:</strong> Clear metrics for executive-level reporting</li>
          </ul>
          <p>
            By focusing on the 23 weighted parameters of the CCI, organizations can systematically address SEBI CSCRF requirements while 
            building meaningful security capabilities that protect critical financial infrastructure.
          </p>
        </div>
      </div>
      
      {/* Main CTA Button - Enhanced and more prominent */}
      <div className="flex flex-col items-center justify-center mt-8 mb-12 bg-black p-8 rounded-xl shadow-2xl text-center">
        <h3 className="text-white text-2xl font-bold mb-4">Access the Official SEBI CCI Index Calculator Now!</h3>
        <p className="text-gray-300 mb-6 max-w-2xl">Determine your organization's current CCI score now and get actionable insights to improve your cybersecurity posture before SEBI's deadline.</p>
        <a 
          href="https://dakshinrajsiva.github.io/cci/" 
          className="bg-black hover:bg-gray-900 text-white py-4 px-10 rounded-lg transition duration-300 transform hover:scale-105 flex items-center text-xl font-bold shadow-lg border-2 border-white shine-effect"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          CALCULATE YOUR CCI SCORE NOW
        </a>
        <p className="text-gray-400 mt-4 text-sm">Free assessment tool • Detailed reporting • Compliant with latest SEBI guidelines</p>
      </div>
      
      {/* SEO content section - Hidden from visual display but present for indexing */}
      <div className="mt-8 mb-8 text-gray-700 text-sm">
        <h2 className="text-xl font-semibold mb-3">About the SEBI CCI Index Calculator</h2>
        <p className="mb-3">
          The SEBI CCI Index Calculator is an essential tool for financial institutions in India to assess their compliance with the SEBI Cyber Security and Cyber Resilience Framework (CSCRF). 
          This calculator helps Qualified Regulated Entities (REs) and Market Infrastructure Institutions (MIIs) to quantitatively measure their cybersecurity maturity.
        </p>
        <p className="mb-3">
          Using the <strong>SEBI CCI Index Calculator</strong>, organizations can evaluate their performance across 23 critical parameters aligned with the SEBI CSCRF requirements. 
          The calculator produces a comprehensive Cyber Capability Index score that indicates the organization's overall cybersecurity maturity level.
        </p>
        <p>
          Start using our free SEBI CCI Index Calculator today to ensure your organization meets SEBI's cybersecurity compliance requirements before the deadline.
        </p>
      </div>
      
      <div className="mt-10 text-sm text-gray-600 border-t pt-4">
        <p>
          For more information or questions about the SEBI CCI Index Calculator, contact the SEBI IT department at 
          <a href="mailto:sebicscrf@sebi.gov.in" className="text-blue-600 hover:underline"> sebicscrf@sebi.gov.in</a> or 
          visit the official SEBI website at 
          <a href="https://www.sebi.gov.in" className="text-blue-600 hover:underline"> www.sebi.gov.in</a>.
        </p>
        <p className="mt-2">
          <strong>Disclaimer:</strong> This SEBI CCI Index Calculator is for informational purposes only and does not constitute legal advice. 
          Organizations should consult with qualified legal and security professionals to ensure compliance with all applicable regulations.
        </p>
      </div>
      
      {/* Fixed Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://dakshinrajsiva.github.io/cci/"
          className="flex items-center justify-center bg-black hover:bg-gray-900 text-white rounded-full w-16 h-16 shadow-lg transition-all duration-300 hover:w-48 group overflow-hidden border-2 border-white shine-effect"
        >
          <span className="absolute left-4 opacity-100 group-hover:opacity-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </span>
          <span className="opacity-0 group-hover:opacity-100 ml-8 font-bold whitespace-nowrap">Calculate CCI</span>
        </a>
      </div>
    </div>
  );
} 