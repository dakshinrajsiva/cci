import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { CCIParameter, CCIResult, AnnexureKData } from '../types';
import { calculateParameterScore, calculateWeightedScore } from './cciCalculator';

// Add the missing type definition for jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateSEBIReport = (parameters: CCIParameter[], result: CCIResult, annexureKData?: AnnexureKData) => {
  const doc = new jsPDF();
  
  // Keep track of pages and sections for table of contents
  interface TocItem {
    title: string;
    page: number;
  }
  const toc: TocItem[] = [];
  const addToToc = (title: string, page: number) => {
    toc.push({ title, page });
  };
  
  // Cover Page
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 153); // SEBI blue
  doc.text('SEBI CSCRF', 105, 70, { align: 'center' });
  doc.text('Compliance Report', 105, 85, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Organization: ${result.organization}`, 105, 110, { align: 'center' });
  doc.text(`Assessment Date: ${result.date}`, 105, 120, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Maturity Level: ${result.maturityLevel}`, 105, 140, { align: 'center' });
  doc.text(`Total CCI Score: ${result.totalScore.toFixed(2)}%`, 105, 150, { align: 'center' });
  
  // Cover page footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Confidential - For Internal Use Only', 105, 280, { align: 'center' });
  
  // Table of Contents Page
  doc.addPage();
  const tocStartPage = doc.getNumberOfPages();
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 153);
  doc.text('Table of Contents', 105, 20, { align: 'center' });
  
  // We'll add actual TOC items later after we know all page numbers
  addToToc('Executive Summary', tocStartPage + 1);
  
  // Executive Summary Page
  doc.addPage();
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 153);
  doc.text('Executive Summary', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  let yPos = 40;
  
  // Organization details
  doc.setFont('helvetica', 'bold');
  doc.text('Organization Details', 14, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Organization: ${result.organization}`, 14, yPos);
  yPos += 7;
  doc.text(`Assessment Date: ${result.date}`, 14, yPos);
  yPos += 7;
  
  // Compliance status
  const complianceStatus = result.totalScore >= 60 ? 'Compliant' : 'Non-Compliant';
  doc.text(`Maturity Level: ${result.maturityLevel}`, 14, yPos);
  yPos += 7;
  doc.text(`Total CCI Score: ${result.totalScore.toFixed(2)}%`, 14, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text(`Compliance Status: ${complianceStatus}`, 14, yPos);
  yPos += 15;
  
  // Score breakdown by framework
  doc.setFont('helvetica', 'bold');
  doc.text('Framework Category Scores', 14, yPos);
  yPos += 10;
  
  // Group parameters by framework category
  const paramsByCategory: Record<string, CCIParameter[]> = {};
  parameters.forEach(param => {
    const category = param.frameworkCategory || 'Uncategorized';
    if (!paramsByCategory[category]) {
      paramsByCategory[category] = [];
    }
    paramsByCategory[category].push(param);
  });
  
  // Category score data
  const categoryScores = Object.keys(paramsByCategory).map(category => {
    const params = paramsByCategory[category];
    const totalWeightage = params.reduce((sum, param) => sum + param.weightage, 0);
    const weightedSum = params.reduce((sum, param) => sum + calculateWeightedScore(param), 0);
    const categoryScore = totalWeightage > 0 ? (weightedSum / totalWeightage) * 100 : 0;
    
    return {
      category,
      score: categoryScore.toFixed(2),
      weightage: totalWeightage
    };
  });
  
  // Category scores table
  doc.autoTable({
    startY: yPos,
    head: [['Framework Category', 'Score (%)', 'Weightage (%)']],
    body: categoryScores.map(cat => [cat.category, cat.score, cat.weightage]),
    theme: 'striped',
    headStyles: { fillColor: [0, 51, 153], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 }
    }
  });
  
  // Implementation Evidence Summary Page
  doc.addPage();
  const evidenceSummaryPage = doc.getNumberOfPages();
  addToToc('Implementation Evidence Summary', evidenceSummaryPage);
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 153);
  doc.text('Implementation Evidence Summary', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('This section summarizes all implementation evidence required for each parameter.', 14, 35);
  
  yPos = 45;
  
  // Implementation evidence summary
  Object.keys(paramsByCategory).forEach(category => {
    // Add new page if needed
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(category, 14, yPos);
    yPos += 7;
    
    paramsByCategory[category].forEach(param => {
      // Add new page if needed
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${param.measureId}: ${param.title}`, 20, yPos);
      yPos += 7;
      
      doc.setFont('helvetica', 'normal');
      const evidenceLines = doc.splitTextToSize(param.implementationEvidence, 170);
      doc.text(evidenceLines, 25, yPos);
      yPos += (evidenceLines.length * 5) + 5;
    });
    
    yPos += 5; // Extra space between categories
  });
  
  // Detailed Parameter Assessments Section
  doc.addPage();
  const detailedAssessmentsPage = doc.getNumberOfPages();
  addToToc('Detailed Parameter Assessments', detailedAssessmentsPage);
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 153);
  doc.text('Detailed Parameter Assessments', 105, 20, { align: 'center' });
  
  // Add category tables and detailed parameter information
  yPos = 40;
  
  Object.keys(paramsByCategory).forEach(category => {
    const categoryPage = doc.getNumberOfPages();
    addToToc(`  ${category}`, categoryPage);
    
    // Add new page if we're near the bottom
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Category name
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${category}`, 14, yPos);
    yPos += 10;
    
    // Parameter summary table
    const tableData = paramsByCategory[category].map(param => {
      const score = calculateParameterScore(param);
      const weightedScore = calculateWeightedScore(param);
      return [
        param.measureId,
        param.title,
        score.toFixed(2) + '%',
        param.weightage + '%',
        weightedScore.toFixed(2)
      ];
    });
    
    doc.autoTable({
      startY: yPos,
      head: [['ID', 'Parameter', 'Score', 'Weightage', 'Weighted Score']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 51, 153], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 80 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    // Add detailed parameter information for this category
    paramsByCategory[category].forEach(param => {
      // Add new page for each parameter's detailed information
      doc.addPage();
      const paramPage = doc.getNumberOfPages();
      addToToc(`    ${param.measureId}: ${param.title}`, paramPage);
      
      // Parameter header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 51, 153);
      doc.text(`${param.measureId}: ${param.title}`, 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      let detailYPos = 40;
      
      // Score and basic info in a box
      doc.setDrawColor(0, 51, 153);
      doc.setFillColor(240, 240, 250);
      doc.roundedRect(14, 30, 182, 25, 3, 3, 'FD');
      
      const score = calculateParameterScore(param);
      doc.setFont('helvetica', 'bold');
      doc.text(`Score: ${score.toFixed(2)}%`, 20, detailYPos);
      doc.text(`Target: ${param.target}%`, 80, detailYPos);
      doc.text(`Weightage: ${param.weightage}%`, 140, detailYPos);
      
      const status = score >= param.target ? 'Compliant' : 'Non-Compliant';
      detailYPos += 10;
      doc.text(`Status: ${status}`, 20, detailYPos);
      doc.text(`Category: ${param.frameworkCategory || 'Uncategorized'}`, 80, detailYPos);
      
      detailYPos += 20;
      
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
      
      // Values
      doc.setFont('helvetica', 'bold');
      doc.text('Current Values:', 14, detailYPos);
      detailYPos += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(`Numerator: ${param.numerator}`, 14, detailYPos);
      doc.text(`Denominator: ${param.denominator}`, 100, detailYPos);
      detailYPos += 10;
      
      // Control Information
      doc.setFont('helvetica', 'bold');
      doc.text('Control Information:', 14, detailYPos);
      doc.setFont('helvetica', 'normal');
      
      const controlInfoLines = doc.splitTextToSize(param.controlInfo, 180);
      doc.text(controlInfoLines, 14, detailYPos + 5);
      detailYPos += 5 + (controlInfoLines.length * 5);
      
      // Implementation Evidence - Highlighted Box
      doc.setDrawColor(0, 102, 0);
      doc.setFillColor(240, 250, 240);
      
      const evidenceLines = doc.splitTextToSize(param.implementationEvidence, 175);
      const evidenceHeight = (evidenceLines.length * 5) + 15;
      
      doc.roundedRect(14, detailYPos, 182, evidenceHeight, 3, 3, 'FD');
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 102, 0);
      doc.text('Implementation Evidence Required:', 19, detailYPos + 7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(evidenceLines, 19, detailYPos + 14);
      detailYPos += evidenceHeight + 5;
      
      // Auditor Comments - Highlighted Box
      if (param.auditorComments && param.auditorComments.trim() !== '') {
        // Check if we need a new page
        if (detailYPos > 250) {
          doc.addPage();
          detailYPos = 20;
        }
        
        doc.setDrawColor(102, 0, 102);
        doc.setFillColor(250, 240, 250);
        
        const commentLines = doc.splitTextToSize(param.auditorComments, 175);
        const commentsHeight = (commentLines.length * 5) + 15;
        
        doc.roundedRect(14, detailYPos, 182, commentsHeight, 3, 3, 'FD');
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(102, 0, 102);
        doc.text('Auditor Comments:', 19, detailYPos + 7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(commentLines, 19, detailYPos + 14);
        detailYPos += commentsHeight + 5;
      }
      
      // Add other fields with page breaks as needed
      const addField = (title: string, content: string | undefined) => {
        if (!content || content.trim() === '') return;
        
        // Check if we need a new page
        if (detailYPos > 250) {
          doc.addPage();
          detailYPos = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, detailYPos);
        doc.setFont('helvetica', 'normal');
        
        const contentLines = doc.splitTextToSize(content, 180);
        doc.text(contentLines, 14, detailYPos + 5);
        detailYPos += 5 + (contentLines.length * 5);
      };
      
      // Add remaining fields
      addField('Standard Context:', param.standardContext);
      addField('Best Practices:', param.bestPractices);
      addField('Regulatory Guidelines:', param.regulatoryGuidelines);
    });
  });
  
  // Add Annexure K if available
  if (annexureKData) {
    doc.addPage();
    const annexureKPage = doc.getNumberOfPages();
    addToToc('Annexure K', annexureKPage);
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 51, 153);
    doc.text('Annexure-K Form', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('SEBI Reporting Format for MIIs and Qualified REs to Submit CCI Score', 105, 30, { align: 'center' });
    
    // Organization info table
    doc.autoTable({
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 153], textColor: 255 },
      head: [['Field', 'Value']],
      body: [
        ['Name of the Organisation', annexureKData.organization],
        ['Entity Type', annexureKData.entityType],
        ['Entity Category (as per CSCRF)', annexureKData.entityCategory],
        ['Period', annexureKData.period],
        ['Name of the Auditing Organisation', annexureKData.auditingOrganization || 'Not Applicable']
      ]
    });
    
    // Rationale
    let startY = 40;
    // @ts-ignore - autoTable sets this property on the jsPDF instance
    if (doc.previousAutoTable && doc.previousAutoTable.finalY) {
      // @ts-ignore
      startY = doc.previousAutoTable.finalY + 10;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Rationale for the Category:', 14, startY);
    
    doc.setFont('helvetica', 'normal');
    const rationaleLines = doc.splitTextToSize(annexureKData.rationale, 180);
    doc.text(rationaleLines, 14, startY + 10);
    
    // Signatory section
    const sigY = startY + 10 + (rationaleLines.length * 5) + 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Authorised Signatory Declaration:', 14, sigY);
    
    doc.setFont('helvetica', 'normal');
    doc.text('I/ We hereby confirm that Cyber Capability Index (CCI) has been verified by me/ us and I/ We shall take', 14, sigY + 10);
    doc.text('the responsibility and ownership of the CCI report.', 14, sigY + 17);
    
    // Signatory table
    doc.autoTable({
      startY: sigY + 25,
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 153], textColor: 255 },
      head: [['Field', 'Value']],
      body: [
        ['Name of the Signatory', annexureKData.signatoryName],
        ['Designation', annexureKData.designation]
      ]
    });
    
    // Signature line
    let sigTableY = sigY + 25;
    // @ts-ignore - autoTable sets this property on the jsPDF instance
    if (doc.previousAutoTable && doc.previousAutoTable.finalY) {
      // @ts-ignore
      sigTableY = doc.previousAutoTable.finalY + 10;
    }
    
    doc.setDrawColor(0);
    doc.line(14, sigTableY, 80, sigTableY);
    doc.text('Signature', 14, sigTableY + 5);
    
    doc.setDrawColor(0);
    doc.line(120, sigTableY, 180, sigTableY);
    doc.text('Date', 120, sigTableY + 5);
  }
  
  // Attestation Page
  doc.addPage();
  const attestationPage = doc.getNumberOfPages();
  addToToc('Declaration and Attestation', attestationPage);
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 153);
  doc.text('Declaration and Attestation', 105, 20, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text([
    'I/We hereby declare that all information provided in this assessment is true and accurate to the best',
    'of our knowledge. We confirm that this assessment has been conducted in accordance with SEBI',
    `Circular SEBI/HO/MIRSD/TPD/CIR/P/2023/7 dated January 10, 2023.`,
    '',
    'The Board of Directors has reviewed and approved this assessment.'
  ], 14, 40);
  
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
  
  // Now populate the table of contents
  doc.setPage(tocStartPage);
  let tocYPos = 40;
  
  toc.forEach(item => {
    const level = (item.title.match(/^\s+/) || [''])[0].length / 2;
    const indent = level * 10;
    const title = item.title.trim();
    
    // Format based on hierarchy level
    if (level === 0) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    doc.text(title, 14 + indent, tocYPos);
    doc.text(item.page.toString(), 190, tocYPos, { align: 'right' });
    doc.setDrawColor(200, 200, 200);
    doc.line(14 + indent, tocYPos + 1, 190, tocYPos + 1);
    
    tocYPos += 7;
    
    // Add a new TOC page if needed
    if (tocYPos > 270) {
      doc.addPage();
      doc.setPage(doc.getNumberOfPages() - 1); // Insert TOC page before the last page
      tocYPos = 20;
    }
  });
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    // Skip footer on cover page
    if (i !== 1) {
      doc.text(`SEBI CSCRF Compliance Report - ${result.organization} - Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
  }
  
  return doc;
};

/**
 * Export CCI assessment as PDF
 * 
 * @param parameters The complete set of CCIParameters with values or a DOM element
 * @param result The calculated CCIResult with scores or options object
 * @param annexureKData Optional Annexure K form data
 */
export const exportToPDF = (
  parametersOrElement: CCIParameter[] | HTMLElement,
  resultOrOptions: CCIResult | any,
  annexureKData?: any
) => {
  // Check if we're using the new implementation (HTML2PDF) or the old one (direct jsPDF)
  if (parametersOrElement instanceof HTMLElement) {
    // HTML2PDF implementation - used when calling from page.tsx
    console.log('Exporting report from HTML DOM element');
    // This would use html2pdf.js or similar library to convert DOM to PDF
    // For now, just log that this function was called
    console.log('HTML export called with annexureKData:', annexureKData);
    return Promise.resolve();
  } else {
    // Direct jsPDF implementation - generate from scratch
    // Show loading indicator for large reports
    if (parametersOrElement.length > 10) {
      console.log('Generating detailed PDF report, please wait...');
    }
    
    // Generate the full report with all details (resultOrOptions is CCIResult here)
    const doc = generateSEBIReport(parametersOrElement, resultOrOptions as CCIResult, annexureKData);
    
    // Generate the filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedOrgName = (resultOrOptions as CCIResult).organization.replace(/\s+/g, '_');
    const filename = `SEBI_CSCRF_Detailed_Report_${sanitizedOrgName}_${timestamp}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    console.log(`Detailed report exported successfully as ${filename}`);
    return Promise.resolve();
  }
}; 