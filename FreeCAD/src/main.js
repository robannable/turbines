console.log('Script loaded');

class TurbineDesigner {
    constructor() {
        console.log('TurbineDesigner initializing');
        this.form = document.getElementById('turbineForm');
        this.warnings = document.getElementById('warnings');
        console.log('Form element:', this.form);
        console.log('Warnings element:', this.warnings);
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        // Toggle between generator and custom diameter inputs
        const radioButtons = document.querySelectorAll('input[name="designMethod"]');
        console.log('Radio buttons:', radioButtons);
        
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                console.log('Radio button changed:', e.target.value);
                const generatorInputs = document.getElementById('generatorInputs');
                const diameterInput = document.getElementById('diameterInput');
                
                if (e.target.value === 'generator') {
                    generatorInputs.style.display = 'block';
                    diameterInput.style.display = 'none';
                } else {
                    generatorInputs.style.display = 'none';
                    diameterInput.style.display = 'block';
                }
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            console.log('Form submitted');
            e.preventDefault();
            this.generateMacro();
        });
    }

    validateInputs() {
        const tsr = parseFloat(document.getElementById('tipSpeedRatio').value);
        const blades = parseInt(document.getElementById('bladeCount').value);
        
        let warnings = [];
        
        if (tsr > 15) {
            warnings.push("High tip speed ratio - this might affect efficiency");
        }
        if (tsr * blades > 24) {
            warnings.push("High solidity - consider reducing blade count or tip speed ratio");
        }

        return warnings;
    }

    calculateDiameter(power, rpm, gearRatio) {
        rpm = rpm / gearRatio;
        const tsr = parseFloat(document.getElementById('tipSpeedRatio').value);
        return Math.pow(power * Math.pow(47 * tsr / rpm, 3), 0.2);
    }

    generateStationData(diameter, stations) {
        const tsr = parseFloat(document.getElementById('tipSpeedRatio').value);
        const blades = parseInt(document.getElementById('bladeCount').value);
        let data = [];

        for (let x = 1; x <= stations; x++) {
            const r = diameter / 2 / stations * x;
            const flo = Math.atan(diameter / 3 / tsr / r);
            const ch = 1.7 * Math.pow(diameter, 2) / blades / r / Math.pow(tsr, 2) * Math.pow(Math.cos(flo), 2);
            const wd = ch * Math.cos(flo - 3/57);
            const dp = ch * Math.sin(flo - 3/57);
            const th = ch / (5 + x * 3/stations);

            data.push({
                radius: r,
                setting: 57 * flo - 3,
                chord: ch,
                width: wd,
                drop: dp,
                thickness: th
            });
        }

        return data;
    }

    generateMacro() {
        const warnings = this.validateInputs();
        this.warnings.innerHTML = warnings.join('<br>');

        let diameter;
        if (document.querySelector('input[name="designMethod"]:checked').value === 'generator') {
            const power = parseFloat(document.getElementById('power').value);
            const rpm = parseFloat(document.getElementById('rpm').value);
            const gearRatio = parseFloat(document.getElementById('gearRatio').value);
            diameter = this.calculateDiameter(power, rpm, gearRatio);
        } else {
            diameter = parseFloat(document.getElementById('diameter').value);
        }

        const stations = parseInt(document.getElementById('stations').value);
        const stationData = this.generateStationData(diameter, stations);
        
        // Generate and download the FreeCAD macro
        this.createAndDownloadMacro(stationData);
    }

    createAndDownloadMacro(stationData) {
        // Create the macro content
        const macroContent = this.generateMacroContent(stationData);
        
        // Create and trigger download
        const blob = new Blob([macroContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TurbineBlade.FCMacro';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    generateMacroContent(stationData) {
        return `import FreeCAD as App
import Part
import Draft
import math

def createAirfoilSection(chord, angle, radius, thickness):
    """Create a NACA 4412 airfoil section with proper camber and thickness

    NACA 4412 means:
    - 4: Maximum camber is 4% of chord
    - 4: Maximum camber location at 40% of chord (0.4c)
    - 12: Maximum thickness is 12% of chord
    """
    # NACA 4412 parameters
    m = 0.04  # Maximum camber (4%)
    p = 0.4   # Location of maximum camber (40% chord)
    t_max = 0.12  # Maximum thickness (12%)

    # Calculate thickness ratio from station thickness
    # Station thickness is absolute value in meters, convert to ratio
    thickness_ratio = thickness / chord if chord > 0 else t_max
    # Ensure we don't exceed reasonable bounds
    thickness_ratio = min(thickness_ratio, 0.25)  # Cap at 25%
    thickness_ratio = max(thickness_ratio, 0.08)  # Minimum 8%

    points = []

    # Generate points along chord (more points near leading edge for accuracy)
    x_coords = []
    for i in range(51):  # 0 to 50
        beta = (i / 50.0) * math.pi
        x = (1 - math.cos(beta)) / 2  # Cosine spacing for better leading edge resolution
        x_coords.append(x)

    # Calculate upper and lower surface points
    upper_points = []
    lower_points = []

    for x in x_coords:
        # Calculate mean camber line
        if x < p:
            yc = (m / (p ** 2)) * (2 * p * x - x ** 2)
            dyc_dx = (2 * m / (p ** 2)) * (p - x)
        else:
            yc = (m / ((1 - p) ** 2)) * ((1 - 2 * p) + 2 * p * x - x ** 2)
            dyc_dx = (2 * m / ((1 - p) ** 2)) * (p - x)

        # Calculate thickness distribution (NACA 4-digit formula)
        yt = 5 * thickness_ratio * (
            0.2969 * math.sqrt(x) -
            0.1260 * x -
            0.3516 * x ** 2 +
            0.2843 * x ** 3 -
            0.1015 * x ** 4  # Changed from -0.1036 for closed trailing edge
        )

        # Calculate angle of camber line
        theta = math.atan(dyc_dx)

        # Upper surface point
        xu = x - yt * math.sin(theta)
        yu = yc + yt * math.cos(theta)
        upper_points.append((xu, yu))

        # Lower surface point
        xl = x + yt * math.sin(theta)
        yl = yc - yt * math.cos(theta)
        lower_points.append((xl, yl))

    # Combine upper and lower surfaces (upper forward, lower backward for closed curve)
    upper_points.reverse()  # Start from trailing edge
    combined_points = upper_points + lower_points[1:]  # Skip duplicate trailing edge point

    # Scale, rotate, and position points
    scaled_points = []
    for x, y in combined_points:
        # Scale by chord length
        scaled_x = x * chord
        scaled_y = y * chord

        # Rotate by angle (pitch angle of blade)
        angle_rad = math.radians(angle)
        rot_x = scaled_x * math.cos(angle_rad) - scaled_y * math.sin(angle_rad)
        rot_y = scaled_x * math.sin(angle_rad) + scaled_y * math.cos(angle_rad)

        # Position at radius along blade span
        scaled_points.append(App.Vector(rot_x, rot_y, radius))

    # Create a wire from points
    try:
        wire = Part.makePolygon(scaled_points + [scaled_points[0]])
        # Verify we can create a face (closed curve test)
        face = Part.Face(wire)
        return wire
    except Exception as e:
        print(f"Warning: Complex airfoil failed, using simplified version: {str(e)}")
        # If face creation fails, simplify by taking fewer points
        simple_points = scaled_points[::3]  # Take every 3rd point
        return Part.makePolygon(simple_points + [simple_points[0]])

def createHub(root_radius, hub_length=None):
    """Create a hub connection for the blade"""
    if hub_length is None:
        hub_length = root_radius * 0.3  # 30% of root radius for hub length
    
    hub_radius = root_radius * 0.1  # 10% of root radius for hub connection
    hub = Part.makeCylinder(hub_radius, hub_length, App.Vector(0,0,0))
    return hub

def createBlade(stations):
    """Create the complete blade from station data"""
    # Create airfoil sections at each station
    sections = []
    for station in stations:
        try:
            section = createAirfoilSection(
                station['chord'],
                station['setting'],
                station['radius'],
                station['thickness']
            )
            sections.append(section)
        except Exception as e:
            print(f"Error creating section at radius {station['radius']}: {str(e)}")
    
    if not sections:
        raise Exception("No valid sections created")
    
    try:
        # Create loft through all sections
        loft = Part.makeLoft(sections, True)  # solid=True
        
        # Create hub connection
        root_radius = stations[0]['radius']
        hub = createHub(root_radius)
        
        # Create the final shape
        blade = App.ActiveDocument.addObject("Part::Feature", "TurbineBlade")
        blade.Shape = loft.fuse(hub)
        
        App.ActiveDocument.recompute()
        return blade
    except Exception as e:
        print(f"Error creating blade: {str(e)}")
        raise

# Station Data
stations = ${JSON.stringify(stationData, null, 2)}

# Create a new document
doc = App.newDocument("TurbineBlade")

# Create the blade using the provided stations data
blade = createBlade(stations)

# Set view
App.ActiveDocument.recompute()
Gui.SendMsgToActiveView("ViewFit")
Gui.activeDocument().activeView().viewAxonometric()`;
    }
}

// Initialize the designer when the page loads
console.log('Setting up DOMContentLoaded listener');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    window.turbineDesigner = new TurbineDesigner();
}); 