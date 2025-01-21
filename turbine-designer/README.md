# Wind Turbine Propeller Designer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)](https://tailwindcss.com/)

A modern web application for designing wind turbine propellers. This tool helps you calculate optimal propeller dimensions based on your generator specifications or desired diameter.

Created with an agentic LLM using "A BASIC COMPUTER PROGRAM to help you design windmill rotor blades - Extract from 'Scrapyard Windpower Realities' by Hugh Piggott"

## Features

- Calculate propeller dimensions based on generator specifications
- Design propellers with custom diameters
- Real-time validation and warnings
- Detailed station-by-station measurements
- Interactive user interface with 2D/3D visualizations
- OpenSCAD export for 3D printing
- Responsive design

## Demo

[Live Demo](https://robannable.github.io/turbines/) (Coming soon)

## Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm 7.0 or higher

### Quick Start (Windows)

Run the `setup.bat` file included in the project, or follow the manual installation steps below.

### Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/robannable/turbines.git
   cd turbines/turbine-designer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Choose your calculation mode:
   - **Match Generator**: Calculate optimal diameter based on generator specifications
   - **Choose Diameter**: Design a propeller for a specific diameter

2. Enter the required parameters:
   - Tip Speed Ratio (TSR)
   - Number of Blades
   - Generator Power (if matching generator)
   - Generator RPM (if matching generator)
   - Gear Ratio (if matching generator)
   - Diameter (if choosing diameter)
   - Number of Stations

3. Click "Calculate Design" to generate the propeller specifications

4. Review the results:
   - Overall dimensions
   - Warnings and recommendations
   - Detailed station measurements
   - 2D blade profile visualization
   - Animated turbine preview
   - OpenSCAD export for 3D printing

## Development

### Tech Stack

- React 18.2
- TypeScript 5.2
- Vite 5.0
- Tailwind CSS 3.4
- Math.js
- OpenSCAD integration

### Project Structure

```
turbine-designer/
├── public/               # Static assets
│   ├── components/      # React components
│   │   ├── BladeVisualization.tsx
│   │   ├── TurbineAnimation.tsx
│   │   └── OpenScadExport.tsx
│   ├── utils/          # Utility functions
│   │   └── calculations.ts
│   ├── App.tsx         # Main application
│   └── main.tsx        # Entry point
├── setup.bat           # Windows setup script
└── package.json        # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

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