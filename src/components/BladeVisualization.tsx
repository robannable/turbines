import { useEffect, useRef } from 'react';
import { StationMeasurements } from '../utils/calculations';

interface BladeVisualizationProps {
  stations: StationMeasurements[];
  diameter: number;
}

export function BladeVisualization({ stations, diameter }: BladeVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up scaling
    const margin = 40;
    const scale = (canvas.width - margin * 2) / diameter;
    
    // Transform coordinates to center the blade
    ctx.translate(margin, canvas.height / 2);
    ctx.scale(scale, scale);

    // Draw blade outline
    ctx.beginPath();
    ctx.moveTo(0, 0);

    // Draw top curve
    stations.forEach((station) => {
      const x = station.radius;
      const y = station.chord / 2;
      ctx.lineTo(x, y);
    });

    // Draw bottom curve
    [...stations].reverse().forEach((station) => {
      const x = station.radius;
      const y = -station.chord / 2;
      ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
    ctx.strokeStyle = '#1D4ED8';
    ctx.lineWidth = 0.02;
    ctx.stroke();

    // Draw station lines
    stations.forEach((station) => {
      ctx.beginPath();
      ctx.moveTo(station.radius, -station.chord / 2);
      ctx.lineTo(station.radius, station.chord / 2);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 0.01;
      ctx.stroke();

      // Draw angle indicator
      const angleRadius = station.chord / 4;
      ctx.beginPath();
      ctx.arc(station.radius, 0, angleRadius, 0, (station.setting * Math.PI) / 180);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 0.01;
      ctx.stroke();
    });

    // Reset transformation
    ctx.resetTransform();

    // Add labels
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#1F2937';
    ctx.textAlign = 'left';
    ctx.fillText(`Diameter: ${diameter.toFixed(2)}m`, 10, 20);
    ctx.fillText('Red lines: Blade angle at each station', 10, 40);
  }, [stations, diameter]);

  return (
    <div className="relative bg-white p-4 rounded-xl shadow-sm ring-1 ring-gray-900/5">
      <h2 className="text-xl font-semibold mb-4">Blade Profile Visualization</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-auto border border-gray-200 rounded-lg"
      />
    </div>
  );
} 