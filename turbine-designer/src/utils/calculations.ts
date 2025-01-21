import { create, all } from 'mathjs';

const math = create(all);

export interface TurbineInputs {
  tipSpeedRatio: number;
  numberOfBlades: number;
  generatorPower?: number;
  generatorRPM?: number;
  gearRatio?: number;
  diameter?: number;
  numberOfStations: number;
}

export interface StationMeasurements {
  radius: number;
  setting: number;
  chord: number;
  width: number;
  drop: number;
  thickness: number;
}

export interface TurbineDesign {
  diameter: number;
  ratedWindspeed: number;
  torque: number;
  stations: StationMeasurements[];
  warnings: string[];
}

export function calculateTurbineDesign(inputs: TurbineInputs): TurbineDesign {
  const warnings: string[] = [];
  
  // Validate inputs
  if (inputs.tipSpeedRatio > 15) {
    warnings.push("High tip speed ratio - that's ambitious!");
  }
  if (inputs.tipSpeedRatio * inputs.numberOfBlades > 24) {
    warnings.push("Too many blades for this tip speed ratio");
  }

  let diameter = inputs.diameter;
  let rpm = inputs.generatorRPM;
  
  // Calculate diameter if not provided
  if (!diameter && inputs.generatorPower && inputs.generatorRPM) {
    rpm = inputs.generatorRPM / (inputs.gearRatio || 1);
    const powerCalc = math.multiply(
      inputs.generatorPower,
      math.pow(math.divide(math.multiply(47, inputs.tipSpeedRatio), rpm), 3)
    );
    diameter = Number(math.pow(powerCalc, 0.2));
  }

  if (!diameter) {
    throw new Error("Either diameter or generator specifications must be provided");
  }

  // Check for high tip speeds
  if (rpm && rpm * diameter > 1800) {
    warnings.push("High tip speed - beware of erosion");
  }

  const ratedWindspeed = rpm ? (rpm * diameter) / (20 * inputs.tipSpeedRatio) : 0;
  if (rpm && (rpm * diameter / inputs.tipSpeedRatio > 260)) {
    warnings.push("Consider using gearing to reduce speed");
  }

  const torque = 9 * Math.pow(diameter, 3) / 10 / Math.pow(inputs.tipSpeedRatio, 2);

  // Calculate station measurements
  const stations: StationMeasurements[] = [];
  for (let i = 1; i <= inputs.numberOfStations; i++) {
    const r = (diameter / 2 / inputs.numberOfStations) * i;
    const flow = Math.atan(diameter / 3 / inputs.tipSpeedRatio / r);
    const chord = (1.7 * Math.pow(diameter, 2)) / 
                 (inputs.numberOfBlades * r * Math.pow(inputs.tipSpeedRatio, 2)) * 
                 Math.pow(Math.cos(flow), 2);
    
    stations.push({
      radius: r,
      setting: 57 * flow - 3,
      chord: chord,
      width: chord * Math.cos(flow - 3/57),
      drop: chord * Math.sin(flow - 3/57),
      thickness: chord / (5 + i * 3 / inputs.numberOfStations)
    });
  }

  return {
    diameter,
    ratedWindspeed,
    torque,
    stations,
    warnings
  };
} 