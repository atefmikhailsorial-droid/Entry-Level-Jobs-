
import React, { useState, useEffect } from 'react';
import { JobOpening } from '../types';
import ContactModal from './ContactModal';

interface JobCardProps {
  job: JobOpening;
  onSavedStatusChange?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onSavedStatusChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('eljobs_saved_jobs') || '[]');
    const exists = savedJobs.some((j: JobOpening) => j.applyLink === job.applyLink);
    setIsSaved(exists);
  }, [job.applyLink]);

  const toggleSave = () => {
    const savedJobs = JSON.parse(localStorage.getItem('eljobs_saved_jobs') || '[]');
    let newSavedJobs;
    if (isSaved) {
      newSavedJobs = savedJobs.filter((j: JobOpening) => j.applyLink !== job.applyLink);
    } else {
      newSavedJobs = [...savedJobs, job];
    }
    localStorage.setItem('eljobs_saved_jobs', JSON.stringify(newSavedJobs));
    setIsSaved(!isSaved);
    if (onSavedStatusChange) onSavedStatusChange();
  };

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.exactAddress)}`;

  const handleShare = async () => {
    const shareData = {
      title: `${job.positionTitle} at ${job.companyName}`,
      text: `Check out this inclusive entry-level job opening in Massachusetts: ${job.positionTitle} at ${job.companyName}. Curated for accessibility and inclusion.`,
      url: job.applyLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      const subject = encodeURIComponent(`Job Opportunity: ${job.positionTitle} at ${job.companyName}`);
      const body = encodeURIComponent(`Check out this job opening I found on the Entry-Level Jobs Massachusetts portal:\n\nPosition: ${job.positionTitle}\nCompany: ${job.companyName}\nLocation: ${job.location}\n\nApply here: ${job.applyLink}\n\nThis role was curated for inclusion and accessibility.`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 p-6 mb-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
        <div className="flex-1">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider border border-blue-100">
                {job.location.includes('Remote') ? 'Remote' : job.location.includes('Hybrid') ? 'Hybrid' : 'On-site'}
              </span>
              {job.inclusiveFeatures?.map((feature, i) => (
                <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md uppercase tracking-wider border border-emerald-100">
                  {feature}
                </span>
              ))}
            </div>
            
            <button 
              onClick={toggleSave}
              className={`p-2 rounded-xl transition-all ${isSaved ? 'bg-pink-50 text-pink-600 border border-pink-100' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:text-pink-400 hover:bg-pink-50'}`}
              title={isSaved ? "Remove from Saved" : "Save Job"}
            >
              <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
            {job.positionTitle}
          </h3>
          <p className="text-xl font-bold text-slate-600 mb-4">{job.companyName}</p>

          {/* Employer Diversity & Reputation Report - RELOCATED TO FOLLOW COMPANY SECTION */}
          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-emerald-600 rounded text-white shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Diversity & Reputation Report</h4>
              </div>
              
              <div className="mb-4">
                <p className="text-[14px] font-black text-emerald-950 leading-relaxed">
                  "{job.diversityReputation}"
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.diversityHighlights?.map((highlight, i) => (
                  <div key={i} className="flex items-center gap-2 px-2.5 py-1 bg-white/80 rounded-lg border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wide">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-slate-600">{job.location}</span>
              </div>
              
              <div className="pl-11">
                <a 
                  href={mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  title="Open in Google Maps"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {job.exactAddress}
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-700">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-sm">{job.payAndHours}</span>
            </div>
          </div>

          {/* Employee Reviews Section */}
          <div className="mb-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              Employee Feedback
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.reviews.map((review, i) => (
                <div key={i} className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 relative">
                  <div className="flex justify-between items-center mb-2">
                    {renderStars(review.rating)}
                    <span className="text-[9px] font-black text-slate-400 uppercase bg-white px-2 py-0.5 rounded border border-slate-100">
                      {review.source}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information Box */}
          <div className="mb-6 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
            <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Direct Hiring Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] text-blue-600 font-bold uppercase mb-0.5">Contact Name</p>
                <p className="text-sm font-bold text-slate-800">{job.hiringManagerName}</p>
              </div>
              <div>
                <p className="text-[10px] text-blue-600 font-bold uppercase mb-0.5">Email Address</p>
                <a href={`mailto:${job.contactEmail}`} className="text-sm font-bold text-blue-700 hover:underline block truncate">
                  {job.contactEmail}
                </a>
              </div>
              <div>
                <p className="text-[10px] text-blue-600 font-bold uppercase mb-0.5">Phone Number</p>
                <p className="text-sm font-bold text-slate-800">{job.contactPhone}</p>
              </div>
            </div>
          </div>

          {/* Accommodation Contact Section */}
          <div className="mb-6 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-4">
            <div className="p-2.5 bg-indigo-100 rounded-full text-indigo-700 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-1">Reasonable Accommodation Support</h4>
              <p className="text-sm font-bold text-slate-800 mb-1">Need help with the application process?</p>
              <p className="text-sm text-indigo-800 bg-white/50 px-3 py-2 rounded-lg border border-indigo-100 inline-block">
                <span className="font-black">Contact:</span> {job.accommodationContact}
              </p>
            </div>
          </div>

          {/* Direct Hyperlink Section */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Job Application URL</p>
              <a 
                href={job.applyLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-bold text-blue-600 hover:text-blue-800 underline break-all"
              >
                {job.applyLink}
              </a>
            </div>
          </div>
        </div>
        
        {/* Application Action */}
        <div className="flex flex-col gap-3 w-full lg:w-48 lg:sticky lg:top-0">
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex justify-center items-center px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-100 hover:shadow-blue-200 text-sm"
          >
            Apply Directly
            <svg className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex justify-center items-center px-6 py-4 bg-[#FBC02D] hover:bg-[#F9A825] text-slate-900 font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-100 text-sm"
          >
            Message Atef
          </button>

          <button 
            onClick={handleShare}
            className="flex justify-center items-center px-6 py-4 bg-[#388E3C] hover:bg-[#2E7D32] text-white font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-100 text-sm gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share this Job
          </button>

          <button 
            onClick={() => {
              navigator.clipboard.writeText(job.applyLink);
              alert("Application link copied to clipboard!");
            }}
            className="flex justify-center items-center px-6 py-4 bg-[#795548] hover:bg-[#5D4037] text-white font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-stone-100 text-sm"
          >
            Copy Link
          </button>
        </div>
      </div>

      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={job.positionTitle}
        specialistEmail="atefmikhailsorial@gmail.com"
      />
    </div>
  );
};

export default JobCard;
