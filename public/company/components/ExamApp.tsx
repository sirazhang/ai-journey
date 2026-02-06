import React, { useState, useEffect } from 'react';
import { generateFactStatement } from '../services/gemini';
import { FactStatement, VerificationCategory } from '../types';
import { Loader2, CheckCircle, XCircle, Search, MapPin, RefreshCw, Trophy } from 'lucide-react';

const CATEGORIES: VerificationCategory[] = [
  'COMMON_SENSE',
  'NEWS_CREDIBILITY',
  'PLACE_EXISTENCE',
  'LOCATION_ACCURACY',
  'DISTANCE_REACHABILITY'
];

const ExamApp: React.FC = () => {
  const [stage, setStage] = useState<'LOADING' | 'GAME' | 'FEEDBACK'>('LOADING');
  const [category, setCategory] = useState<VerificationCategory>('COMMON_SENSE');
  const [currentFact, setCurrentFact] = useState<FactStatement | null>(null);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  // Load a random fact on mount
  useEffect(() => {
    loadRandomFact();
  }, []);

  const loadRandomFact = async () => {
    const randomCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setCategory(randomCat);
    setStage('LOADING');
    await loadNewFact(randomCat);
  };

  const loadNewFact = async (cat: VerificationCategory) => {
    try {
      const fact = await generateFactStatement(cat);
      setCurrentFact(fact);
      setUserGuess(null);
      setStage('GAME');
    } catch (e) {
      console.error(e);
      // Fallback
      setCurrentFact({
        statement: "The internet is always right.",
        isTrue: false,
        explanation: "Anyone can post on the internet. You must always check your sources!",
        searchHint: "is the internet always factually correct"
      });
      setStage('GAME');
    }
  };

  const handleGuess = (guess: boolean) => {
    setUserGuess(guess);
    setStage('FEEDBACK');
    if (guess === currentFact?.isTrue) {
      setScore(s => s + 10);
    }
  };

  const renderGame = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-none p-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-400 uppercase">Current Mission</span>
            <span className="font-mono font-bold text-indigo-600 text-xs px-2 py-1 bg-indigo-50 rounded">
                {category.replace(/_/g, ' ')}
            </span>
        </div>
        <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="font-bold text-yellow-700">{score} pts</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="max-w-2xl w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-4">Verify this Statement</h2>
            <p className="text-2xl md:text-3xl font-serif text-gray-900 leading-snug">
              "{currentFact?.statement}"
            </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
           <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
             <Search className="w-4 h-4 text-blue-500" />
             <span>Hint: <strong>{currentFact?.searchHint}</strong></span>
           </div>
           {(category === 'PLACE_EXISTENCE' || category === 'LOCATION_ACCURACY' || category === 'DISTANCE_REACHABILITY') && (
               <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                 <MapPin className="w-4 h-4 text-green-500" />
                 <span>Use the <strong>Maps</strong> app</span>
               </div>
           )}
        </div>

        <div className="flex space-x-6 w-full max-w-md">
           <button 
             onClick={() => handleGuess(true)}
             className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/30 transition-all active:scale-95"
           >
             TRUE
           </button>
           <button 
             onClick={() => handleGuess(false)}
             className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-red-500/30 transition-all active:scale-95"
           >
             FALSE
           </button>
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => {
    const isCorrect = userGuess === currentFact?.isTrue;
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fadeIn bg-gray-50">
         <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isCorrect ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
         </div>
         
         <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isCorrect ? "Correct!" : "Incorrect!"}
         </h2>
         
         <div className="max-w-xl bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-4 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-bold block text-gray-900 mb-2">Analysis:</span>
                {currentFact?.explanation}
            </p>
         </div>

         <div className="flex space-x-4">
             <button 
                onClick={() => loadRandomFact()}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-lg flex items-center space-x-2 transition-transform active:scale-95"
             >
                <RefreshCw className="w-4 h-4" />
                <span>Next Case</span>
             </button>
         </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-white text-gray-900 font-sans">
      {stage === 'LOADING' && (
        <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Generating Verification Task...</p>
        </div>
      )}
      {stage === 'GAME' && renderGame()}
      {stage === 'FEEDBACK' && renderFeedback()}
    </div>
  );
};

export default ExamApp;