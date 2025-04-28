import { Document, Paragraph, Table, TableRow, TableCell, HeadingLevel, TextRun, BorderStyle, AlignmentType, TableOfContents, PageBreak, ExternalHyperlink, Packer, SectionType, ISectionOptions } from 'docx';
import { saveAs } from 'file-saver';
import { CCIParameter, CCIResult, AnnexureKData } from '../types';
import { calculateParameterScore, calculateWeightedScore } from './cciCalculator';

/**
 * Generate and export SEBI CSCRF report in Word format
 * 
 * @param parameters The complete set of CCIParameters with values
 * @param result The calculated CCIResult with scores
 * @param annexureKData Optional Annexure K form data
 */
export const exportToWord = async (
  parameters: CCIParameter[],
  result: CCIResult,
  annexureKData?: AnnexureKData
) => {
  // Show loading indicator for large reports
  if (parameters.length > 10) {
    console.log('Generating detailed Word report, please wait...');
  }
  
  // Group parameters by framework category
  const paramsByCategory: Record<string, CCIParameter[]> = {};
  parameters.forEach(param => {
    const category = param.frameworkCategory || 'Uncategorized';
    if (!paramsByCategory[category]) {
      paramsByCategory[category] = [];
    }
    paramsByCategory[category].push(param);
  });
  
  // Generate report content
  const children = [
    // Cover Page
    new Paragraph({
      text: "SEBI CSCRF",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 3000, // Position vertically in the middle of the page
      },
    }),
    new Paragraph({
      text: "Compliance Report",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 1000,
      },
    }),
    new Paragraph({
      text: `Organization: ${result.organization}`,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: `Assessment Date: ${new Date(result.date).toLocaleDateString('en-GB')}`,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: `Maturity Level: ${result.maturityLevel}`,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 500,
      },
    }),
    new Paragraph({
      text: `Total CCI Score: ${result.totalScore.toFixed(2)}%`,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: "Confidential - For Internal Use Only",
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 2000,
      },
    }),
    new PageBreak(),
    
    // Table of Contents
    new Paragraph({
      text: "Table of Contents",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    new TableOfContents("Table of Contents"),
    new PageBreak(),
    
    // Executive Summary
    new Paragraph({
      text: "Executive Summary",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      text: "Organization Details",
      heading: HeadingLevel.HEADING_3,
    }),
    new Paragraph(`Organization: ${result.organization}`),
    new Paragraph(`Assessment Date: ${new Date(result.date).toLocaleDateString('en-GB')}`),
    new Paragraph(`Maturity Level: ${result.maturityLevel}`),
    new Paragraph(`Total CCI Score: ${result.totalScore.toFixed(2)}%`),
    new Paragraph({
      text: `Compliance Status: ${result.totalScore >= 60 ? 'Compliant' : 'Non-Compliant'}`,
      spacing: {
        after: 400,
      },
    }),
    
    // Framework Category Scores
    new Paragraph({
      text: "Framework Category Scores",
      heading: HeadingLevel.HEADING_3,
    }),
  ];
  
  // Category score table
  const categoryScores = Object.keys(paramsByCategory).map(category => {
    const params = paramsByCategory[category];
    const totalWeightage = params.reduce((sum: number, param: CCIParameter) => sum + param.weightage, 0);
    const weightedSum = params.reduce((sum: number, param: CCIParameter) => sum + calculateWeightedScore(param), 0);
    const categoryScore = totalWeightage > 0 ? (weightedSum / totalWeightage) * 100 : 0;
    
    return {
      category,
      score: categoryScore.toFixed(2),
      weightage: totalWeightage
    };
  });
  
  // Add category scores table
  const categoryScoresTable = new Table({
    rows: [
      // Header row
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph("Framework Category")],
            shading: {
              fill: "0033CC",
            },
          }),
          new TableCell({
            children: [new Paragraph("Score (%)")],
            shading: {
              fill: "0033CC",
            },
          }),
          new TableCell({
            children: [new Paragraph("Weightage (%)")],
            shading: {
              fill: "0033CC",
            },
          }),
        ],
      }),
      // Data rows
      ...categoryScores.map(cs => {
        return new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(cs.category)],
            }),
            new TableCell({
              children: [new Paragraph(cs.score)],
            }),
            new TableCell({
              children: [new Paragraph(cs.weightage.toString())],
            }),
          ],
        });
      }),
    ],
  });
  
  children.push(categoryScoresTable);
  children.push(new PageBreak());
  
  // Implementation Evidence Summary
  children.push(
    new Paragraph({
      text: "Implementation Evidence Summary",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      text: "This section summarizes all implementation evidence required for each parameter.",
      spacing: {
        after: 300,
      },
    })
  );
  
  // Add implementation evidence by category
  Object.keys(paramsByCategory).forEach(category => {
    children.push(
      new Paragraph({
        text: category,
        heading: HeadingLevel.HEADING_2,
      })
    );
    
    paramsByCategory[category].forEach(param => {
      children.push(
        new Paragraph({
          text: `${param.measureId}: ${param.title}`,
          heading: HeadingLevel.HEADING_3,
        }),
        new Paragraph({
          text: param.implementationEvidence || "No evidence details provided.",
          spacing: {
            after: 200,
          },
        })
      );
    });
  });
  
  children.push(new PageBreak());
  
  // Detailed Parameter Assessments
  children.push(
    new Paragraph({
      text: "Detailed Parameter Assessments",
      heading: HeadingLevel.HEADING_1,
    })
  );
  
  // Add category and parameters details
  Object.keys(paramsByCategory).forEach(category => {
    children.push(
      new Paragraph({
        text: category,
        heading: HeadingLevel.HEADING_2,
      })
    );
    
    // Parameter summary table
    const tableRows = [
      // Header row
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph("ID")],
            shading: { fill: "0033CC" },
          }),
          new TableCell({
            children: [new Paragraph("Parameter")],
            shading: { fill: "0033CC" },
          }),
          new TableCell({
            children: [new Paragraph("Score")],
            shading: { fill: "0033CC" },
          }),
          new TableCell({
            children: [new Paragraph("Weightage")],
            shading: { fill: "0033CC" },
          }),
          new TableCell({
            children: [new Paragraph("Weighted Score")],
            shading: { fill: "0033CC" },
          }),
        ],
      }),
    ];
    
    // Add data rows
    paramsByCategory[category].forEach(param => {
      const score = calculateParameterScore(param);
      const weightedScore = calculateWeightedScore(param);
      
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(param.measureId)],
            }),
            new TableCell({
              children: [new Paragraph(param.title)],
            }),
            new TableCell({
              children: [new Paragraph(`${score.toFixed(2)}%`)],
            }),
            new TableCell({
              children: [new Paragraph(`${param.weightage}%`)],
            }),
            new TableCell({
              children: [new Paragraph(weightedScore.toFixed(2))],
            }),
          ],
        })
      );
    });
    
    children.push(new Table({ rows: tableRows }));
    
    // Add detailed parameter information
    paramsByCategory[category].forEach(param => {
      children.push(new PageBreak());
      
      const score = calculateParameterScore(param);
      const status = score >= param.target ? 'Compliant' : 'Non-Compliant';
      
      children.push(
        new Paragraph({
          text: `${param.measureId}: ${param.title}`,
          heading: HeadingLevel.HEADING_3,
        }),
        new Paragraph({
          text: `Score: ${score.toFixed(2)}%  |  Target: ${param.target}%  |  Weightage: ${param.weightage}%`,
        }),
        new Paragraph({
          text: `Status: ${status}  |  Category: ${param.frameworkCategory || 'Uncategorized'}`,
          spacing: {
            after: 300,
          },
        }),
        new Paragraph({
          text: "Description:",
          heading: HeadingLevel.HEADING_4,
        }),
        new Paragraph({
          text: param.description || "No description provided.",
          spacing: {
            after: 200,
          },
        }),
        new Paragraph({
          text: "Formula:",
          heading: HeadingLevel.HEADING_4,
        }),
        new Paragraph({
          text: param.formula || "No formula provided.",
          spacing: {
            after: 200,
          },
        }),
        new Paragraph({
          text: "Implementation Evidence:",
          heading: HeadingLevel.HEADING_4,
        }),
        new Paragraph({
          text: param.implementationEvidence || "No evidence details provided.",
          spacing: {
            after: 200,
          },
        })
      );
    });
  });
  
  // Add Annexure K if provided
  if (annexureKData) {
    children.push(
      new PageBreak(),
      new Paragraph({
        text: "Annexure K - Self Assessment Form",
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: "Entity Information",
        heading: HeadingLevel.HEADING_3,
      }),
      new Paragraph(`Entity Type: ${annexureKData.entityType || 'Not specified'}`),
      new Paragraph(`Entity Category: ${annexureKData.entityCategory || 'Not specified'}`),
      new Paragraph(`Assessment Period: ${annexureKData.period || 'Not specified'}`),
      new Paragraph(`Auditing Organization: ${annexureKData.auditingOrganization || 'Not specified'}`),
      new Paragraph({
        text: "Signatory Information",
        heading: HeadingLevel.HEADING_3,
      }),
      new Paragraph(`Name: ${annexureKData.signatoryName || 'Not specified'}`),
      new Paragraph(`Designation: ${annexureKData.designation || 'Not specified'}`),
      new Paragraph({
        text: "Assessment Summary",
        heading: HeadingLevel.HEADING_3,
      }),
      new Paragraph(`Rationale for self-assessment: ${annexureKData.rationale || 'Not provided'}`)
    );
  }
  
  // Create a new Document with proper typing for sections
  const doc = new Document({
    sections: [{
      properties: {
        type: SectionType.CONTINUOUS
      },
      children: children
    } as ISectionOptions],
    styles: {
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 28,
            bold: true,
            color: "0033CC", // SEBI blue
          },
          paragraph: {
            spacing: {
              after: 120,
            },
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 24,
            bold: true,
            color: "0033CC", // SEBI blue
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 20,
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
      ],
    },
  });
  
  // Generate and save the document
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitizedOrgName = result.organization.replace(/\s+/g, '_');
  const filename = `SEBI_CSCRF_Detailed_Report_${sanitizedOrgName}_${timestamp}.docx`;
  
  // Convert to blob and save
  try {
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, filename);
    console.log(`Word report exported successfully as ${filename}`);
    return Promise.resolve();
  } catch (error) {
    console.error('Error generating Word document:', error);
    return Promise.reject(error);
  }
}; 