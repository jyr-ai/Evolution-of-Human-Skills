import { INDUSTRIAL_ERAS } from '../data/industrialErasData';
import { WEALTH_OF_NATIONS_ERAS_DATA } from '../data/wealthOfNationsData';

export interface DriveSpreadsheetFile {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface SheetTabInfo {
  sheetId: number;
  title: string;
  rowCount?: number;
  columnCount?: number;
}

export interface SpreadsheetDetails {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  sheets: SheetTabInfo[];
}

/**
 * List Google Sheets from the user's Google Drive
 */
export async function listSpreadsheets(accessToken: string): Promise<DriveSpreadsheetFile[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,webViewLink)&orderBy=modifiedTime desc&pageSize=20`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to list spreadsheets (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Fetch Spreadsheet metadata and tab list (avoids hardcoding 'Sheet1')
 */
export async function getSpreadsheetDetails(
  accessToken: string,
  spreadsheetId: string
): Promise<SpreadsheetDetails> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch spreadsheet details (${response.status})`);
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Untitled Spreadsheet',
    spreadsheetUrl: data.spreadsheetUrl,
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties?.sheetId,
      title: s.properties?.title || 'Sheet',
      rowCount: s.properties?.gridProperties?.rowCount,
      columnCount: s.properties?.gridProperties?.columnCount,
    })),
  };
}

/**
 * Fetch cell values for a given range
 */
export async function getRangeValues(
  accessToken: string,
  spreadsheetId: string,
  range: string
): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to read range values (${response.status})`);
  }

  const data = await response.json();
  return data.values || [];
}

/**
 * Append a row of data to a spreadsheet tab
 */
export async function appendRowToSheet(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  rowValues: (string | number)[]
): Promise<any> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [rowValues],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to append row (${response.status})`);
  }

  return response.json();
}

/**
 * Create a comprehensive "Evolution of Human Skills" Google Sheet in the user's Drive,
 * complete with pre-populated sheets for Skills Dossiers and Wealth of Nations data.
 */
export async function exportToGoogleSheets(
  accessToken: string,
  customTitle = 'Evolution of Human Skills - Industrial Benchmark'
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // Step 1: Create Spreadsheet with multiple tabs
  const createUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  const createPayload = {
    properties: {
      title: customTitle,
    },
    sheets: [
      { properties: { title: 'Skills Matrix (All Eras)' } },
      { properties: { title: 'Wealth of Nations GDP & Risk' } },
      { properties: { title: 'Industrial Eras Overview' } },
    ],
  };

  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create Google Sheet (${createRes.status})`);
  }

  const createdSheet = await createRes.json();
  const spreadsheetId = createdSheet.spreadsheetId;
  const spreadsheetUrl = createdSheet.spreadsheetUrl;

  // Step 2: Prepare batch update for values in all three sheets
  // Tab 1: Skills Matrix
  const skillsHeaders = [
    'Era',
    'Era Title',
    'Skill Name',
    'Category',
    'Craft Domain',
    'Peak Era Year',
    'Displacing / Enabling Technology',
    'Dexterity Level',
    'Cognitive Load',
    'Cognitive Shift / Reorganization',
    'Historical Context',
  ];

  const skillsRows: (string | number)[][] = [skillsHeaders];
  INDUSTRIAL_ERAS.forEach((era) => {
    (era.skills || []).forEach((skill) => {
      skillsRows.push([
        era.romanNumeral,
        era.title,
        skill.name,
        skill.category.toUpperCase(),
        skill.craftDomain,
        skill.workforcePrevalence?.peakEraYear || era.timeframe,
        skill.displacingOrEnablingTech,
        skill.dexterityLevel,
        skill.cognitiveLoad,
        skill.cognitiveShift,
        skill.historicalContext,
      ]);
    });
  });

  // Tab 2: Wealth of Nations Trajectories
  const nationsHeaders = [
    'Era ID',
    'Era Title',
    'Country Code',
    'Country Name',
    'Region',
    'Start Year',
    'End Year',
    'Start Tech Might (1-100)',
    'End Tech Might (1-100)',
    'Start Skill Diversity (1-100)',
    'End Skill Diversity (1-100)',
    'Start GDP per Capita ($)',
    'End GDP per Capita ($)',
    'GDP Growth %',
    'Cognitive Automation Risk %',
    'Manual Replacement Risk %',
    'Composite Exposure Index',
    'Most Vulnerable Sector',
    'Ascendant Sector',
    'Economic Mechanism & Trajectory',
    'Academic Source',
  ];

  const nationsRows: (string | number)[][] = [nationsHeaders];
  Object.entries(WEALTH_OF_NATIONS_ERAS_DATA).forEach(([eraKey, eraData]) => {
    (eraData.countries || []).forEach((country) => {
      const gdpGrowth = country.startGdpPerCapita > 0
        ? Math.round(((country.endGdpPerCapita - country.startGdpPerCapita) / country.startGdpPerCapita) * 100)
        : 0;
      nationsRows.push([
        eraKey,
        eraData.eraTitle,
        country.countryCode,
        country.countryName,
        country.region,
        country.startYear,
        country.endYear,
        country.startTechMight,
        country.endTechMight,
        country.startSkillDiversity,
        country.endSkillDiversity,
        country.startGdpPerCapita,
        country.endGdpPerCapita,
        `${gdpGrowth}%`,
        `${country.riskSummary.cognitiveReplacementRisk}%`,
        `${country.riskSummary.manualReplacementRisk}%`,
        country.riskSummary.compositeAutomationExposure,
        country.riskSummary.mostVulnerableSector,
        country.riskSummary.safestOrAscendantSector,
        country.economicMechanism,
        country.academicSource,
      ]);
    });
  });

  // Tab 3: Industrial Eras Overview
  const erasHeaders = [
    'Era Number',
    'Era Title',
    'Time Period',
    'Core Tech Shock',
    'Capital Intensity',
    'Primary Displaced Tier',
    'Primary Ascendant Tier',
    'Key Historical Quote',
    'Total Documented Skills',
  ];
  const erasRows: (string | number)[][] = [erasHeaders];
  INDUSTRIAL_ERAS.forEach((era) => {
    erasRows.push([
      era.romanNumeral,
      era.title,
      era.timeframe,
      era.coreTechShock,
      era.macroMetrics.capitalIntensity,
      era.macroMetrics.primaryDisplacedTier,
      era.macroMetrics.primaryAscendantTier,
      `"${era.keyQuote.text}" — ${era.keyQuote.author}`,
      (era.skills || []).length,
    ]);
  });

  // Step 3: Populate all tabs in one batch update
  const batchValuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`;
  const batchPayload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: "'Skills Matrix (All Eras)'!A1",
        values: skillsRows,
      },
      {
        range: "'Wealth of Nations GDP & Risk'!A1",
        values: nationsRows,
      },
      {
        range: "'Industrial Eras Overview'!A1",
        values: erasRows,
      },
    ],
  };

  await fetch(batchValuesUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batchPayload),
  });

  return { spreadsheetId, spreadsheetUrl };
}
