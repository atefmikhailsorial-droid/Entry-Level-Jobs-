
import React from 'react';
import { SearchFilters, WorkType } from '../types';
import { MA_COUNTY_MAPPING, MA_INDUSTRIES } from '../constants';

interface SearchFiltersProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isSearching: boolean;
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({ filters, onChange, onSearch, isSearching }) => {
  const workTypes = Object.values(WorkType);
  const counties = Object.keys(MA_COUNTY_MAPPING).sort();

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    if (filters.regions.length < 5 && !filters.regions.includes(value)) {
      onChange({ ...filters, regions: [...filters.regions, value] });
    }
    // Reset selection to default empty value after adding
    e.target.value = "";
  };

  const removeRegion = (region: string) => {
    onChange({ ...filters, regions: filters.regions.filter(r => r !== region) });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="keyword" className="block text-sm font-semibold text-slate-700 mb-1">
            Job Title or Keyword
          </label>
          <input
            type="text"
            id="keyword"
            placeholder="e.g. CSR, Admin, Developer"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={filters.keyword}
            onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-semibold text-slate-700 mb-1">
            Industry / Sector
          </label>
          <select
            id="industry"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={filters.industry}
            onChange={(e) => onChange({ ...filters, industry: e.target.value })}
          >
            <option value="">All Industries</option>
            {MA_INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="region" className="block text-sm font-semibold text-slate-700">
              Target Locations (Up to 5)
            </label>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {filters.regions.length}/5 Selected
            </span>
          </div>

          <select
            id="region"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-400"
            onChange={handleRegionChange}
            defaultValue=""
            disabled={filters.regions.length >= 5}
          >
            <option value="" disabled>{filters.regions.length >= 5 ? "Maximum reached" : "Add a Town, City, or County..."}</option>
            <option value="All Massachusetts">Entire Massachusetts (Statewide)</option>
            {counties.map((county) => (
              <optgroup key={county} label={`${county} County`}>
                <option value={`Entire ${county} County`} className="font-bold text-blue-600">
                  Entire {county} County
                </option>
                {MA_COUNTY_MAPPING[county].sort().map((city) => (
                  <option key={`${city}-${county}`} value={`${city} (${county} County)`}>
                    {city}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Selected Regions Tags */}
          {filters.regions.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.regions.map((region) => (
                <div 
                  key={region} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs font-bold text-blue-700 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  {region}
                  <button 
                    onClick={() => removeRegion(region)}
                    className="hover:text-red-500 transition-colors"
                    title="Remove location"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-[10px] text-slate-400 italic">No specific location selected. Defaulting to Statewide search.</p>
          )}
        </div>

        <div>
          <label htmlFor="workType" className="block text-sm font-semibold text-slate-700 mb-1">
            Work Preference
          </label>
          <select
            id="workType"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={filters.workType}
            onChange={(e) => onChange({ ...filters, workType: e.target.value as WorkType })}
          >
            {workTypes.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onSearch}
          disabled={isSearching}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
            isSearching ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95'
          }`}
        >
          {isSearching ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching Jobs...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Inclusive Jobs
            </>
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">Inclusion Check</h4>
        <p className="text-[10px] text-slate-500 leading-relaxed text-center">
          Searching 20+ active openings in {filters.regions.length === 0 ? 'Massachusetts' : filters.regions.join(', ')} posted this week.
        </p>
      </div>
    </div>
  );
};

export default SearchFiltersComponent;
