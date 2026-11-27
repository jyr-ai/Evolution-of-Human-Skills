// Google Sheets sync signs visitors in with broad Drive/Sheets scopes. Keep it
// off for the public site; enable with VITE_ENABLE_SHEETS=true for internal use.
export const SHEETS_ENABLED = import.meta.env.VITE_ENABLE_SHEETS === 'true';

// Where the host site lives; used for the "back to research" bar.
export const SITE_URL = 'https://www.datadiplomats.org';
export const RESEARCH_URL = `${SITE_URL}/research`;
