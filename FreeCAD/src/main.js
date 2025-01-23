class TurbineDesigner {
    constructor() {
        this.form = document.getElementById('turbineForm');
        this.warnings = document.getElementById('warnings');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Toggle between generator and custom diameter inputs
        document.querySelectorAll('input[name="designMethod"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('generatorInputs').style.display = 
                    e.target.value === 'generator' ? 'block' : 'none';
                document.getElementById('diameterInput').style.display = 
                    e.target.value === 'custom' ? 'block' : 'none';
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateMacro();
        });
    }

    validateInputs() {
        const tsr = parseFloat(document.getElementById('tipSpeedRatio').value);
        const blades = parseInt(document.getElementById('bladeCount').value);
        
        let warnings = [];
        
        if (tsr > 15) {
            warnings.push("That's ambitious!");
        }
        if (tsr * blades > 24) {
            warnings.push("Too many blades?");
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
        // Create the macro content (template will be shown in next step)
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
    """Create a NACA 4412 airfoil section"""
    # NACA 4412 coordinates (normalized)
    points = []
    
    # Generate upper surface points
    for t in range(101):
        t = t / 100.0
        if t <= 1.0:
            x = t
            y = (0.12/0.2) * (0.2969*math.sqrt(x) - 0.126*x - 0.3516*x**2 + 0.2843*x**3 - 0.1015*x**4)
            points.append((x, y))
    
    # Generate lower surface points
    for t in range(100, -1, -1):
        t = t / 100.0
        if t >= 0.0:
            x = t
            y = -(0.12/0.2) * (0.2969*math.sqrt(x) - 0.126*x - 0.3516*x**2 + 0.2843*x**3 - 0.1015*x**4)
            points.append((x, y))
    
    # Scale and rotate points
    scaled_points = []
    for x, y in points:
        # Scale by chord length
        scaled_x = x * chord
        scaled_y = y * chord * thickness  # Only scale y by thickness
        
        # Rotate by angle
        angle_rad = math.radians(angle)
        rot_x = scaled_x * math.cos(angle_rad) - scaled_y * math.sin(angle_rad)
        rot_y = scaled_x * math.sin(angle_rad) + scaled_y * math.cos(angle_rad)
        
        # Position at radius
        scaled_points.append(App.Vector(rot_x, rot_y, radius))
    
    # Create a wire from points
    try:
        wire = Part.makePolygon(scaled_points + [scaled_points[0]])
        face = Part.Face(wire)  # Test if we can create a face
        return wire
    except:
        # If face creation fails, try to create a simpler profile
        simple_points = scaled_points[::5]  # Take every 5th point to simplify
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
document.addEventListener('DOMContentLoaded', () => {
    new TurbineDesigner();
}); 