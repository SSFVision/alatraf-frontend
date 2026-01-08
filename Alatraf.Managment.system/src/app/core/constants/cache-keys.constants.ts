export const CACHE_KEYS = {
  INJURY_TYPES: 'CACHE_INJURY_TYPES',
  INJURY_SIDES: 'CACHE_INJURY_SIDES',
  INJURY_REASONS: 'CACHE_INJURY_REASONS',
  MEDICAL_PROGRAMS: 'CACHE_MEDICAL_PROGRAMS',
  INDUSTRIAL_PARTS: 'INDUSTRIAL_PARTS',
    PATIENT_FORM_DRAFT: 'CACHE_PATIENT_FORM_DRAFT', 

} as const;

// Array form of all cache keys so callers can iterate and clear them on logout
export const ALL_CACHE_KEYS = Object.values(CACHE_KEYS) as string[];
