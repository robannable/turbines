# Wind Turbine Propeller Designer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)](https://tailwindcss.com/)
[![FreeCAD](https://img.shields.io/badge/FreeCAD-0.20-orange)](https://www.freecadweb.org/)

A comprehensive tool suite for designing wind turbine propellers, consisting of:
1. A modern web application for calculating optimal propeller dimensions
2. A local FreeCAD integration for generating 3D models

Created with an agentic LLM using "A BASIC COMPUTER PROGRAM to help you design windmill rotor blades - Extract from 'Scrapyard Windpower Realities' by Hugh Piggott"

## Project Components

### 1. Web Application (`/turbine-designer`)
- Calculate propeller dimensions based on generator specifications
- Design propellers with custom diameters
- Real-time validation and warnings
- Detailed station-by-station measurements
- Interactive user interface with 2D/3D visualizations
- OpenSCAD export for 3D printing
- Responsive design

### 2. FreeCAD Integration (`/FreeCAD`) - Local Development Only
- Generate accurate 3D models of turbine blades
- NACA 4412 airfoil profile implementation
- Automatic hub connection generation
- Export to various 3D formats (STL, STEP, etc.)
- Compatible with FreeCAD's Python environment
- Runs locally on your machine

## Demo

[Live Demo](https://robannable.github.io/turbines/) - Web Application Only

## Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm 7.0 or higher
- FreeCAD 0.20 or higher (for local 3D modeling)

### Web Application Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/robannable/turbines.git
   cd turbines/turbine-designer
   ```

2. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Local FreeCAD Integration Setup

1. Navigate to the FreeCAD directory:
   ```bash
   cd turbines/FreeCAD
   ```

2. Install dependencies and start the local server:
   ```bash
   npm install
   npm run dev
   ```

3. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

4. Generate your macro and use it with FreeCAD:
   - Use the web interface to generate the macro
   - Open FreeCAD
   - Navigate to the Macro menu
   - Load the generated `.FCMacro` file
   - Run the macro to create your 3D model

## Usage

### Web Application
1. Choose your calculation mode (Match Generator or Choose Diameter)
2. Enter the required parameters
3. Review the results and visualizations
4. Export to OpenSCAD or FreeCAD format

### Local FreeCAD Integration
1. Start the local FreeCAD interface
2. Generate the macro file using the interface
3. Open in FreeCAD
4. Run the macro to create the 3D model
5. Export to your preferred 3D format (STL, STEP, etc.)

## Project Structure

```
turbines/
├── turbine-designer/     # Web application
│   ├── src/             # Source code
│   │   ├── components/  # React components
│   │   └── utils/       # Utility functions
│   └── package.json     # Dependencies
│
├── FreeCAD/             # FreeCAD integration
│   └── src/             # FreeCAD macro generation
│       └── main.js      # Macro template
│
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Hugh Piggott's "Scrapyard Windpower Realities" for the original BASIC program
- [NACA Airfoil Series](https://en.wikipedia.org/wiki/NACA_airfoil) for airfoil data
- [OpenSCAD](https://openscad.org/) for 3D model generation
- [FreeCAD](https://www.freecadweb.org/) for 3D modeling capabilities