import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { CCIParameter, CCIResult } from '../types';
import { calculateParameterScore, calculateWeightedScore } from './cciCalculator';

// Add the missing type definition for jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateSEBIReport = (parameters: CCIParameter[], result: CCIResult) => {
  const doc = new jsPDF();
  
  // Add SEBI logo or header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 153); // SEBI blue
  doc.text('SEBI CSCRF Compliance Report', 105, 15, { align: 'center' });
  
  // Add organization details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Organization: ${result.organization}`, 14, 30);
  doc.text(`Assessment Date: ${result.date}`, 14, 37);
  doc.text(`Maturity Level: ${result.maturityLevel}`, 14, 44);
  doc.text(`Total CCI Score: ${result.totalScore.toFixed(2)}`, 14, 51);
  
  // Add compliance status
  const complianceStatus = result.totalScore >= 60 ? 'Compliant' : 'Non-Compliant';
  doc.setFont('helvetica', 'bold');
  doc.text(`Compliance Status: ${complianceStatus}`, 14, 58);
  
  // Group parameters by framework category (if available)
  const paramsByCategory: Record<string, CCIParameter[]> = {};
  parameters.forEach(param => {
    const category = param.frameworkCategory || 'Uncategorized';
    if (!paramsByCategory[category]) {
      paramsByCategory[category] = [];
    }
    paramsByCategory[category].push(param);
  });
  
  // Add category tables
  let yPos = 70;
  
  Object.keys(paramsByCategory).forEach(category => {
    // Add new page if we're near the bottom
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Category name
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${category} Parameters`, 14, yPos);
    yPos += 7;
    
    // Parameter table
    const tableData = paramsByCategory[category].map(param => {
      const score = calculateParameterScore(param);
      const weightedScore = calculateWeightedScore(param);
      return [
        param.measureId,
        param.title,
        param.numerator,
        param.denominator,
        param.weightage + '%',
        score.toFixed(2),
        weightedScore.toFixed(2)
      ];
    });
    
    doc.autoTable({
      startY: yPos,
      head: [['ID', 'Parameter', 'Numerator', 'Denominator', 'Weightage', 'Score', 'Weighted']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 51, 153], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 70 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    // Add detailed parameter information for this category
    paramsByCategory[category].forEach(param => {
      // Add new page for each parameter's detailed information
      doc.addPage();
      
      // Parameter header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`${param.measureId}: ${param.title}`, 14, 20);
      
      // Parameter details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      let detailYPos = 30;
      
      // Description
      doc.setFont('helvetica', 'bold');
      doc.text('Description:', 14, detailYPos);
      doc.setFont('helvetica', 'normal');
      
      const descriptionLines = doc.splitTextToSize(param.description, 180);
      doc.text(descriptionLines, 14, detailYPos + 5);
      detailYPos += 5 + (descriptionLines.length * 5);
      
      // Formula
      doc.setFont('helvetica', 'bold');
      doc.text('Formula:', 14, detailYPos);
      doc.setFont('helvetica', 'normal');
      
      const formulaLines = doc.splitTextToSize(param.formula, 180);
      doc.text(formulaLines, 14, detailYPos + 5);
      detailYPos += 5 + (formulaLines.length * 5);
      
      // Control Information
      doc.setFont('helvetica', 'bold');
      doc.text('Control Information:', 14, detailYPos);
      doc.setFont('helvetica', 'normal');
      
      const controlInfoLines = doc.splitTextToSize(param.controlInfo, 180);
      doc.text(controlInfoLines, 14, detailYPos + 5);
      detailYPos += 5 + (controlInfoLines.length * 5);
      
      // Implementation Evidence
      doc.setFont('helvetica', 'bold');
      doc.text('Implementation Evidence:', 14, detailYPos);
      doc.setFont('helvetica', 'normal');
      
      const evidenceLines = doc.splitTextToSize(param.implementationEvidence, 180);
      doc.text(evidenceLines, 14, detailYPos + 5);
      detailYPos += 5 + (evidenceLines.length * 5);
      
      // Standard Context (if available)
      if (param.standardContext) {
        // Check if we need a new page
        if (detailYPos > 250) {
          doc.addPage();
          detailYPos = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text('Standard Context:', 14, detailYPos);
        doc.setFont('helvetica', 'normal');
        
        const contextLines = doc.splitTextToSize(param.standardContext, 180);
        doc.text(contextLines, 14, detailYPos + 5);
        detailYPos += 5 + (contextLines.length * 5);
      }
      
      // Best Practices (if available)
      if (param.bestPractices) {
        // Check if we need a new page
        if (detailYPos > 250) {
          doc.addPage();
          detailYPos = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text('Best Practices:', 14, detailYPos);
        doc.setFont('helvetica', 'normal');
        
        const practicesLines = doc.splitTextToSize(param.bestPractices, 180);
        doc.text(practicesLines, 14, detailYPos + 5);
        detailYPos += 5 + (practicesLines.length * 5);
      }
      
      // Regulatory Guidelines (if available)
      if (param.regulatoryGuidelines) {
        // Check if we need a new page
        if (detailYPos > 250) {
          doc.addPage();
          detailYPos = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text('Regulatory Guidelines:', 14, detailYPos);
        doc.setFont('helvetica', 'normal');
        
        const guidelinesLines = doc.splitTextToSize(param.regulatoryGuidelines, 180);
        doc.text(guidelinesLines, 14, detailYPos + 5);
        detailYPos += 5 + (guidelinesLines.length * 5);
      }
      
      // Auditor Comments (if available)
      if (param.auditorComments) {
        // Check if we need a new page
        if (detailYPos > 250) {
          doc.addPage();
          detailYPos = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text('Auditor Comments:', 14, detailYPos);
        doc.setFont('helvetica', 'normal');
        
        const commentsLines = doc.splitTextToSize(param.auditorComments, 180);
        doc.text(commentsLines, 14, detailYPos + 5);
      }
    });
  });
  
  // Final page with signature and attestation
  doc.addPage();
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Declaration and Attestation', 105, 20, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text([
    'I/We hereby declare that all information provided in this assessment is true and accurate to the best',
    'of our knowledge. We confirm that this assessment has been conducted in accordance with SEBI',
    `Circular SEBI/HO/MIRSD/TPD/CIR/P/2023/7 dated January 10, 2023.`,
    '',
    'The Board of Directors has reviewed and approved this assessment.'
  ], 14, 35);
  
  // Signature fields
  doc.setFontSize(11);
  doc.text('Signature of Chief Information Security Officer:', 14, 80);
  doc.line(14, 90, 110, 90);
  doc.text('Name:', 14, 100);
  doc.line(30, 100, 110, 100);
  doc.text('Date:', 14, 110);
  doc.line(30, 110, 110, 110);
  
  doc.text('Signature of Chief Executive Officer:', 14, 130);
  doc.line(14, 140, 110, 140);
  doc.text('Name:', 14, 150);
  doc.line(30, 150, 110, 150);
  doc.text('Date:', 14, 160);
  doc.line(30, 160, 110, 160);
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`SEBI CSCRF Compliance Report - ${result.organization} - Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
  }
  
  return doc;
};

/**
 * Exports the complete CCI assessment report to PDF
 * 
 * This export includes:
 * 1. Summary of CCI scores and compliance status
 * 2. Detailed parameter scores by category
 * 3. Full details for each parameter including:
 *    - Description and formula
 *    - Evidence and control information
 *    - Standard context and best practices
 *    - Regulatory guidelines
 *    - Auditor comments
 * 4. Final attestation page for signatures
 * 
 * @param parameters The complete set of CCIParameters with values
 * @param result The calculated CCIResult with scores
 */
export const exportToPDF = (parameters: CCIParameter[], result: CCIResult) => {
  // Show loading indicator for large reports
  if (parameters.length > 10) {
    // In a real implementation, you might want to show a loading indicator here
    console.log('Generating detailed PDF report, please wait...');
  }
  
  // Generate the full report with all details
  const doc = generateSEBIReport(parameters, result);
  
  // Generate the filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitizedOrgName = result.organization.replace(/\s+/g, '_');
  const filename = `SEBI_CSCRF_Detailed_Report_${sanitizedOrgName}_${timestamp}.pdf`;
  
  // Save the PDF
  doc.save(filename);
  
  console.log(`Detailed report exported successfully as ${filename}`);
};

export const exportAnnexureKToPDF = (
  parameters: CCIParameter[], 
  result: CCIResult,
  entityType: string = '',
  entityCategory: string = '',
  rationale: string = '',
  period: string = '',
  auditingOrganization: string = '',
  signatoryName: string = '',
  designation: string = ''
) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Annexure-K: Cyber Capability Index (CCI)', 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('REPORTING FORMAT FOR MIIs AND QUALIFIED REs TO SUBMIT THEIR CCI SCORE', 105, 25, { align: 'center' });
  
  // Organization details
  let yPos = 35;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('NAME OF THE ORGANISATION:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(result.organization, 100, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('ENTITY TYPE:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(entityType, 100, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('ENTITY CATEGORY:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(entityCategory, 100, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('RATIONALE FOR THE CATEGORY:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(rationale, 100, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('PERIOD:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(period, 100, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('NAME OF THE AUDITING ORGANISATION (applicable for MIIs):', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(auditingOrganization, 100, yPos);
  yPos += 15;
  
  // Signatory declaration
  doc.setFont('helvetica', 'bold');
  doc.text('RE\'s Authorised signatory declaration:', 14, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  const declarationText = 'I/ We hereby confirm that Cyber Capability Index (CCI) has been verified by me/ us and I/ We shall take the responsibility and ownership of the CCI report.';
  const declarationLines = doc.splitTextToSize(declarationText, 180);
  doc.text(declarationLines, 14, yPos);
  yPos += (declarationLines.length * 6) + 5;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Signature:', 14, yPos);
  doc.line(50, yPos, 100, yPos);
  
  doc.text('Name of the signatory:', 110, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(signatoryName, 160, yPos);
  yPos += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Designation (choose whichever applicable):', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(designation, 110, yPos);
  
  // Company stamp box
  doc.rect(155, yPos - 10, 40, 20);
  doc.text('Company stamp', 160, yPos);
  yPos += 20;
  
  // Annexures section
  doc.setFont('helvetica', 'bold');
  doc.text('Annexures:', 14, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.text('1. CCI report as per the format given in Table 27 and CCI score', 20, yPos);
  yPos += 15;
  
  // Background section
  doc.setFont('helvetica', 'bold');
  doc.text('Cyber Capability Index (CCI)', 14, yPos);
  yPos += 8;
  
  doc.text('A. Background-', 14, yPos);
  yPos += 6;
  
  doc.setFont('helvetica', 'normal');
  const backgroundText = 'CCI is an index-framework to rate the preparedness and resilience of the cybersecurity framework of the Market Infrastructure Institutions (MIIs) and Qualified REs. While MIIs are required to conduct third-party assessment of their cyber resilience on a half-yearly basis, Qualified REs are directed to conduct self-assessment of their cyber resilience on an annual basis.';
  const backgroundLines = doc.splitTextToSize(backgroundText, 180);
  doc.text(backgroundLines, 14, yPos);
  yPos += (backgroundLines.length * 5) + 8;
  
  // Methodology section
  doc.setFont('helvetica', 'bold');
  doc.text('B. Index Calculation Methodology-', 14, yPos);
  yPos += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.text('1. The index is calculated on the basis of 23 parameters. These parameters have', 20, yPos);
  doc.text('been given different weightages.', 25, yPos + 5);
  yPos += 12;
  
  doc.text('2. Implementation evidence to be submitted to SEBI only on demand.', 20, yPos);
  yPos += 7;
  
  doc.text('3. All implementation evidences shall be verified by the auditor for conducting', 20, yPos);
  doc.text('third-party assessment of MIIs.', 25, yPos + 5);
  yPos += 12;
  
  doc.text('4. The list of CCI parameters, their corresponding target and weightages in the', 20, yPos);
  doc.text('index, is as follows:', 25, yPos + 5);
  yPos += 15;
  
  // Check if we need a new page for the table
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }
  
  // Parameters table
  const tableData = parameters.map(param => {
    const score = param.numerator / param.denominator * 100;
    const weightedScore = (score / 100) * param.weightage;
    
    return [
      param.measureId,
      param.title,
      param.weightage + '%',
      param.target + '%',
      param.numerator.toString(),
      param.denominator.toString(),
      score.toFixed(2) + '%',
      weightedScore.toFixed(2)
    ];
  });
  
  doc.autoTable({
    startY: yPos,
    head: [['ID', 'Parameter', 'Weightage', 'Target', 'Numerator', 'Denominator', 'Score', 'Weighted']],
    body: tableData,
    foot: [['Total', '', '100%', '', '', '', '', result.totalScore.toFixed(2)]],
    theme: 'grid',
    headStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: 'bold' },
    footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 60 },
    }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Version 1.0', 105, 285, { align: 'center' });
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
  }
  
  doc.save('Annexure-K-CCI-Report.pdf');
}; 