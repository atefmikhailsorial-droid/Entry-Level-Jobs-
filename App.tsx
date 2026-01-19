
import React, { useState, useCallback, useEffect } from 'react';
import { SearchFilters, JobOpening, WorkType } from './types';
import { searchJobs } from './services/geminiService';
import SearchFiltersComponent from './components/SearchFilters';
import JobCard from './components/JobCard';

const Logo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`${className} bg-white rounded-xl shadow-lg border-2 border-white overflow-hidden relative group`}>
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-110">
      {/* Background with Top Arcs */}
      <rect width="400" height="400" fill="white" />
      <path d="M0 0H400V80C400 80 300 40 200 40C100 40 0 80 0 80V0Z" fill="#D32F2F" /> {/* Red */}
      <path d="M0 0H320V60C320 60 240 30 160 30C80 30 0 60 0 60V0Z" fill="#FBC02D" /> {/* Yellow */}
      <path d="M0 0H240V40C240 40 180 20 120 20C60 20 0 40 0 40V0Z" fill="#388E3C" /> {/* Green */}
      
      {/* Bottom Blue Wave */}
      <path d="M0 280C0 280 100 250 200 250C300 250 400 280 400 280V400H0V280Z" fill="#0D47A1" />
      
      {/* Massachusetts Map Silhouette */}
      <path d="M110 150H260V170L280 190L300 180V210L280 220L270 240L240 230L220 240L180 230L150 240L110 230V150Z" fill="#1976D2" opacity="0.9" />
      
      {/* Magnifying Glass with Briefcase */}
      <circle cx="150" cy="180" r="50" fill="white" stroke="#455A64" strokeWidth="8" />
      <path d="M125 170H175V200H125V170Z" fill="#795548" rx="2" /> {/* Briefcase body */}
      <path d="M140 170V165C140 162 143 160 145 160H155C157 160 160 162 160 165V170" stroke="#5D4037" strokeWidth="3" fill="none" />
      <rect x="146" y="182" width="8" height="6" fill="#FFD54F" /> {/* Lock */}
      <line x1="115" y1="215" x2="85" y2="245" stroke="#455A64" strokeWidth="12" strokeLinecap="round" /> {/* Handle */}

      {/* Verified Location Pin */}
      <path d="M250 140C230 140 215 155 215 175C215 200 250 235 250 235C250 235 285 200 285 175C285 155 270 140 250 140Z" fill="#4CAF50" />
      <circle cx="250" cy="175" r="15" fill="white" />
      <path d="M242 175L248 181L258 171" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Logo Text Areas (Stylized) */}
      <text x="50%" y="335" textAnchor="middle" fill="white" fontSize="42" fontWeight="900" fontFamily="sans-serif">Entry-Level Jobs</text>
      <text x="50%" y="375" textAnchor="middle" fill="#FBC02D" fontSize="32" fontWeight="800" fontFamily="sans-serif">in Massachusetts</text>
    </svg>
  </div>
);

const SmartAISearch = ({ onSearch, isSearching }: { onSearch: (query: string) => void, isSearching: boolean }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <div className="mb-12 relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      <form onSubmit={handleSubmit} className="relative bg-white rounded-[1.8rem] border border-slate-200 p-2 flex flex-col md:flex-row items-center gap-2 shadow-xl shadow-slate-100/50">
        <div className="flex-1 w-full flex items-center gap-4 px-4">
          <div className="relative">
            <div className={`w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 ${isSearching ? 'animate-pulse' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {isSearching && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-bounce"></div>
            )}
          </div>
          <input 
            type="text" 
            placeholder="Fast AI Search: Type your ideal job description here..."
            className="flex-1 bg-transparent py-4 text-slate-800 font-bold text-lg placeholder:text-slate-400 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Ready</span>
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <button 
          type="submit"
          disabled={isSearching}
          className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-200/50 disabled:bg-slate-400"
        >
          {isSearching ? 'AI Thinking...' : 'Find with AI'}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start px-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Try:</span>
        {['Remote roles for blind seekers', 'Spanish speaking retail in Lawrence', 'Weekend cleaning in Brockton'].map((suggest) => (
          <button 
            key={suggest}
            onClick={() => { setQuery(suggest); onSearch(suggest); }}
            className="text-[11px] font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full border border-slate-200 transition-colors bg-white"
          >
            {suggest}
          </button>
        ))}
      </div>
    </div>
  );
};

type ViewMode = 'search' | 'saved';

const App: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    regions: [], 
    workType: WorkType.ANY,
    industry: ''
  });
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobOpening[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [sources, setSources] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSavedJobs = useCallback(() => {
    const saved = JSON.parse(localStorage.getItem('eljobs_saved_jobs') || '[]');
    setSavedJobs(saved);
  }, []);

  const handleSearch = useCallback(async (smartQuery?: string) => {
    setViewMode('search');
    setIsSearching(true);
    setError(null);
    try {
      const result = await searchJobs(filters, smartQuery);
      setJobs(result.jobs);
      setSources(result.sources);
      setHasSearched(true);
    } catch (err) {
      setError('We encountered an error while searching for job openings. Please try again.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }, [filters]);

  useEffect(() => {
    handleSearch();
    loadSavedJobs();
  }, []);

  const displayedJobs = viewMode === 'search' ? jobs : savedJobs;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-3 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setViewMode('search')}>
              <Logo className="w-14 h-14 group-hover:scale-105 transition-transform" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight cursor-pointer" onClick={() => setViewMode('search')}>
                Entry-Level Jobs Massachusetts - Atef Sorial
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Specialized Employment Navigator
                </p>
                <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
                <div className="flex items-center gap-3">
                   <a href="mailto:atefmikhailsorial@gmail.com" className="text-[10px] font-bold text-slate-500 underline hover:text-blue-600 transition-colors">
                     atefmikhailsorial@gmail.com
                   </a>
                   <a href="tel:9789021345" className="text-[10px] font-bold text-slate-500 underline hover:text-blue-600 transition-colors">
                     978-902-1345
                   </a>
                </div>
              </div>
            </div>
          </div>
          
          <nav className="flex items-center gap-4">
            <button 
              onClick={() => setViewMode('saved')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'saved' ? 'bg-pink-100 text-pink-700 shadow-inner' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              <svg className="w-4 h-4" fill={viewMode === 'saved' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Saved Jobs
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${viewMode === 'saved' ? 'bg-pink-200' : 'bg-slate-200 text-slate-700'}`}>
                {savedJobs.length}
              </span>
            </button>
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Support Status</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Active Support
              </span>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      {viewMode === 'search' && (
        <section className="bg-gradient-to-b from-blue-50 to-white pt-16 pb-12 px-6 border-b border-slate-100">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="shrink-0">
              <div className="relative">
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center p-2 border-4 border-white relative z-10 group cursor-default">
                  <div className="w-full h-full bg-blue-600 rounded-3xl flex items-center justify-center group-hover:rotate-1 transition-transform duration-500 shadow-inner overflow-hidden">
                     <Logo className="w-full h-full border-none shadow-none rounded-none bg-transparent" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 p-4 rounded-2xl shadow-xl border-4 border-white z-20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-400 rounded-full blur-[80px] opacity-20 z-0"></div>
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider mb-6">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Official Statewide Jobs Portal
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.05] tracking-tight">
                Entry-Level Jobs <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">In Massachusetts by Atef Sorial.</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
                Specialized navigation for job seekers with low English proficiency and individuals with disabilities. We bridge the gap between inclusive employers and talented candidates across the Commonwealth.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href="mailto:atefmikhailsorial@gmail.com" className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-base font-black shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
                  Request Career Support
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <a href="tel:9789021345" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl text-base font-black shadow-sm hover:border-blue-200 active:scale-95 transition-all">
                  Help Hotline: 978-902-1345
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4">
            <SearchFiltersComponent
              filters={filters}
              onChange={setFilters}
              onSearch={() => handleSearch()}
              isSearching={isSearching}
            />
            {viewMode === 'saved' && (
              <button 
                onClick={() => setViewMode('search')}
                className="mt-6 w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Search Results
              </button>
            )}
          </aside>

          <section className="lg:col-span-8">
            {viewMode === 'search' && (
              <SmartAISearch onSearch={handleSearch} isSearching={isSearching} />
            )}

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {viewMode === 'saved' ? 'Your Saved Opportunities' : (
                   isSearching ? 'Scanning for inclusive roles...' : 
                   hasSearched ? `Displaying ${jobs.length} Active Opportunities` : 'Recent Inclusive Openings'
                  )}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  {viewMode === 'saved' ? 'Review and manage the positions you have bookmarked.' : 'Verified disability-friendly and low-English entry roles.'}
                </p>
              </div>
              {viewMode === 'search' && !isSearching && jobs.length > 0 && (
                <div className="px-4 py-2 bg-blue-50 rounded-lg text-xs font-bold text-blue-600 border border-blue-100">
                  Live Feed Updated
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {isSearching ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white p-8 rounded-2xl border border-slate-200 h-64 shadow-sm">
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="h-8 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                      <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                    </div>
                  </div>
                ))
              ) : displayedJobs.length > 0 ? (
                displayedJobs.map((job, idx) => (
                  <JobCard 
                    key={job.applyLink + idx} 
                    job={job} 
                    onSavedStatusChange={loadSavedJobs}
                  />
                ))
              ) : viewMode === 'saved' ? (
                <div className="text-center py-24 bg-pink-50/30 rounded-[2.5rem] border-2 border-dashed border-pink-100">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                     </svg>
                  </div>
                  <h4 className="text-2xl font-black text-pink-900 mb-2 tracking-tight">No jobs saved yet</h4>
                  <p className="text-slate-600 max-w-sm mx-auto mb-8">
                    Bookmark interesting positions while searching to find them easily later.
                  </p>
                  <button 
                    onClick={() => setViewMode('search')}
                    className="px-6 py-2.5 bg-white border border-pink-200 rounded-xl font-bold text-pink-700 hover:bg-pink-50 transition-all shadow-sm"
                  >
                    Start Searching
                  </button>
                </div>
              ) : hasSearched ? (
                <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">No Exact Matches</h4>
                  <p className="text-slate-600 max-w-sm mx-auto mb-8">
                    Try broadening your search criteria or contact Employment Specialist Atef Sorial for direct help.
                  </p>
                  <button 
                    onClick={() => setFilters({ ...filters, keyword: '', industry: '', regions: [] })}
                    className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                 <div className="text-center py-24 bg-blue-50/30 rounded-[2.5rem] border-2 border-dashed border-blue-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Logo className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-black text-blue-900 mb-2 tracking-tight">Ready to find your path?</h4>
                    <p className="text-slate-600 max-w-sm mx-auto">
                       Select your preferred industry and region to see active inclusive roles.
                    </p>
                 </div>
              )}
            </div>

            {viewMode === 'search' && sources.length > 0 && !isSearching && (
              <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  Data Source Verification
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sources.map((chunk, i) => (
                    <a 
                      key={i}
                      href={chunk.web?.uri} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707z" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 truncate">
                        {chunk.web?.title || 'Job Listing Verification'}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-20 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
             <div className="mb-8">
               <Logo className="w-20 h-20" />
             </div>
             <p className="text-xl font-black text-slate-100 uppercase tracking-[0.1em] mb-2">
               Entry-Level Jobs Massachusetts - Atef Sorial
             </p>
             <p className="text-sm text-blue-400 font-bold max-w-lg leading-relaxed">
               A dedicated platform managed by Employment Specialist Atef Sorial to ensure equitable access to the Massachusetts workforce.
             </p>
          </div>
           
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 border-t border-slate-800 pt-16">
            <div className="flex items-center gap-5 p-6 bg-slate-800/30 rounded-3xl border border-slate-800 group hover:border-blue-900 transition-colors">
              <div className="p-4 bg-slate-800 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">Email Support</p>
                <a href="mailto:atefmikhailsorial@gmail.com" className="text-lg font-bold text-slate-200 hover:text-blue-400 transition-colors">
                  atefmikhailsorial@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-5 p-6 bg-slate-800/30 rounded-3xl border border-slate-800 group hover:border-blue-900 transition-colors">
              <div className="p-4 bg-slate-800 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1.01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">Office Line</p>
                <a href="tel:9789021345" className="text-lg font-bold text-slate-200 hover:text-blue-400 transition-colors">
                  978-902-1345
                </a>
              </div>
            </div>
          </div>
           
          <div className="text-center">
             <div className="flex items-center justify-center gap-8 mb-8">
               <div className="h-px bg-slate-800 flex-1"></div>
               <div className="flex gap-4">
                 <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                 <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                 <div className="w-2 h-2 rounded-full bg-slate-700"></div>
               </div>
               <div className="h-px bg-slate-800 flex-1"></div>
             </div>
             <p className="text-[10px] text-slate-600 leading-relaxed uppercase tracking-[0.3em]">
               &copy; 2025 Entry-Level Jobs Massachusetts - Atef Sorial • Specialized Workforce Navigation <br/>
               Inclusive Hiring • Disability Advocacy • Career Navigation
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
