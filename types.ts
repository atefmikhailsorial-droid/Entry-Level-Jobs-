
export interface JobOpening {
  positionTitle: string;
  companyName: string;
  location: string;
  exactAddress: string;
  payAndHours: string;
  hiringManagerName: string;
  contactEmail: string;
  contactPhone: string;
  accommodationContact: string;
  applyLink: string;
  inclusiveFeatures?: string[];
  diversityReputation: string;
  diversityHighlights: string[]; // NEW: More granular diversity info
  reviews: {
    text: string;
    rating: number; // 1-5
    source: string;
  }[];
}

export enum WorkType {
  REMOTE = 'Remote',
  HYBRID = 'Hybrid',
  ONSITE = 'On-site',
  ANY = 'Any'
}

export interface SearchFilters {
  keyword: string;
  regions: string[]; // Supports multiple selections
  workType: WorkType;
  industry: string;
}
