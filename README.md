# CCI Calculator

A Next.js application to calculate the Cyber Capability Index (CCI) for cybersecurity assessment.

## About CCI

The Cyber Capability Index (CCI) is an index-framework to rate the preparedness and resilience of the cybersecurity framework of Market Infrastructure Institutions (MIIs) and Qualified REs. This calculator helps organizations assess their cybersecurity maturity level based on 23 parameters with different weightages.

## Features

- Input numerator and denominator values for 23 cybersecurity parameters
- Automatic calculation of self-assessment scores
- Weighted calculation of the overall CCI score
- Determination of the cybersecurity maturity level
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
3. Use the "Reset All Values" button to clear all inputs and start over.

## Maturity Levels

- **Exceptional Cybersecurity Maturity**: 91-100
- **Optimal Cybersecurity Maturity**: 81-90
- **Manageable Cybersecurity Maturity**: 71-80
- **Developing Cybersecurity Maturity**: 61-70
- **Bare Minimum Cybersecurity Maturity**: 51-60
- **Fail**: 50 or below

## License

[MIT](LICENSE) 