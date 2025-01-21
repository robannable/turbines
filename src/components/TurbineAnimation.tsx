import { useEffect, useRef } from 'react';

interface TurbineAnimationProps {
  numberOfBlades: number;
  tipSpeedRatio: number;
}

export function TurbineAnimation({ numberOfBlades, tipSpeedRatio }: TurbineAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotation = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const bladeLength = radius * 0.8;
    const hubRadius = radius * 0.1;

    function drawBlade(ctx: CanvasRenderingContext2D, angle: number) {
      const startX = centerX + Math.cos(angle) * hubRadius;
      const startY = centerY + Math.sin(angle) * hubRadius;
      const endX = centerX + Math.cos(angle) * bladeLength;
      const endY = centerY + Math.sin(angle) * bladeLength;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1D4ED8';
      ctx.stroke();
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw hub
      ctx.beginPath();
      ctx.arc(centerX, centerY, hubRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();
      ctx.strokeStyle = '#1D4ED8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw blades
      for (let i = 0; i < numberOfBlades; i++) {
        const angle = rotation + (i * 2 * Math.PI) / numberOfBlades;
        drawBlade(ctx, angle);
      }

      // Update rotation based on tip speed ratio
      rotation += (0.02 * tipSpeedRatio) / 7; // Normalized to typical TSR of 7
      if (rotation > Math.PI * 2) rotation -= Math.PI * 2;

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [numberOfBlades, tipSpeedRatio]);

  return (
    <div className="relative bg-white p-4 rounded-xl shadow-sm ring-1 ring-gray-900/5">
      <h2 className="text-xl font-semibold mb-4">Turbine Animation</h2>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="w-full max-w-[300px] mx-auto border border-gray-200 rounded-lg"
      />
      <div className="mt-2 text-sm text-gray-600 text-center">
        Animation speed relative to TSR: {tipSpeedRatio.toFixed(1)}
      </div>
    </div>
  );
} 