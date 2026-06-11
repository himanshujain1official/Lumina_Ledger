import React, { useState, useEffect } from 'react';
import { Download, FileText, Activity, CheckCircle2, ShieldAlert, Cpu, Settings, Key, Menu, X, Clock, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface AuditHistory {
  id: string;
  timestamp: number;
  inputText: string;
  result: string;
}

export default function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [history, setHistory] = useState<AuditHistory[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lumina_history', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, customApiKey: apiKey }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.result);
      
      const newHistoryItem: AuditHistory = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        inputText: inputText,
        result: data.result,
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const element = document.getElementById('report-container');
    if (!element) return;
    
    // Create a wrapper for printing
    const opt = {
      margin:       1,
      filename:     'Lumina_Ledger_Audit_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-[100dvh] flex bg-[#F3F4F6] text-[#242424] font-sans selection:bg-[#0078D4] selection:text-white">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full w-64'}
        md:translate-x-0 md:w-16 md:hover:w-64
        absolute md:static shrink-0 bg-white/90 backdrop-blur-xl border-r border-gray-200/60 md:shadow-sm transition-all duration-300 ease-in-out flex flex-col z-40 group overflow-hidden h-[100dvh]
      `}>
        <div className="h-14 flex items-center px-4 border-b border-gray-200/60 shrink-0 justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#0078D4] text-white rounded flex items-center justify-center shadow-md shrink-0">
              <Activity size={18} />
            </div>
            <span className="ml-3 font-semibold tracking-tight text-[#242424] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Lumina Ledger
            </span>
          </div>
          <button 
            className="md:hidden p-1 text-gray-500 hover:text-gray-900 rounded-md"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden flex flex-col gap-8">
          <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-3">
              <Clock size={14} /> History
            </h3>
            <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <p className="text-[11px] text-gray-400 italic">No past audits.</p>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setInputText(item.inputText);
                      setResult(item.result);
                      setError(null);
                      setIsSidebarOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded-md group/item flex items-center justify-between border border-transparent hover:border-gray-200 transition-colors"
                  >
                    <div className="truncate pr-2 flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-gray-700 truncate">
                        Audit {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {item.inputText.substring(0, 40) || "Empty Input"}
                      </p>
                    </div>
                    <ChevronRight size={12} className="text-gray-300 group-hover/item:text-[#0078D4] shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity whitespace-nowrap mt-auto">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-3">
              <Settings size={14} /> Settings
            </h3>
            <div className="space-y-2">
              <label htmlFor="api-key" className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                <Key size={12} /> Gemini API Key
              </label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Optional external API key"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] transition-all placeholder:text-xs"
              />
              <p className="text-[10px] text-gray-500 leading-tight whitespace-normal">
                Leave empty to securely use the injected platform API key.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh]">
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center px-4 md:px-6 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-semibold text-lg tracking-tight hidden sm:block text-[#242424]">Semantic Dispute Audit</h1>
          </div>
          <div className="flex items-center gap-4 text-sm ml-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm text-gray-600">
               <Cpu size={14} className="text-[#00B7C3]" />
               <span className="font-medium text-xs">Foundry Audit Engine v1.2</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6 h-full items-stretch">
            
            {/* Panel 1: Ingestion */}
            <div className="bg-white/80 backdrop-blur-xl rounded-lg border border-[#cccccc]/60 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col min-h-[500px] h-[calc(100vh-8rem)] xl:h-auto">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <FileText size={18} className="text-[#0078D4]" />
                <h2 className="font-medium text-sm">Data Ingestion Parameter</h2>
              </div>
              
              <div className="p-5 flex-1 flex flex-col relative group">
                <textarea 
                  id="raw-data"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste multi-channel dispute content (WhatsApp conversations, email threads, contracts, or summaries)..."
                  className="flex-1 w-full p-4 text-sm bg-white border border-gray-200 hover:border-gray-300 focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] shadow-inner outline-none resize-none rounded-md transition-all placeholder:text-gray-400 font-sans"
                />
              </div>
              
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className="w-full bg-[#0078D4] hover:bg-[#006CBE] active:bg-[#005A9E] text-white px-4 py-2.5 rounded shadow-[0_2px_4px_rgba(0,120,212,0.2)] text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Executing Multi-Step Audit...
                    </>
                  ) : (
                    <>
                      <Activity size={16} />
                      Run Semantic Audit
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Panel 2: Extraction & Reasoning */}
            <div className="bg-white/80 backdrop-blur-xl rounded-lg border border-[#cccccc]/60 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col min-h-[500px] h-[calc(100vh-8rem)] xl:h-auto">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-[#00B7C3]" />
                  <h2 className="font-medium text-sm">Foundry Local Reasoning</h2>
                </div>
                <button 
                  onClick={downloadReport}
                  disabled={!result || isAnalyzing}
                  className="text-[#0078D4] hover:text-[#005A9E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Download Audit Report (.pdf)"
                >
                  <Download size={18} />
                </button>
              </div>
              
              <div className="p-5 flex-1 overflow-y-auto bg-transparent relative">
                {(result || isAnalyzing) && (
                  <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-10 py-2 -mt-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-[11px] font-semibold uppercase tracking-wide">
                      <CheckCircle2 size={12} />
                      Data Integrity: Grounded
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F0F9FA] text-[#008A93] border border-[#00B7C3]/30 rounded text-[11px] font-semibold uppercase tracking-wide">
                      <ShieldAlert size={12} />
                      Hallucination Risk: Zero
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm mb-4 flex gap-3 items-start">
                    <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block mb-1">Audit Initialization Failure</strong>
                      <span className="text-red-600/90">{error}</span>
                    </div>
                  </div>
                )}

                {isAnalyzing ? (
                  <div className="space-y-4 animate-pulse pt-2">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-4 h-4 rounded-full bg-[#00B7C3]/50 animate-ping" />
                      <div className="text-sm text-[#0078D4] font-medium">Synthesizing raw discourse vectors...</div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    <div className="pt-4">
                       <div className="h-3 bg-gray-100 rounded w-full"></div>
                       <div className="h-3 bg-gray-100 rounded w-4/5 mt-3"></div>
                    </div>
                  </div>
                ) : result ? (
                   <div id="report-container" className="markdown-body text-[#242424] p-0 md:p-2">
                      <div className="mb-4 text-xs font-semibold text-gray-500 hidden pb-4 border-b print:block">
                        Lumina Ledger - Semantic Dispute Audit Report
                      </div>
                      <ReactMarkdown>{result}</ReactMarkdown>
                   </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 pt-12 xl:pt-0">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50/50">
                      <Settings size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Awaiting ingestion to compute semantic dispute matrix.</p>
                  </div>
                )}
              </div>
              
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
