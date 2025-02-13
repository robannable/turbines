import { StationMeasurements } from '../utils/calculations';

interface OpenScadExportProps {
  stations: StationMeasurements[];
  diameter: number;
}

function generateOpenScadCode(stations: StationMeasurements[], diameter: number): string {
  // Generate hull operations between adjacent stations
  const connections = stations.slice(0, -1).map((_, index) => `
    // Connect stations ${index + 1} and ${index + 2}
    hull() {
      // Station ${index + 1}
      translate([${stations[index].radius * 1000}, 0, 0])
      rotate([${stations[index].setting}, 0, 0])  // Changed rotation axis
      linear_extrude(height=${stations[index].width * 1000}, center=true)
      scale([${stations[index].chord * 1000}, ${stations[index].thickness * 1000}, 1])
      translate([-0.5, 0, 0])  // Center the airfoil
      airfoil();

      // Station ${index + 2}
      translate([${stations[index + 1].radius * 1000}, 0, 0])
      rotate([${stations[index + 1].setting}, 0, 0])  // Changed rotation axis
      linear_extrude(height=${stations[index + 1].width * 1000}, center=true)
      scale([${stations[index + 1].chord * 1000}, ${stations[index + 1].thickness * 1000}, 1])
      translate([-0.5, 0, 0])  // Center the airfoil
      airfoil();
    }`).join('\n');

  return `// Wind Turbine Blade OpenSCAD Model
// Generated by Wind Turbine Propeller Designer
// Dimensions in millimeters

// NACA 4412 airfoil profile (normalized coordinates)
module airfoil() {
    polygon(points=[
        [0, 0],
        [0.02, 0.0223],
        [0.05, 0.0352],
        [0.1, 0.0491],
        [0.2, 0.0684],
        [0.3, 0.0789],
        [0.4, 0.0829],
        [0.5, 0.0799],
        [0.6, 0.0699],
        [0.7, 0.0545],
        [0.8, 0.0357],
        [0.9, 0.0167],
        [0.95, 0.0077],
        [1, 0],
        [0.95, -0.0053],
        [0.9, -0.0097],
        [0.8, -0.0157],
        [0.7, -0.0187],
        [0.6, -0.0187],
        [0.5, -0.0167],
        [0.4, -0.0127],
        [0.3, -0.0087],
        [0.2, -0.0047],
        [0.1, -0.0017],
        [0.05, -0.0007],
        [0.02, -0.0003],
        [0, 0]
    ]);
}

// Hub connection module
module hub_mount() {
    union() {
        // Base cylinder
        cylinder(h=50, r1=30, r2=25, center=true);
        
        // Transition to first airfoil
        hull() {
            translate([0, 0, 0])
            cylinder(h=${stations[0].width * 1000}, r=25, center=true);
            
            translate([${stations[0].radius * 1000}, 0, 0])
            rotate([${stations[0].setting}, 0, 0])
            linear_extrude(height=${stations[0].width * 1000}, center=true)
            scale([${stations[0].chord * 1000}, ${stations[0].thickness * 1000}, 1])
            translate([-0.5, 0, 0])
            airfoil();
        }
    }
}

// Main blade assembly
module blade() {
    // Rotate the entire blade to match visualization orientation
    rotate([0, 90, 0])
    union() {
        // Hub mount
        hub_mount();
        
        // Blade sections and connections
        ${connections}
    }
}

// Generate the blade
blade();

/* 
Printing Instructions:
1. Orient the blade vertically (along Z-axis) for best layer adhesion
2. Use supports for overhanging sections
3. Recommended infill: 20-30%
4. Layer height: 0.2mm or less for better surface finish
5. Consider splitting the blade into sections for larger prints

Blade Specifications:
- Total blade length: ${(diameter/2 * 1000).toFixed(1)}mm
- Number of stations: ${stations.length}
- Root chord: ${(stations[0].chord * 1000).toFixed(1)}mm
- Tip chord: ${(stations[stations.length-1].chord * 1000).toFixed(1)}mm
- Root angle: ${stations[0].setting.toFixed(1)}°
- Tip angle: ${stations[stations.length-1].setting.toFixed(1)}°
*/

// To create multiple blades, uncomment and modify:
/*
module complete_turbine() {
    for(i = [0:${360/stations.length}:359]) {
        rotate([0, 0, i])
        blade();
    }
}
complete_turbine();
*/
`;
}

export function OpenScadExport({ stations, diameter }: OpenScadExportProps) {
  const openScadCode = generateOpenScadCode(stations, diameter);
  
  const handleDownload = () => {
    const blob = new Blob([openScadCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wind_turbine_blade.scad';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">OpenSCAD Export</h2>
        <button
          onClick={handleDownload}
          className="btn-primary"
        >
          Download OpenSCAD File
        </button>
      </div>
      <div className="mt-4">
        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{openScadCode}</code>
        </pre>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-medium mb-2">3D Printing Tips:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Print vertically for better layer adhesion</li>
          <li>Enable supports for overhanging sections</li>
          <li>Use 20-30% infill for structural integrity</li>
          <li>Layer height: 0.2mm or less for better surface finish</li>
          <li>Consider PETG or ABS for outdoor durability</li>
          <li>For large blades, consider printing in sections</li>
        </ul>
      </div>
    </div>
  );
} 