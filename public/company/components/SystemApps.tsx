import React, { useState } from 'react';
import { Star, Mail, Trash2, Send, Inbox, Wifi, Bluetooth, Globe, Monitor, Battery, XCircle, ChevronLeft, ChevronRight, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Search, MapPin, RefreshCw, ArrowRight, ExternalLink, Map as MapIcon, CheckSquare, Plus, Calendar as CalendarIcon, Sparkles, Navigation, Share2, Bookmark, Phone, Clock, Info, Filter, AlertCircle, Bot, Route } from 'lucide-react';
import { performWebSearch, performMapSearch } from '../services/gemini';
import { MapResult, RouteInfo } from '../types';

// --- Browser App ---
export const BrowserApp: React.FC = () => {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        const data = await performWebSearch(query);
        setAnswer(data);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-white text-gray-800">
            {/* Browser Toolbar */}
            <div className="h-14 bg-[#f1f1f1] border-b border-[#d1d1d1] flex items-center px-4 space-x-3">
                <div className="flex space-x-4 text-gray-500">
                    <ChevronLeft className="w-5 h-5 cursor-pointer hover:text-gray-800" />
                    <ChevronRight className="w-5 h-5 cursor-pointer hover:text-gray-800" />
                    <RefreshCw className="w-4 h-4 cursor-pointer hover:text-gray-800" onClick={() => handleSearch()} />
                </div>
                <form onSubmit={handleSearch} className="flex-1 flex space-x-2 justify-center">
                    <div className="w-full max-w-2xl bg-white border border-gray-300 rounded-lg flex items-center px-3 h-9 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 transition-all">
                        <Globe className="w-4 h-4 text-gray-400 mr-2" />
                        <input 
                            className="flex-1 bg-transparent border-none text-sm focus:outline-none text-gray-700" 
                            placeholder="Ask a question or enter a topic..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </form>
                <div className="w-8"></div>
            </div>

            {/* Browser Content */}
            <div className="flex-1 overflow-y-auto bg-white">
                {!searched && (
                    <div className="flex flex-col items-center justify-center h-full opacity-60">
                        <h1 className="text-4xl font-bold text-gray-300 mb-4 tracking-tight">Safari</h1>
                        <p className="text-gray-400 flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Powered Answers</p>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 text-sm">Thinking...</p>
                    </div>
                )}

                {!loading && searched && answer && (
                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{query}</h2>
                            <div className="h-1 w-20 bg-blue-500 rounded"></div>
                        </div>
                        <div className="prose prose-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {answer}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Maps App ---
export const MapsApp: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MapResult[]>([]);
    const [route, setRoute] = useState<RouteInfo | undefined>(undefined);
    const [agentAnswer, setAgentAnswer] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<MapResult | null>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        if(!query.trim()) return;
        setLoading(true);
        setHasSearched(true);
        setSelectedPlace(null);
        setRoute(undefined);
        
        const response = await performMapSearch(query);
        setResults(response.places);
        setAgentAnswer(response.answer);
        setRoute(response.route);
        
        if (response.places.length > 0 && !response.route) {
            setSelectedPlace(response.places[0]);
        }
        setLoading(false);
    }

    // Determine what to show in the iframe
    // If we have a route object, we construct a directions URL.
    let mapSrc = '';
    if (route) {
        mapSrc = `https://www.google.com/maps?saddr=${encodeURIComponent(route.origin)}&daddr=${encodeURIComponent(route.destination)}&output=embed`;
    } else {
        const mapDisplayQuery = selectedPlace 
            ? `${selectedPlace.name}, ${selectedPlace.address}` 
            : query;
        mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapDisplayQuery)}&output=embed`;
    }

    return (
        <div className="flex flex-col h-full bg-white relative">
             {/* Floating Search Bar */}
            <div className="absolute top-4 left-4 z-30 w-96 shadow-lg rounded-lg">
                <form onSubmit={handleSearch} className="flex">
                    <input 
                        className="w-full bg-white rounded-l-lg px-4 py-3 text-sm focus:outline-none border-y border-l border-gray-200 shadow-sm"
                        placeholder="Search or 'Distance from A to B'"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="bg-white hover:bg-gray-50 text-blue-600 px-4 py-3 rounded-r-lg border-y border-r border-gray-200 transition-colors shadow-sm"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </form>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar: Agent Answer + Results List */}
                {(hasSearched) && (
                    <div className="w-96 bg-white overflow-y-auto shadow-2xl z-20 flex flex-col border-r border-gray-200 flex-shrink-0 pt-20">
                        
                        {/* Route Summary Card */}
                        {route && (
                             <div className="p-4 bg-green-50 border-b border-green-100 animate-slideRight">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Route className="w-5 h-5 text-green-600" />
                                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Route Found</span>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-gray-800">
                                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                        <span className="font-medium truncate">{route.origin}</span>
                                    </div>
                                    <div className="h-4 border-l border-dashed border-gray-300 ml-1 my-0.5"></div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-800">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <span className="font-medium truncate">{route.destination}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Agent Summary */}
                        {agentAnswer && (
                            <div className="p-4 border-b border-gray-100 bg-blue-50/50">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Bot className="w-5 h-5 text-blue-600" />
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Gemini Maps Agent</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {agentAnswer}
                                </p>
                            </div>
                        )}

                        {/* List of Places */}
                        <div className="flex-1 overflow-y-auto">
                            {results.length > 0 ? (
                                results.map((place, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => setSelectedPlace(place)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedPlace === place ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                                    >
                                        <h3 className="font-semibold text-gray-900 mb-1">{place.name}</h3>
                                        <div className="flex items-center space-x-1 text-xs text-orange-500 mb-1">
                                            <span className="font-bold">{place.rating}</span>
                                            <div className="flex">
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current text-gray-300" />
                                            </div>
                                            <span className="text-gray-400">({place.reviews})</span>
                                        </div>
                                        <div className="flex items-start space-x-2 text-xs text-gray-500">
                                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">{place.address}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                !loading && !route && (
                                    <div className="p-8 text-center text-gray-400">
                                        <MapIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">No specific places listed in the agent's response.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* Real Google Maps Embed */}
                <div className="flex-1 bg-gray-100 relative h-full w-full">
                    {hasSearched ? (
                         <iframe
                            key={mapSrc} // Force re-render on src change
                            width="100%"
                            height="100%"
                            style={{ border: 0, opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s' }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={mapSrc}
                            title="Google Maps"
                        ></iframe>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                            <MapIcon className="w-20 h-20 mb-4 opacity-10" />
                            <p className="font-medium text-gray-400">Ask the Maps Agent for places or directions</p>
                        </div>
                    )}

                    {loading && (
                         <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/20 backdrop-blur-sm">
                             <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-xl flex items-center space-x-3">
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="font-bold text-gray-800 tracking-wide">Agent is searching...</span>
                             </div>
                         </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// --- Email App ---
export const EmailApp: React.FC = () => {
    interface Email {
        id: number;
        sender: string;
        email: string;
        subject: string;
        date: string;
        preview: string;
        body: string;
        read: boolean;
        color: string;
        initial: string;
    }

    const [emails, setEmails] = useState<Email[]>([
        {
            id: 1,
            sender: "Director Vega",
            email: "vega@ringedcentral.city",
            subject: "Urgent: Verify Viral Claim About City Power Grid",
            date: "10:42 AM",
            preview: "A post is spreading claiming Ringed Central’s AI grid caused a blackout...",
            body: "Glitch,\n\nA post is spreading claiming Ringed Central’s AI grid caused a blackout in Sector 7 last night.\n\nPlease assess:\n* Source credibility\n* Technical plausibility\n* Cross-check with infrastructure logs\n\nReport due in 2 hours. Tag #FactCheck-RC-0206.\n\n— V",
            read: false,
            color: "bg-red-100 text-red-700",
            initial: "V"
        },
        {
            id: 2,
            sender: "AI Watch System",
            email: "MisinfoMonitor@ai-watch.ringedcentral.city",
            subject: "⚠️ High-Similarity Alert: AI-Generated Health Scam Detected",
            date: "9:15 AM",
            preview: "Detected near-identical copies of a fake “AI Cancer Cure” ad...",
            body: "Alert ID: MM-20260206-8841\n\nDetected near-identical copies of a fake “AI Cancer Cure” ad across 12 community forums.\n\nAction Required:\n✅ Classify narrative type (medical scam / conspiracy / parody)\n✅ Recommend takedown or public clarification\n\nView sample: [internal link]\n\n— AI Watch System",
            read: false,
            color: "bg-yellow-100 text-yellow-700",
            initial: "A"
        },
        {
            id: 3,
            sender: "EdTech Liaison",
            email: "edu-support@ringedcentral.city",
            subject: "Need Your Input on Student-Submitted AI Article",
            date: "Yesterday",
            preview: "A high school class submitted an “AI News Report”...",
            body: "Hi Glitch,\n\nA high school class submitted an “AI News Report” as part of their literacy project.\n\nOne claim states: “Gemini 3 can read human thoughts via webcam.”\n\nCould you provide a 2-sentence expert rebuttal we can share with students?\n\nThanks!\n— Maya, EdTech Liaison",
            read: true,
            color: "bg-blue-100 text-blue-700",
            initial: "E"
        },
        {
            id: 4,
            sender: "Maya",
            email: "collaborator@openai-literacy.org",
            subject: "Invitation: Co-host “Spot the Deepfake” Workshop",
            date: "Yesterday",
            preview: "Loved your lesson on synthetic media. Want to co-run...",
            body: "Hey Glitch!\n\nLoved your lesson on synthetic media. Want to co-run a hands-on session next Thursday?\n\nWe’ll use Google’s “About This Image” tool + Gemini’s reverse image search to teach students verification.\n\nLet me know!\n— Maya, Open AI Literacy Network",
            read: true,
            color: "bg-purple-100 text-purple-700",
            initial: "M"
        },
        {
            id: 5,
            sender: "Smart Infrastructure",
            email: "system@ringedcentral.city",
            subject: "Scheduled Maintenance: AI Fact-Check API Update",
            date: "Feb 5",
            preview: "The city’s AI-powered fact-checking service will undergo...",
            body: "Notification:\n\nThe city’s AI-powered fact-checking service will undergo a brief update tonight (Feb 6, 22:00–23:00).\n\nDuring this window, response latency may increase.\n\nNo action needed.\n\n— Ringed Central Smart Infrastructure",
            read: true,
            color: "bg-gray-100 text-gray-700",
            initial: "S"
        },
        {
            id: 6,
            sender: "City Data Office",
            email: "city.data.office@ringedcentral.gov",
            subject: "Weekly Public AI Usage Report – Feb 2026",
            date: "Feb 4",
            preview: "Per your request, attached is the official City AI Transparency...",
            body: "Hi Glitch,\n\nPer your request, attached is the official City AI Transparency Dashboard for Week 5, 2026.\n\nKey stat: 78% of residents used AI-assisted services this week (up 3% from last month).\n\nFull report: https://data.ringedcentral.gov/ai-weekly-2026w5\n\n— City Data Office",
            read: true,
            color: "bg-green-100 text-green-700",
            initial: "C"
        }
    ]);

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [filterUnread, setFilterUnread] = useState(false);

    const selectedEmail = emails.find(e => e.id === selectedId);
    const unreadCount = emails.filter(e => !e.read).length;
    const displayedEmails = filterUnread ? emails.filter(e => !e.read) : emails;

    const handleSelectEmail = (id: number) => {
        setSelectedId(id);
        // Mark as read immediately
        setEmails(prev => prev.map(email => email.id === id ? { ...email, read: true } : email));
    };

    return (
    <div className="flex h-full bg-white text-gray-800">
      {/* Sidebar */}
      <div className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col pt-3">
        <div className="px-4 py-2 text-gray-500 text-xs font-bold uppercase tracking-wide">Favorites</div>
        
        <div 
            className="px-4 py-2 bg-blue-100/60 text-blue-700 flex items-center space-x-3 cursor-pointer border-r-4 border-blue-600"
            onClick={() => setFilterUnread(false)}
        >
          <Inbox className="w-4 h-4" />
          <span className="text-sm font-medium">Inbox</span>
          {unreadCount > 0 && (
              <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
              </span>
          )}
        </div>
        
        <div className="px-4 py-2 text-gray-600 flex items-center space-x-3 cursor-pointer hover:bg-gray-100">
          <Send className="w-4 h-4" />
          <span className="text-sm font-medium">Sent</span>
        </div>
        <div className="px-4 py-2 text-gray-600 flex items-center space-x-3 cursor-pointer hover:bg-gray-100">
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">Trash</span>
        </div>
      </div>

      {/* Email List */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
         {/* Filter Header */}
         <div className="p-3 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
             <div className="flex space-x-2">
                 <button 
                    onClick={() => setFilterUnread(false)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${!filterUnread ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                 >
                     All
                 </button>
                 <button 
                    onClick={() => setFilterUnread(true)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center space-x-1 ${filterUnread ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                 >
                     <span>Unread</span>
                     {unreadCount > 0 && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                 </button>
             </div>
             {unreadCount > 0 && (
                <div className="flex items-center text-xs text-blue-600 font-semibold px-2 py-1 bg-blue-50 rounded animate-pulse">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {unreadCount} New
                </div>
             )}
         </div>

         <div className="flex-1 overflow-y-auto">
            {displayedEmails.map(email => (
                <div 
                    key={email.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer group hover:bg-gray-50 transition-colors ${selectedId === email.id ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                    onClick={() => handleSelectEmail(email.id)}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm ${!email.read ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                            {email.sender}
                        </span>
                        <span className="text-xs text-gray-500 shrink-0 ml-2">{email.date}</span>
                    </div>
                    <div className={`text-xs mb-1 line-clamp-2 ${!email.read ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
                        {email.subject}
                    </div>
                    <div className="flex items-center">
                         <div className="text-xs text-gray-400 line-clamp-1 flex-1">
                            {email.preview}
                         </div>
                         {!email.read && (
                             <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0 ml-2 shadow-sm"></div>
                         )}
                    </div>
                </div>
            ))}
            
            {displayedEmails.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">
                    No emails found.
                </div>
            )}
         </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {selectedEmail ? (
            <div className="p-8 h-full flex flex-col">
                <div className="border-b border-gray-200 pb-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{selectedEmail.subject}</h1>
                        <span className="text-sm text-gray-500 whitespace-nowrap bg-gray-50 px-2 py-1 rounded">{selectedEmail.date}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${selectedEmail.color}`}>
                            {selectedEmail.initial}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">{selectedEmail.sender}</span>
                                <span className="text-sm text-gray-500">&lt;{selectedEmail.email}&gt;</span>
                            </div>
                            <div className="text-xs text-gray-400">To: Glitch (You)</div>
                        </div>
                    </div>
                </div>
                
                <div className="prose prose-sm max-w-none text-gray-800 space-y-4 whitespace-pre-wrap leading-relaxed font-normal">
                    {selectedEmail.body}
                </div>
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 select-none">
                <Mail className="w-24 h-24 mb-4 stroke-1" />
                <span className="text-lg font-medium">Select an email to read</span>
            </div>
        )}
      </div>
    </div>
    );
};

// --- Game App (Tic Tac Toe) ---
export const GameApp: React.FC = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (calculateWinner(board) || board[i]) return;
    const nextBoard = board.slice();
    nextBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(board);
  const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;
  const isDraw = !winner && board.every(Boolean);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="mb-6 text-2xl font-bold font-mono text-green-400">{isDraw ? "It's a Draw!" : status}</div>
      <div className="grid grid-cols-3 gap-3 bg-gray-700 p-3 rounded-xl shadow-2xl">
        {board.map((square, i) => (
          <button
            key={i}
            className="w-20 h-20 bg-gray-800 rounded-lg text-4xl font-bold flex items-center justify-center hover:bg-gray-750 transition-colors"
            onClick={() => handleClick(i)}
          >
            <span className={square === 'X' ? 'text-blue-400' : 'text-pink-400'}>{square}</span>
          </button>
        ))}
      </div>
      <button 
        className="mt-8 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-full font-bold shadow-lg transition-transform active:scale-95"
        onClick={() => { setBoard(Array(9).fill(null)); setXIsNext(true); }}
      >
        Restart Game
      </button>
    </div>
  );
};

// --- Calendar App with Integrated Tasks ---
export const CalendarApp: React.FC = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = new Date();
    
  return (
    <div className="h-full bg-white flex flex-row">
       {/* Calendar View */}
       <div className="flex-1 flex flex-col border-r border-gray-200">
           <div className="p-4 border-b flex justify-between items-center bg-gray-50">
               <h2 className="text-xl font-bold text-red-600">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
               <div className="flex space-x-2">
                    <button className="p-1 hover:bg-gray-200 rounded"><ChevronLeft className="w-5 h-5" /></button>
                    <button className="p-1 hover:bg-gray-200 rounded"><ChevronRight className="w-5 h-5" /></button>
               </div>
           </div>
           <div className="grid grid-cols-7 flex-1">
               {days.map(d => <div key={d} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-500 border-b border-gray-100">{d}</div>)}
               {[...Array(35)].map((_, i) => {
                   const dayNum = i - 2; // Offset for demo
                   const isToday = dayNum === currentDate.getDate();
                   return (
                       <div key={i} className="border-b border-r border-gray-100 p-2 relative group hover:bg-gray-50 transition-colors">
                           {dayNum > 0 && dayNum <= 31 && (
                               <>
                                 <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm ${isToday ? 'bg-red-500 text-white font-bold' : 'text-gray-700'}`}>
                                     {dayNum}
                                 </span>
                               </>
                           )}
                       </div>
                   )
               })}
           </div>
       </div>
       
       {/* Tasks Side Panel (Replacing Notes) */}
       <div className="w-64 bg-gray-50 flex flex-col h-full">
           <div className="p-4 border-b border-gray-200 flex items-center justify-between">
               <h3 className="font-bold text-gray-800 flex items-center">
                   <CheckSquare className="w-4 h-4 mr-2 text-indigo-500" />
                   Tasks
               </h3>
               <button className="text-gray-400 hover:text-indigo-600"><Plus className="w-4 h-4" /></button>
           </div>
           <div className="p-4 space-y-3 flex-1 overflow-y-auto">
               <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">To-Do List</p>
               
               <div className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                   <div className="mt-1 w-4 h-4 border-2 border-gray-300 rounded hover:border-indigo-500 cursor-pointer"></div>
                   <div className="text-sm text-gray-700 leading-snug">Open <strong>Workbench</strong> app</div>
               </div>
               
               <div className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                   <div className="mt-1 w-4 h-4 border-2 border-gray-300 rounded hover:border-indigo-500 cursor-pointer"></div>
                   <div className="text-sm text-gray-700 leading-snug">Read the Case Statement carefully</div>
               </div>

               <div className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                   <div className="mt-1 w-4 h-4 border-2 border-gray-300 rounded hover:border-indigo-500 cursor-pointer"></div>
                   <div className="text-sm text-gray-700 leading-snug">Use <strong>Safari</strong> to search for facts</div>
               </div>

               <div className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                   <div className="mt-1 w-4 h-4 border-2 border-gray-300 rounded hover:border-indigo-500 cursor-pointer"></div>
                   <div className="text-sm text-gray-700 leading-snug">Use <strong>Maps</strong> to check locations</div>
               </div>

               <div className="flex items-start space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                   <div className="mt-1 w-4 h-4 border-2 border-gray-300 rounded hover:border-indigo-500 cursor-pointer"></div>
                   <div className="text-sm text-gray-700 leading-snug">Determine: <strong>TRUE</strong> or <strong>FALSE</strong>?</div>
               </div>
           </div>
       </div>
    </div>
  );
};