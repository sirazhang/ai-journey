
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { ShapeType, DrawingTool, StickerType } from '../types';

interface CanvasBoardProps {
  shape: ShapeType | null;
  tool: DrawingTool;
}

export interface CanvasBoardHandle {
  getCanvasData: () => string | null;
  clearCanvas: () => void;
}

// Pencil cursor SVG encoded for CSS cursor property
// Tip is at 0, 24 (bottom left)
const PENCIL_CURSOR = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>') 0 24, auto`;
const STICKER_CURSOR = `copy`;

const CanvasBoard = forwardRef<CanvasBoardHandle, CanvasBoardProps>(({ shape, tool }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getCanvasData: () => {
      if (canvasRef.current) {
        return canvasRef.current.toDataURL("image/png");
      }
      return null;
    },
    clearCanvas: () => {
        drawInitialShape();
    }
  }));

  const drawShapePath = (ctx: CanvasRenderingContext2D, x: number, y: number, type: ShapeType | StickerType | string, size: number) => {
    ctx.beginPath();
    if (type === 'circle') {
      ctx.arc(x, y, size, 0, Math.PI * 2);
    } else if (type === 'square') {
      ctx.rect(x - size, y - size, size * 2, size * 2);
    } else if (type === 'heart') {
        ctx.moveTo(x, y + size);
        ctx.bezierCurveTo(x + size, y, x + size, y - size, x, y - size * 0.5);
        ctx.bezierCurveTo(x - size, y - size, x - size, y, x, y + size);
    } else if (type === 'triangle') {
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x - size, y + size);
        ctx.closePath();
    } else if (type === 'star') {
        let rot = Math.PI / 2 * 3;
        let cx = x;
        let cy = y;
        const step = Math.PI / 5;
        const outerRadius = size;
        const innerRadius = size / 2;
        
        ctx.moveTo(cx, cy - outerRadius);
        for(let i=0; i<5; i++){
            cx = x + Math.cos(rot) * outerRadius;
            cy = y + Math.sin(rot) * outerRadius;
            ctx.lineTo(cx, cy);
            rot += step;
            cx = x + Math.cos(rot) * innerRadius;
            cy = y + Math.sin(rot) * innerRadius;
            ctx.lineTo(cx, cy);
            rot += step;
        }
        ctx.lineTo(x, y - outerRadius);
        ctx.closePath();
    } else if (type === 'cloud') {
      ctx.arc(x - size*0.5, y, size*0.5, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(x, y - size*0.5, size*0.6, Math.PI * 1, Math.PI * 2);
      ctx.arc(x + size*0.5, y, size*0.5, Math.PI * 1.5, Math.PI * 0.5);
      ctx.closePath();
    } else if (type === 'moon') {
      ctx.arc(x, y, size, 0.1 * Math.PI, 1.9 * Math.PI, true);
      ctx.quadraticCurveTo(x - size * 0.5, y, x, y + size * 0.95);
      ctx.closePath();
    } else if (type === 'flower') {
        // Simple 5 petal flower
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5;
            const px = x + Math.cos(angle) * (size * 0.5);
            const py = y + Math.sin(angle) * (size * 0.5);
            ctx.moveTo(px, py);
            ctx.arc(px, py, size * 0.4, 0, Math.PI * 2);
        }
        ctx.moveTo(x, y);
        ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
    } else if (type === 'diamond') {
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.8, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size * 0.8, y);
        ctx.closePath();
    }
  }

  const drawInitialShape = () => {
    const canvas = canvasRef.current;
    if (!canvas || !shape) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Guide Shape
    ctx.strokeStyle = '#e2e8f0'; // Light slate, subtle guide
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height) * 0.3;

    drawShapePath(ctx, cx, cy, shape, size);
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Handle high DPI displays
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        setContext(ctx);
      }
    }
  }, []);

  useEffect(() => {
    if (context) {
        drawInitialShape();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape, context]); 

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    const { x, y } = getCoordinates(e);

    if (tool.mode === 'sticker' && tool.sticker) {
        // Stamp mode
        context.fillStyle = tool.color;
        context.strokeStyle = tool.color;
        context.lineWidth = 2; // Outline for stickers if needed
        
        drawShapePath(context, x, y, tool.sticker, tool.size * 6); // Scale size for sticker
        context.fill();
        // Optional: stroke for definition
        // context.stroke();
        return;
    }

    // Brush mode
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(x, y);
    context.strokeStyle = tool.color;
    context.lineWidth = tool.size;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (tool.mode === 'sticker') return;
    if (!isDrawing || !context) return;
    const { x, y } = getCoordinates(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (tool.mode === 'sticker') return;
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;

    if ((e as React.TouchEvent).touches && (e as React.TouchEvent).touches.length > 0) {
      clientX = (e as React.TouchEvent).touches[0].clientX;
      clientY = (e as React.TouchEvent).touches[0].clientY;
    } else if ((e as React.TouchEvent).changedTouches && (e as React.TouchEvent).changedTouches.length > 0) {
      // For touchend
      clientX = (e as React.TouchEvent).changedTouches[0].clientX;
      clientY = (e as React.TouchEvent).changedTouches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow-xl border-4 border-indigo-200">
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none"
        style={{ 
          width: '100%', 
          height: '100%',
          cursor: tool.mode === 'sticker' ? STICKER_CURSOR : PENCIL_CURSOR
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
});

CanvasBoard.displayName = 'CanvasBoard';

export default CanvasBoard;
