
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppStage, IdeaPrompt, DrawingTool, StickerType } from './types';
import CanvasBoard, { CanvasBoardHandle } from './components/CanvasBoard';
import { generateIdea, generateMagicImage, polishStory } from './services/geminiService';
import { 
  Rocket, 
  Pencil, 
  Wand2, 
  RotateCcw, 
  Download, 
  Palette, 
  Eraser, 
  Sparkles,
  BookOpen,
  Shapes,
  Type as TypeIcon,
  Wifi,
  Battery
} from 'lucide-react';

// Kid-friendly palette
const COLORS = [
  '#1e293b', // Black/Slate
  '#ef4444', // Red
  '#10b981', // Green
  '#3b82f6', // Blue
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#f472b6', // Pink
  '#eab308', // Yellow
];

const STICKERS: { type: StickerType, label: string }[] = [
    { type: 'star', label: 'Star' },
    { type: 'heart', label: 'Heart' },
    { type: 'cloud', label: 'Cloud' },
    { type: 'moon', label: 'Moon' },
    { type: 'flower', label: 'Flower' },
    { type: 'diamond', label: 'Gem' },
];

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.START);
  const [idea, setIdea] = useState<IdeaPrompt | null>(null);
  const [userStory, setUserStory] = useState('');
  const [magicStory, setMagicStory] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [magicInput, setMagicInput] = useState(''); // Pre-generation input
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  
  const [drawingTool, setDrawingTool] = useState<DrawingTool>({ mode: 'brush', color: '#1e293b', size: 5 });
  const [activeTab, setActiveTab] = useState<'colors' | 'shapes'>('colors');
  
  const canvasRef = useRef<CanvasBoardHandle>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Initialize with an idea on start
  const handleStart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIdea(null); // Clear previous idea to show loader
    setStage(AppStage.START); 
    
    try {
      const newIdea = await generateIdea();
      setIdea(newIdea);
      setUserStory(newIdea.storyStarter + " ");
      setStage(AppStage.DRAWING);
      // Reset other states
      setGeneratedImage(null);
      setMagicStory('');
      setMagicInput('');
    } catch (err) {
      console.error(err);
      setError("Oops! The idea fairy is sleeping. Check your API Key and try again!");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-start on mount
  useEffect(() => {
    handleStart();
  }, [handleStart]);

  const handleGenerateMagic = async () => {
    if (!canvasRef.current) return;
    const drawing = canvasRef.current.getCanvasData();
    if (!drawing) return;

    setIsLoading(true);
    setStage(AppStage.GENERATING);
    setError(null);

    try {
      // Run image generation and story polishing in parallel
      // Pass the magicInput (pre-generation elements) to the service
      const imagePromise = generateMagicImage(drawing, userStory, magicInput);
      const storyPromise = polishStory(userStory).catch((e) => {
        console.error("Story polish failed", e);
        return userStory; // Fallback
      });

      const [resultImage, resultStory] = await Promise.all([imagePromise, storyPromise]);

      setGeneratedImage(resultImage);
      setMagicStory(resultStory);
      setStage(AppStage.RESULT);
    } catch (err) {
      console.error(err);
      setError("Magic spell failed! Please try again.");
      setStage(AppStage.DRAWING);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCompositeImage = async () => {
    if (!generatedImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = generatedImage;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const textAreaHeight = 200;
    const padding = 40;
    canvas.width = img.width;
    canvas.height = img.height + textAreaHeight;

    ctx.fillStyle = '#FFF8E1'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0);

    ctx.strokeStyle = '#D7CCC8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(padding, img.height + 10);
    ctx.lineTo(canvas.width - padding, img.height + 10);
    ctx.stroke();

    ctx.fillStyle = '#5D4037';
    ctx.font = 'bold 32px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = magicStory || userStory;
    const maxWidth = canvas.width - (padding * 2);
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const lineHeight = 40;
    const startY = img.height + (textAreaHeight / 2) - ((lines.length - 1) * lineHeight / 2);
    
    lines.forEach((l, i) => {
      ctx.fillText(l, canvas.width / 2, startY + (i * lineHeight));
    });

    const link = document.createElement('a');
    link.download = 'my-dream-story.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const resetApp = () => {
    handleStart();
  };

  return (
    <div className="min-h-screen bg-stone-200 flex items-center justify-center p-4 md:p-8 font-sans selection:bg-yellow-200">
      
      {/* Device Frame */}
      <div className="relative bg-gray-900 rounded-[2.5rem] p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-4 border-gray-800 ring-4 ring-gray-900/20 w-full max-w-[1400px] h-[90vh] flex flex-col transition-all">
        
        {/* Front Camera Area */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-center pointer-events-none">
             <div className="w-1.5 h-1.5 rounded-full bg-gray-800 ring-1 ring-gray-700 ml-auto mr-4"></div>
        </div>

        {/* Device Screen */}
        <div className="flex-1 bg-[#F0F4F8] rounded-[2rem] overflow-hidden flex flex-col w-full h-full relative border border-gray-800">
            
            {/* iOS-style Status Bar */}
            <div className="h-8 bg-white/80 backdrop-blur-md flex justify-between items-center px-6 text-[10px] font-bold text-slate-900 z-20 border-b border-indigo-50/50">
                <div className="flex-1 text-left pl-2">{currentTime}</div>
                <div className="flex-1 text-center"></div>
                <div className="flex-1 flex justify-end gap-2 items-center pr-2">
                    <Wifi size={14} />
                    <Battery size={14} />
                </div>
            </div>

            {/* App Header */}
            <div className="flex justify-between items-center px-6 py-3 bg-white shadow-sm border-b border-indigo-50 z-10 shrink-0">
                <div className="flex items-center gap-3 group cursor-default">
                <div className="bg-[#FF7043] p-1.5 rounded-xl text-white shadow-sm transition-transform group-hover:rotate-12">
                    <Rocket size={20} strokeWidth={2.5} />
                </div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                    NEXUS ISLAND
                </h1>
                </div>
                {idea && (
                <button 
                    onClick={resetApp}
                    className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"
                    title="Start New Story"
                >
                    <RotateCcw size={18} strokeWidth={2.5} />
                </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden p-6 flex items-center justify-center relative">
                
                {/* Error Message Overlay */}
                {error && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-rose-100 border-2 border-rose-300 text-rose-700 px-6 py-3 rounded-full font-bold shadow-lg animate-bounce">
                    {error}
                </div>
                )}

                {/* LOADING INITIAL STATE */}
                {!idea && (
                   <div className="flex flex-col items-center justify-center h-full">
                      {isLoading ? (
                        <>
                           <div className="w-16 h-16 border-8 border-indigo-100 border-t-[#FF7043] rounded-full animate-spin mb-4"></div>
                           <h2 className="text-2xl font-bold text-indigo-900 animate-pulse">Dreaming up a new world...</h2>
                        </>
                      ) : error ? (
                         <div className="text-center">
                            <p className="text-slate-500 mb-4 font-medium">Something went wrong starting the engine.</p>
                            <button onClick={handleStart} className="px-6 py-3 bg-[#FF7043] text-white rounded-xl font-bold shadow-sm hover:translate-y-1 active:translate-y-0 transition-all">Try Again</button>
                         </div>
                      ) : null}
                   </div>
                )}

                {/* WORKSPACE */}
                {idea && (
                <div className="w-full h-full flex flex-row gap-5">
                    
                    {/* LEFT SIDEBAR */}
                    <div className="w-80 flex flex-col gap-4 h-full flex-shrink-0 overflow-hidden">
                    
                    {/* Story Card */}
                    <div className="bg-[#FFF8E1] p-1 rounded-2xl shadow-sm border-2 border-[#FFE082] shrink-0 flex-1 max-h-[40%] flex flex-col">
                        <div className="bg-white/60 p-4 rounded-xl flex flex-col h-full">
                        <h3 className="text-xs font-bold text-[#8D6E63] mb-2 flex items-center gap-2 uppercase tracking-wider shrink-0">
                            <Pencil size={12} /> Finish the Story
                        </h3>
                        <div className="relative flex-1 min-h-0">
                            {stage === AppStage.RESULT ? (
                                <p className="text-base font-medium text-slate-700 font-fredoka leading-relaxed h-full overflow-y-auto custom-scrollbar">
                                    "{magicStory || userStory}"
                                </p>
                            ) : (
                                <textarea
                                value={userStory}
                                onChange={(e) => setUserStory(e.target.value)}
                                className="w-full h-full bg-transparent outline-none text-base leading-7 text-slate-700 resize-none font-medium placeholder:text-slate-300"
                                style={{ 
                                    backgroundImage: 'linear-gradient(transparent, transparent 27px, #EFEBE9 27px)', 
                                    backgroundSize: '100% 28px',
                                    lineHeight: '28px'
                                }}
                                placeholder="..."
                                />
                            )}
                        </div>
                        </div>
                    </div>

                    {/* Tools Container */}
                    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 flex-[1.5] flex flex-col overflow-hidden min-h-0">
                        {/* Tabs */}
                        {stage === AppStage.DRAWING && (
                        <>
                            <div className="flex border-b border-indigo-50 shrink-0">
                            <button 
                                onClick={() => setActiveTab('colors')}
                                className={`flex-1 py-3 font-bold text-xs flex items-center justify-center gap-2 ${activeTab === 'colors' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Palette size={16} /> Colors
                            </button>
                            <button 
                                onClick={() => setActiveTab('shapes')}
                                className={`flex-1 py-3 font-bold text-xs flex items-center justify-center gap-2 ${activeTab === 'shapes' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Shapes size={16} /> Shapes
                            </button>
                            </div>

                            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                            {activeTab === 'colors' ? (
                                <div className="space-y-4">
                                <div className="grid grid-cols-4 gap-2">
                                    {COLORS.map(c => (
                                        <button
                                        key={c}
                                        onClick={() => setDrawingTool({ ...drawingTool, color: c, mode: 'brush' })}
                                        className={`w-full aspect-square rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 ${drawingTool.color === c && drawingTool.mode === 'brush' ? 'ring-4 ring-indigo-100 scale-105' : ''}`}
                                        style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                                <div className="pt-3 border-t border-slate-100">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Brush Size</label>
                                    <input 
                                        type="range" 
                                        min="2" max="20" 
                                        value={drawingTool.size} 
                                        onChange={(e) => setDrawingTool({...drawingTool, size: parseInt(e.target.value)})}
                                        className="w-full accent-indigo-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                {STICKERS.map(s => (
                                    <button
                                    key={s.type}
                                    onClick={() => setDrawingTool({ ...drawingTool, mode: 'sticker', sticker: s.type })}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all hover:bg-indigo-50 ${drawingTool.mode === 'sticker' && drawingTool.sticker === s.type ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-white'}`}
                                    >
                                        <div className="text-xl mb-1">
                                        {s.type === 'star' && '⭐'}
                                        {s.type === 'heart' && '❤️'}
                                        {s.type === 'cloud' && '☁️'}
                                        {s.type === 'moon' && '🌙'}
                                        {s.type === 'flower' && '🌸'}
                                        {s.type === 'diamond' && '💎'}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600">{s.label}</span>
                                    </button>
                                ))}
                                </div>
                            )}
                            </div>
                            
                            <div className="p-3 border-t border-indigo-50 shrink-0">
                            <button 
                                onClick={() => canvasRef.current?.clearCanvas()}
                                className="w-full py-2.5 text-rose-500 font-bold rounded-xl border-2 border-rose-100 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 text-xs"
                            >
                                <Eraser size={16} /> Clear Canvas
                            </button>
                            </div>
                        </>
                        )}
                        
                        {stage === AppStage.RESULT && (
                        <div className="p-6 flex flex-col gap-4 items-center justify-center h-full">
                            <div className="text-center p-4 bg-indigo-50 rounded-2xl w-full">
                                <Sparkles className="mx-auto text-indigo-400 mb-2" />
                                <p className="text-indigo-800 font-bold">Magic Applied!</p>
                            </div>
                            <button
                                onClick={downloadCompositeImage}
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all font-bold flex items-center justify-center gap-2"
                            >
                                <Download size={20} /> Save Story Card
                            </button>
                        </div>
                        )}
                    </div>
                    </div>

                    {/* RIGHT MAIN: Canvas & Interaction */}
                    <div className="flex-1 flex flex-col h-full relative gap-4 min-w-0">
                    
                    {/* Canvas Area */}
                    <div className="flex-1 bg-white rounded-[2rem] shadow-sm border-4 border-slate-100 relative overflow-hidden group min-h-0">
                        {stage === AppStage.RESULT && generatedImage ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                <img src={generatedImage} alt="Magic Result" className="max-w-full max-h-full object-contain shadow-2xl" />
                            </div>
                        ) : (
                            <>
                            {stage === AppStage.GENERATING && (
                                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-8 border-indigo-100 border-t-[#FF7043] rounded-full animate-spin mx-auto mb-4"></div>
                                    <h3 className="text-xl font-bold text-indigo-900 animate-pulse">Making Magic...</h3>
                                </div>
                                </div>
                            )}
                            <CanvasBoard ref={canvasRef} shape={idea.shape} tool={drawingTool} />
                            </>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col gap-3 shrink-0">
                        {stage === AppStage.DRAWING && (
                            <>
                            <button
                                onClick={handleGenerateMagic}
                                disabled={isLoading}
                                className="w-full py-4 bg-[#10B981] text-white text-xl font-bold rounded-2xl shadow-[0_6px_0_#059669] hover:shadow-[0_3px_0_#059669] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3"
                            >
                                <Wand2 size={24} /> MAKE IT REAL!
                            </button>
                            
                            {/* Magic Input for Adding Elements PRE-GENERATION */}
                            <div className="bg-white p-2 rounded-2xl shadow-sm border border-indigo-100 flex items-center gap-2">
                                <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
                                    <TypeIcon size={18} />
                                </div>
                                <input 
                                type="text" 
                                value={magicInput}
                                onChange={(e) => setMagicInput(e.target.value)}
                                placeholder="Tell the AI what else to add... e.g. 'A blue dinosaur'"
                                className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium text-sm"
                                />
                            </div>
                            </>
                        )}
                    </div>
                    </div>

                </div>
                )}
            </div>

            {/* Bottom Home Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-20"></div>

        </div>
      </div>
    </div>
  );
};

export default App;
