# CCI Calculator for SEBI CSCRF Compliance

A Next.js application to calculate the Cyber Capability Index (CCI) for cybersecurity assessment in alignment with the Securities and Exchange Board of India (SEBI) Cyber Security and Cyber Resilience Framework (CSCRF).

## About CCI

The Cyber Capability Index (CCI) is an index-framework to rate the preparedness and resilience of the cybersecurity framework of Market Infrastructure Institutions (MIIs) and Qualified Regulated Entities (REs) in accordance with SEBI's guidelines. This calculator helps organizations assess their cybersecurity maturity level based on 23 parameters with different weightages that align with SEBI CSCRF requirements.

## SEBI CSCRF Overview

The SEBI CSCRF establishes cybersecurity requirements for Indian financial market participants. It covers key areas including:

- Governance and organizational structure
- Risk assessment and management
- Access controls and cyber resilience
- Security operations and monitoring
- Incident response and recovery
- Regular audits and compliance reporting

The CCI calculator helps entities measure their compliance with these requirements through quantifiable metrics.

## Features

- Input numerator and denominator values for 23 cybersecurity parameters
- Automatic calculation of self-assessment scores
- Weighted calculation of the overall CCI score
- Determination of the cybersecurity maturity level in line with SEBI expectations
- Comprehensive reporting to assist with bi-annual compliance audits
- Responsive design that works on all devices

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cci-calculator.git
   cd cci-calculator
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Enter the numerator and denominator values for each parameter according to the formulas provided.
2. Click the "Calculate CCI" button to see your organization's CCI score and maturity level.
3. Review detailed parameter-specific insights and improvement recommendations.
4. Use the generated reports for internal assessments and regulatory submissions.
5. Use the "Reset All Values" button to clear all inputs and start over.

## Maturity Levels

- **Exceptional Cybersecurity Maturity**: 91-100 - Exceeds SEBI requirements with advanced capabilities
- **Optimal Cybersecurity Maturity**: 81-90 - Fully compliant with robust implementation
- **Manageable Cybersecurity Maturity**: 71-80 - Generally compliant with some areas for improvement
- **Developing Cybersecurity Maturity**: 61-70 - Partially compliant with significant gaps
- **Bare Minimum Cybersecurity Maturity**: 51-60 - Minimal compliance with critical gaps
- **Fail**: 50 or below - Non-compliant, requires immediate remediation

## Compliance Benefits

This tool helps organizations:
- Prepare for CERT-In empanelled auditor assessments
- Document cybersecurity capabilities for SEBI reporting
- Identify improvement areas to enhance cyber resilience
- Track progress over time against regulatory expectations

## License

[MIT](LICENSE) 