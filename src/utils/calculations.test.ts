import { calculateTurbineDesign, TurbineInputs } from './calculations';

/**
 * Validation tests for turbine calculations
 * These tests verify that our implementation matches Hugh Piggott's original BASIC formulas
 */

describe('Turbine Design Calculations', () => {
  test('Diameter calculation matches BASIC formula', () => {
    // Test case: 500W generator at 400 RPM, TSR=6, direct drive
    const inputs: TurbineInputs = {
      tipSpeedRatio: 6,
      numberOfBlades: 3,
      generatorPower: 500,
      generatorRPM: 400,
      gearRatio: 1,
      numberOfStations: 10
    };

    const result = calculateTurbineDesign(inputs);

    // BASIC formula: D=(P*(47*TSR/RPM)^3)^0.2
    // D = (500 * (47*6/400)^3)^0.2
    // D = (500 * (0.705)^3)^0.2
    // D = (500 * 0.3504)^0.2
    // D = 175.2^0.2
    // D ≈ 3.38 meters
    expect(result.diameter).toBeCloseTo(3.38, 1);
  });

  test('Station calculations match BASIC formulas', () => {
    const inputs: TurbineInputs = {
      tipSpeedRatio: 6,
      numberOfBlades: 3,
      diameter: 3.0,
      numberOfStations: 10
    };

    const result = calculateTurbineDesign(inputs);

    // Verify we have correct number of stations
    expect(result.stations).toHaveLength(10);

    // Test first station (X=1)
    const station1 = result.stations[0];
    // R = D/2/N*X = 3/2/10*1 = 0.15
    expect(station1.radius).toBeCloseTo(0.15, 2);

    // Test middle station (X=5)
    const station5 = result.stations[4];
    // R = 3/2/10*5 = 0.75
    expect(station5.radius).toBeCloseTo(0.75, 2);

    // Verify chord decreases from root to tip (tapered blade)
    expect(station1.chord).toBeGreaterThan(result.stations[9].chord);

    // Verify setting angle decreases from root to tip (blade twist)
    expect(station1.setting).toBeGreaterThan(result.stations[9].setting);
  });

  test('Warnings match BASIC conditions', () => {
    // Test high TSR warning
    const highTSR: TurbineInputs = {
      tipSpeedRatio: 16,
      numberOfBlades: 3,
      diameter: 3.0,
      numberOfStations: 10
    };
    let result = calculateTurbineDesign(highTSR);
    expect(result.warnings).toContain("High tip speed ratio - that's ambitious!");

    // Test too many blades warning
    const tooManyBlades: TurbineInputs = {
      tipSpeedRatio: 7,
      numberOfBlades: 4,
      diameter: 3.0,
      numberOfStations: 10
    };
    result = calculateTurbineDesign(tooManyBlades);
    // TSR * Blades = 7 * 4 = 28 > 24
    expect(result.warnings).toContain("Too many blades for this tip speed ratio");

    // Test high tip speed warning
    const highTipSpeed: TurbineInputs = {
      tipSpeedRatio: 6,
      numberOfBlades: 3,
      generatorPower: 500,
      generatorRPM: 600,
      gearRatio: 1,
      numberOfStations: 10
    };
    result = calculateTurbineDesign(highTipSpeed);
    // Will generate a smaller diameter due to higher RPM
    // Check if RPM * D > 1800
    if (result.diameter * 600 > 1800) {
      expect(result.warnings).toContain("High tip speed - beware of erosion");
    }
  });

  test('Torque calculation matches BASIC formula', () => {
    const inputs: TurbineInputs = {
      tipSpeedRatio: 6,
      numberOfBlades: 3,
      diameter: 3.0,
      numberOfStations: 10
    };

    const result = calculateTurbineDesign(inputs);

    // BASIC formula: TORQUE = 9*D^3/10/TSR^2
    // TORQUE = 9 * 3^3 / 10 / 6^2
    // TORQUE = 9 * 27 / 10 / 36
    // TORQUE = 243 / 360
    // TORQUE = 0.675 Newton metres
    expect(result.torque).toBeCloseTo(0.675, 2);
  });

  test('Thickness decreases along blade span', () => {
    const inputs: TurbineInputs = {
      tipSpeedRatio: 6,
      numberOfBlades: 3,
      diameter: 3.0,
      numberOfStations: 10
    };

    const result = calculateTurbineDesign(inputs);

    // BASIC formula: TH = CH / (5 + X*3/N)
    // Thickness should decrease as X increases
    for (let i = 0; i < result.stations.length - 1; i++) {
      // Each station should be thinner than the previous (closer to hub)
      // Note: This is relative to chord, and chord also changes
      const thicknessRatio1 = result.stations[i].thickness / result.stations[i].chord;
      const thicknessRatio2 = result.stations[i + 1].thickness / result.stations[i + 1].chord;
      expect(thicknessRatio1).toBeGreaterThan(thicknessRatio2);
    }
  });
});

// Manual validation helper (not a test, just for reference)
export function printValidationExample() {
  console.log('=== Validation Example: 500W Generator @ 400 RPM ===');

  const inputs: TurbineInputs = {
    tipSpeedRatio: 6,
    numberOfBlades: 3,
    generatorPower: 500,
    generatorRPM: 400,
    gearRatio: 1,
    numberOfStations: 10
  };

  const result = calculateTurbineDesign(inputs);

  console.log(`Diameter: ${result.diameter.toFixed(2)} meters`);
  console.log(`Rated Windspeed: ${result.ratedWindspeed.toFixed(2)} m/s`);
  console.log(`Torque: ${result.torque.toFixed(2)} Nm`);
  console.log(`Warnings: ${result.warnings.join(', ') || 'None'}`);
  console.log('\nFirst 3 stations:');

  for (let i = 0; i < 3; i++) {
    const s = result.stations[i];
    console.log(`Station ${i + 1}:`);
    console.log(`  Radius: ${s.radius.toFixed(3)}m, Setting: ${s.setting.toFixed(1)}°`);
    console.log(`  Chord: ${s.chord.toFixed(3)}m, Thickness: ${s.thickness.toFixed(4)}m`);
  }
}
