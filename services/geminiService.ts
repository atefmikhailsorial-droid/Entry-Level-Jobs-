
import { GoogleGenAI, Type } from "@google/genai";
import { JobOpening, SearchFilters } from "../types";

const SYSTEM_INSTRUCTION = `You are "Entry-Level Jobs In Massachusetts", a specialized job-opening navigator.
Your mission is to find entry-level job openings across Massachusetts suitable for people with low English proficiency and people with disabilities.

MANDATORY CONTACT INFORMATION RULE:
For every job opening, you MUST provide full contact information for the Employer or HR department.
- hiringManagerName: The name of the recruiter, HR manager, or "HR Department" if specific name unavailable.
- contactEmail: A direct email address for applications or inquiries.
- contactPhone: A direct phone number for the office or hiring manager.

MANDATORY DISABILITY ACCOMMODATION RULE:
For 'accommodationContact', you MUST find and provide the specific contact information (Email/Phone/Department) for candidates who need to request a reasonable accommodation during the hiring process. This is critical for disability inclusion.

MANDATORY ADDRESS RULE:
For 'exactAddress', you MUST find and provide the specific physical street address (Street, City, MA, Zip Code) for the workplace. This will be used for Google Maps navigation.

MANDATORY APPLY LINK RULE:
For 'applyLink', you MUST provide the direct URL to the specific job opening page.

EMPLOYEE REVIEWS RULE:
For 'reviews', you MUST provide 2-3 short, authentic-sounding employee reviews summarizing common feedback about work-life balance, management, and inclusion at the company. Include a rating (1-5) and the source (e.g., "Glassdoor", "Indeed", "Employee Survey").

DIVERSITY REPUTATION & HIGHLIGHTS REPORT:
- diversityReputation: A detailed, high-quality 3-4 sentence report on the employer's history of inclusion, diversity rankings, and reputation among immigrant and disabled communities.
- diversityHighlights: Provide 3-4 specific "Highlights" or "Pillars" of their inclusion program (e.g., "ASL Certified Managers", "Multilingual Safety Signs", "Sensory-Neutral Breaks", "Successorship Training").

Job Output Requirements:
Return a JSON array of objects with the exact properties defined in the response schema.

Freshness: Active job postings from the last 14 days.`;

export async function searchJobs(filters: SearchFilters, smartQuery?: string): Promise<{ jobs: JobOpening[]; sources: any[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const regionsText = filters.regions.length > 0 
    ? filters.regions.join(', ') 
    : 'anywhere in Massachusetts (Statewide)';

  // Prioritize the Smart AI Query if provided
  const prompt = smartQuery 
    ? `ACT AS A FAST AI SEARCH TOOL. Find at least 30 active entry-level job openings in Massachusetts based on this specific user request: "${smartQuery}". 
       Focus exclusively on roles for people with limited English or disabilities. 
       Ignore structured filters if they contradict this specific natural language request.`
    : `Find at least 30 active entry-level job openings in Massachusetts for people with low English skills or disabilities.
       - Keyword/Industry: ${filters.keyword || filters.industry || 'Any Entry-Level'}
       - Locations: ${regionsText}
       - Work Type: ${filters.workType}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              positionTitle: { type: Type.STRING },
              companyName: { type: Type.STRING },
              location: { type: Type.STRING },
              exactAddress: { type: Type.STRING },
              payAndHours: { type: Type.STRING },
              hiringManagerName: { type: Type.STRING },
              contactEmail: { type: Type.STRING },
              contactPhone: { type: Type.STRING },
              accommodationContact: { type: Type.STRING },
              applyLink: { type: Type.STRING },
              diversityReputation: { type: Type.STRING },
              diversityHighlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              reviews: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    rating: { type: Type.NUMBER },
                    source: { type: Type.STRING }
                  },
                  required: ["text", "rating", "source"]
                }
              },
              inclusiveFeatures: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            },
            required: [
              "positionTitle", "companyName", "location", "exactAddress", "payAndHours", 
              "hiringManagerName", "contactEmail", "contactPhone", "accommodationContact",
              "applyLink", "diversityReputation", "diversityHighlights", "reviews"
            ]
          }
        }
      },
    });

    const jsonStr = response.text.trim();
    const jobs = JSON.parse(jsonStr) as JobOpening[];
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { jobs, sources };
  } catch (error) {
    console.error("Error searching jobs:", error);
    throw error;
  }
}
