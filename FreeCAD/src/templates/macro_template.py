import FreeCAD as App
import Part
import Draft
import math

def createAirfoilSection(chord, angle, radius, thickness):
    """Create a NACA 4412 airfoil section"""
    # NACA 4412 coordinates (normalized)
    points = []
    for t in range(101):
        t = t / 100.0
        # Upper surface
        if t < 1.0:
            x = t
            y = (0.12/0.2) * (0.2969*math.sqrt(t) - 0.126*t - 0.3516*t**2 + 0.2843*t**3 - 0.1015*t**4)
            points.append((x, y))
    
    # Lower surface
    for t in reversed(range(101)):
        t = t / 100.0
        if t > 0.0:
            x = t
            y = -(0.12/0.2) * (0.2969*math.sqrt(t) - 0.126*t - 0.3516*t**2 + 0.2843*t**3 - 0.1015*t**4)
            points.append((x, y))
    
    # Scale and rotate points
    scaled_points = []
    for x, y in points:
        # Scale by chord length and thickness
        scaled_x = x * chord
        scaled_y = y * chord * thickness
        
        # Rotate by angle
        angle_rad = math.radians(angle)
        rot_x = scaled_x * math.cos(angle_rad) - scaled_y * math.sin(angle_rad)
        rot_y = scaled_x * math.sin(angle_rad) + scaled_y * math.cos(angle_rad)
        
        # Position at radius
        scaled_points.append(App.Vector(rot_x, rot_y, radius))
    
    # Create a wire from points
    wire = Part.makePolygon(scaled_points + [scaled_points[0]])
    return wire

def createHub(root_radius, hub_length=100):
    """Create a hub connection for the blade"""
    # Create a cylinder for the hub connection
    hub_radius = root_radius * 0.2  # 20% of root radius for hub connection
    hub = Part.makeCylinder(hub_radius, hub_length, App.Vector(0,0,0))
    return hub

def createBlade(stations):
    """Create the complete blade from station data"""
    # Create airfoil sections at each station
    sections = []
    for station in stations:
        section = createAirfoilSection(
            station['chord'],
            station['setting'],
            station['radius'],
            station['thickness']
        )
        sections.append(section)
    
    # Create loft through all sections
    loft = Part.makeLoft(sections, True, False)  # solid=True, ruled=False
    
    # Create hub connection
    root_radius = stations[0]['radius']
    hub = createHub(root_radius)
    
    # Create the final shape
    blade = App.ActiveDocument.addObject("Part::Feature", "TurbineBlade")
    blade.Shape = loft.fuse(hub)  # Fuse blade with hub
    
    App.ActiveDocument.recompute()
    return blade

# Create a new document
doc = App.newDocument("TurbineBlade")

# Create the blade using the provided stations data
blade = createBlade(stations)

# Set view
App.ActiveDocument.recompute()
Gui.SendMsgToActiveView("ViewFit")
Gui.activeDocument().activeView().viewAxonometric() 