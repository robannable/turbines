# Wind Turbine Propeller Designer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)](https://tailwindcss.com/)
[![FreeCAD](https://img.shields.io/badge/FreeCAD-0.20-orange)](https://www.freecadweb.org/)

**Design custom wind turbine blades for DIY renewable energy projects.**

This toolkit helps you create efficient wind turbine propellers matched to your generator and environment. Whether you're building a backyard wind turbine or a small-scale renewable energy system, this tool calculates the optimal blade dimensions and generates 3D models ready for manufacturing.

## What Does This Do?

This project provides two integrated tools:
1. **Web Calculator** - Calculate optimal blade dimensions based on your generator specifications
2. **3D Model Generator** - Create accurate 3D models for fabrication (CNC, 3D printing, hand carving)

Created using Hugh Piggott's renowned BASIC program from "Scrapyard Windpower Realities" - a trusted resource in the DIY wind energy community for over 30 years.

## Features

### Web Application (Main Tool)
- **Match Your Generator**: Enter your generator's specs (power rating, RPM) and get optimal blade dimensions
- **Custom Sizing**: Design blades for a specific diameter
- **Safety Warnings**: Real-time alerts for dangerous configurations (excessive tip speed, erosion risk)
- **Detailed Measurements**: Get dimensions for each section of the blade (stations)
- **Visual Preview**: See 2D cross-sections and 3D animations of your design
- **Export Options**: Download designs for OpenSCAD (3D printing) or FreeCAD (professional modeling)

### FreeCAD 3D Model Generator (Advanced Users)
- **Accurate 3D Models**: Generate blades using the industry-standard NACA 4412 airfoil shape
- **Hub Connections**: Automatically creates mounting points for attaching blades to your turbine hub
- **Multiple Export Formats**: Save as STL (for 3D printing), STEP (for CAD/CAM), and other professional formats
- **Local Processing**: Runs entirely on your computer - no cloud upload required
- **FreeCAD Macro**: Works with the free, open-source FreeCAD software

## Demo

[Live Demo](https://robannable.github.io/turbines/) - Try the web calculator right now, no installation required!

## Quick Start for Non-Technical Users

**Just want to design a blade? Use the live demo above!**

1. Visit the [Live Demo](https://robannable.github.io/turbines/)
2. Choose "Match Generator" if you know your generator specs, or "Choose Diameter" if you want a specific size
3. Enter your parameters (don't worry - the tool will warn you if something is unsafe)
4. Review the results and download your blade design

**What you'll need to know:**
- **Generator Power** (watts): Found on your generator's label or specs (e.g., 500W, 1000W)
- **Generator RPM**: How fast the shaft spins at rated power (e.g., 300 RPM, 500 RPM)
- **Number of Blades**: Usually 2 or 3 for small wind turbines
- **Tip Speed Ratio (TSR)**: 5-7 is typical for beginners (lower = more torque, higher = more speed)

## Getting Started (Developers & Advanced Users)

### Prerequisites

**For Web Application Development:**
- Node.js 16.0 or higher (JavaScript runtime)
- npm 7.0 or higher (package manager, comes with Node.js)

**For FreeCAD 3D Modeling:**
- FreeCAD 0.20 or higher (free 3D modeling software) - [Download here](https://www.freecadweb.org/)
- Node.js and npm (as above)

### Web Application Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/robannable/turbines.git
   cd turbines
   ```

2. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

The web application will be running locally on your machine.

### Local FreeCAD Integration Setup

1. From the turbines directory, navigate to the FreeCAD subdirectory:
   ```bash
   cd FreeCAD
   ```

2. Install dependencies and start the local server:
   ```bash
   npm install
   npm run dev
   ```

3. Open your browser and navigate to the local development URL (default: `http://localhost:5174`)

4. Generate and use the FreeCAD macro:
   - Use the web interface to input your blade parameters
   - Click "Generate Macro" to download the `.FCMacro` file
   - Open FreeCAD software on your computer
   - Go to **Macro → Macros...** menu
   - Click "User macros" tab
   - Click "Create" or navigate to your downloaded macro file
   - Select the macro and click "Execute"
   - Your 3D blade model will be generated in FreeCAD

## Usage

### Web Application Workflow

**Option 1: Match to Your Generator** (Recommended for beginners)
1. Select "Find Best Diameter to Match Generator"
2. Enter your generator's rated power in watts (e.g., 500)
3. Enter your generator's rated RPM (e.g., 400)
4. Enter gear ratio (use 1 if directly connected to generator shaft)
5. Enter number of blades (2 or 3 recommended)
6. Enter tip speed ratio (try 6 as a starting point)
7. Review results: diameter, rated wind speed, torque, and safety warnings
8. View the blade station measurements for fabrication
9. Download OpenSCAD or FreeCAD export files

**Option 2: Choose Your Own Diameter**
1. Select "Choose Your Own Diameter"
2. Enter desired diameter in meters
3. Enter number of blades and tip speed ratio
4. Follow steps 7-9 above

### FreeCAD 3D Modeling Workflow
1. Design your blade using the web application first
2. Navigate to the FreeCAD integration (local or via the main app)
3. Enter your blade parameters
4. Generate and download the macro file
5. Open FreeCAD and run the macro
6. The 3D model will be created automatically
7. Export to STL for 3D printing or STEP for CNC machining

## Project Structure

```
turbines/
├── src/                     # Main web application source
│   ├── components/          # React UI components
│   │   ├── TurbineAnimation.tsx
│   │   ├── BladeVisualization.tsx
│   │   └── OpenScadExport.tsx
│   ├── pages/              # Application pages
│   │   └── freecad/        # FreeCAD generator page
│   ├── utils/              # Calculation logic
│   │   └── calculations.ts # Core blade math
│   ├── App.tsx             # Main application
│   └── main.tsx            # Entry point
│
├── FreeCAD/                # Standalone FreeCAD integration
│   ├── src/                # FreeCAD-specific code
│   ├── index.html          # FreeCAD interface
│   └── package.json        # Separate dependencies
│
├── public/                 # Static assets
├── package.json            # Main app dependencies
└── README.md               # This file
```

## Glossary of Terms

**For Non-Technical Users:**

- **Tip Speed Ratio (TSR)**: How fast the blade tips move compared to the wind speed. Higher TSR = faster spinning, more electrical output. Lower TSR = more torque, better starting in light winds. Typical range: 5-8.

- **NACA 4412 Airfoil**: A wing-shaped cross-section design used by aircraft. The numbers describe the curve shape. This specific design is excellent for wind turbines because it's efficient and well-tested.

- **Station**: A specific point along the blade length where measurements are taken. Think of it like measuring your blade at 10%, 20%, 30% of its length - each is a "station."

- **Chord**: The width of the blade at any given station (from leading edge to trailing edge).

- **Setting Angle**: The twist angle of the blade at each station. Blades are twisted so that each section meets the wind at the optimal angle.

- **RPM (Revolutions Per Minute)**: How many complete spins the generator shaft makes in one minute.

- **Rated Power**: The maximum power (in watts) your generator can produce continuously without overheating.

- **Gear Ratio**: If your turbine uses gears between the blades and generator. Direct drive = 1 (no gears).

- **Macro**: A script/program that automates tasks in FreeCAD. Our macro automatically builds your blade model.

- **STL File**: A 3D file format used for 3D printing. Contains the shape as a mesh of triangles.

- **STEP File**: A professional CAD file format used for manufacturing (CNC machining, engineering).

- **OpenSCAD**: Free software that creates 3D models from code/text commands rather than mouse clicking.

## Troubleshooting

**"That's ambitious!" warning**
- Your Tip Speed Ratio is very high (>15). The blades will spin very fast but may be difficult to control.
- Solution: Try a lower TSR (6-8 range is safer for beginners)

**"Too many blades?" warning**
- The combination of high TSR and many blades creates too much drag
- Solution: Use fewer blades (2-3) or lower your TSR

**"High tip speed - BEWARE EROSION" warning**
- Your blade tips will move faster than 90 m/s (200 mph), risking damage from rain, dust, and insects
- Solution: Reduce diameter, reduce RPM, or use direct drive instead of gearing up

**"Try some gearing" message**
- Your turbine will spin too slowly for your generator to work efficiently
- Solution: Add a gear box to increase generator RPM, or choose a lower-RPM generator

**FreeCAD macro doesn't run**
- Ensure you're using FreeCAD 0.20 or higher
- Check that the macro file downloaded completely (should be a .FCMacro file)
- Try copying the macro code and creating a new macro manually in FreeCAD

**Model looks wrong in FreeCAD**
- Verify your input parameters are in the correct units (meters, not feet)
- Check that number of stations is reasonable (6-10 is typical)
- Ensure chord and thickness values are reasonable for your diameter

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