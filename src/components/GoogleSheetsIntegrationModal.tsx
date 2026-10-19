import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  ExternalLink,
  PlusCircle,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  ArrowRight,
  LogOut,
  FolderOpen,
  Table,
  Sparkles,
  Info
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logout,
} from '../services/googleAuth';
import {
  listSpreadsheets,
  getSpreadsheetDetails,
  getRangeValues,
  appendRowToSheet,
  exportToGoogleSheets,
  DriveSpreadsheetFile,
  SpreadsheetDetails,
} from '../services/googleSheetsService';

interface GoogleSheetsIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsIntegrationModal: React.FC<GoogleSheetsIntegrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs: 'export' | 'browse' | 'append'
  const [activeTab, setActiveTab] = useState<'export' | 'browse' | 'append'>('export');

  // Export State
  const [exportTitle, setExportTitle] = useState('Evolution of Human Skills - Industrial Benchmark');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedSheet, setExportedSheet] = useState<{ id: string; url: string } | null>(null);
  const [showExportConfirm, setShowExportConfirm] = useState<boolean>(false);

  // Browse Sheets State
  const [sheetsList, setSheetsList] = useState<DriveSpreadsheetFile[]>([]);
  const [isLoadingSheets, setIsLoadingSheets] = useState<boolean>(false);
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [sheetDetails, setSheetDetails] = useState<SpreadsheetDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [selectedTabName, setSelectedTabName] = useState<string>('');
  const [previewValues, setPreviewValues] = useState<string[][]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);

  // Append Skill State
  const [newSkillEra, setNewSkillEra] = useState('era-4');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Technical Specialization');
  const [newSkillStatus, setNewSkillStatus] = useState('emergent');
  const [newSkillDriver, setNewSkillDriver] = useState('');
  const [newSkillShift, setNewSkillShift] = useState('');
  const [isAppending, setIsAppending] = useState<boolean>(false);
  const [appendSuccess, setAppendSuccess] = useState<string | null>(null);
  const [showAppendConfirm, setShowAppendConfirm] = useState<boolean>(false);

  // Error message banner
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, authToken) => {
        setUser(authUser);
        setToken(authToken);
        setAuthError(null);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch spreadsheets list once authenticated
  const loadUserSheets = async (currentToken?: string) => {
    const t = currentToken || token;
    if (!t) return;
    setIsLoadingSheets(true);
    setGeneralError(null);
    try {
      const files = await listSpreadsheets(t);
      setSheetsList(files);
      if (files.length > 0 && !selectedSheetId) {
        setSelectedSheetId(files[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching sheets:', err);
      setGeneralError(err.message || 'Failed to list Google Sheets from your Drive.');
    } finally {
      setIsLoadingSheets(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadUserSheets(token);
    }
  }, [token]);

  // Load details of selected sheet
  useEffect(() => {
    if (!token || !selectedSheetId) {
      setSheetDetails(null);
      return;
    }
    const loadDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const details = await getSpreadsheetDetails(token, selectedSheetId);
        setSheetDetails(details);
        if (details.sheets.length > 0) {
          const firstTab = details.sheets[0].title;
          setSelectedTabName(firstTab);
          loadRangeData(selectedSheetId, firstTab);
        }
      } catch (err: any) {
        console.error('Error fetching spreadsheet details:', err);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    loadDetails();
  }, [selectedSheetId, token]);

  // Load range data for preview
  const loadRangeData = async (sheetId: string, tabName: string) => {
    if (!token) return;
    setIsLoadingPreview(true);
    try {
      const values = await getRangeValues(token, sheetId, `'${tabName}'!A1:H15`);
      setPreviewValues(values);
    } catch (err) {
      console.error('Error loading preview data:', err);
      setPreviewValues([]);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        loadUserSheets(res.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setAuthError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setSheetsList([]);
    setSheetDetails(null);
    setPreviewValues([]);
    setExportedSheet(null);
  };

  const executeExport = async () => {
    if (!token) return;
    setShowExportConfirm(false);
    setIsExporting(true);
    setGeneralError(null);
    try {
      const result = await exportToGoogleSheets(token, exportTitle);
      setExportedSheet({ id: result.spreadsheetId, url: result.spreadsheetUrl });
      await loadUserSheets(token);
    } catch (err: any) {
      console.error('Export error:', err);
      setGeneralError(err.message || 'Failed to export to Google Sheets.');
    } finally {
      setIsExporting(false);
    }
  };

  const executeAppendSkill = async () => {
    if (!token || !selectedSheetId || !selectedTabName) return;
    setShowAppendConfirm(false);
    setIsAppending(true);
    setAppendSuccess(null);
    setGeneralError(null);
    try {
      const row = [
        newSkillEra.toUpperCase(),
        newSkillEra === 'era-4' ? 'AI & Cognitive Automation' : newSkillEra,
        newSkillName,
        newSkillCategory,
        new Date().getFullYear(),
        newSkillDriver || 'Custom labor transition dynamic',
        'Emergent Specialization',
        newSkillStatus === 'obsolescent' ? 'High' : 'Moderate',
        newSkillShift || 'Cognitive-physical reorganization',
        'Observed labor market shift',
      ];
      await appendRowToSheet(token, selectedSheetId, `'${selectedTabName}'!A1`, row);
      setAppendSuccess(`Added "${newSkillName}" to tab "${selectedTabName}"!`);
      setNewSkillName('');
      setNewSkillDriver('');
      setNewSkillShift('');
      // Reload preview
      await loadRangeData(selectedSheetId, selectedTabName);
    } catch (err: any) {
      console.error('Append error:', err);
      setGeneralError(err.message || 'Failed to append record to spreadsheet.');
    } finally {
      setIsAppending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0c121e] border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080d17]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                  Google Sheets Integration
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Export benchmark datasets, browse your Google Drive sheets, and append skills data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Bar */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full border border-slate-600"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="text-xs">
                <span className="text-slate-300 font-medium">Connected as </span>
                <span className="text-emerald-400 font-mono font-medium">{user.email}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Connect your Google account with permission to access and create Google Sheets.</span>
            </div>
          )}

          <div>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              /* Google Sign In Button styled as official standard */
              <button
                onClick={handleSignIn}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-medium bg-white hover:bg-slate-100 text-slate-800 rounded shadow-md transition-all active:scale-95 disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {authError && (
          <div className="mx-6 mt-3 p-3 text-xs bg-red-950/60 border border-red-800 text-red-200 rounded flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {generalError && (
          <div className="mx-6 mt-3 p-3 text-xs bg-amber-950/60 border border-amber-800 text-amber-200 rounded flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{generalError}</span>
            </div>
            <button
              onClick={() => setGeneralError(null)}
              className="text-xs text-amber-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#0a0f19] px-6">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'export'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export Benchmark Dataset
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-3 px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'browse'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Browse Drive Spreadsheets
          </button>
          <button
            onClick={() => setActiveTab('append')}
            className={`py-3 px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'append'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Append Custom Skill
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!user ? (
            <div className="text-center py-12 px-4 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">Google Sheets Integration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your Google account to export benchmark datasets across all 4 Industrial Eras directly to Google Sheets, view your existing spreadsheets, and seamlessly sync skill records.
              </p>
              <button
                onClick={handleSignIn}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-800 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google to Continue'}</span>
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: EXPORT */}
              {activeTab === 'export' && (
                <div className="space-y-6">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Database className="w-4 h-4 text-emerald-400" />
                          Export Benchmark to Google Sheets
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Creates a new spreadsheet in your Google Drive with 3 organized tabs populated with researched historical and AI-era labor data:
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-md">
                        <span className="font-mono text-emerald-400 font-semibold block mb-1">
                          1. Skills Matrix (All Eras)
                        </span>
                        <p className="text-slate-400 text-[11px]">
                          Complete dossier of obsolescent, transformed, and emergent skills with displacement drivers and cognitive/physical shifts.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-md">
                        <span className="font-mono text-emerald-400 font-semibold block mb-1">
                          2. Wealth of Nations GDP & Risk
                        </span>
                        <p className="text-slate-400 text-[11px]">
                          Country trajectory scatter data across Eras 1–4, showing tech might, skill diversification, GDP per capita, and cognitive/manual machine risks.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-md">
                        <span className="font-mono text-emerald-400 font-semibold block mb-1">
                          3. Industrial Eras Overview
                        </span>
                        <p className="text-slate-400 text-[11px]">
                          Macro-economic milestones from the First Industrial Revolution through the Cognitive Automation / AI Inversion era.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-mono uppercase text-slate-400">
                        Spreadsheet Title in Google Drive
                      </label>
                      <input
                        type="text"
                        value={exportTitle}
                        onChange={(e) => setExportTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                        placeholder="Spreadsheet title..."
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Will be created in your root Google Drive directory with private access.
                      </span>
                      <button
                        onClick={() => setShowExportConfirm(true)}
                        disabled={isExporting || !exportTitle.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isExporting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Creating Google Sheet...
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            Generate & Export to Google Sheets
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Export Success Banner */}
                  {exportedSheet && (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-600/60 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-emerald-200">
                            Spreadsheet Created Successfully!
                          </div>
                          <div className="text-xs text-emerald-400/80 font-mono">
                            ID: {exportedSheet.id}
                          </div>
                        </div>
                      </div>
                      <a
                        href={exportedSheet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shadow"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open in Google Sheets
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: BROWSE DRIVE SHEETS */}
              {activeTab === 'browse' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Your Google Drive Spreadsheets</h3>
                      <p className="text-xs text-slate-400">
                        Select a spreadsheet to inspect tabs, structure, and read live cell ranges
                      </p>
                    </div>
                    <button
                      onClick={() => loadUserSheets()}
                      disabled={isLoadingSheets}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSheets ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>

                  {isLoadingSheets ? (
                    <div className="text-center py-8 text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      Loading spreadsheets from your Google Drive...
                    </div>
                  ) : sheetsList.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-lg text-xs text-slate-400">
                      No Google Sheets found in your Google Drive. You can create one using the "Export Benchmark Dataset" tab!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Left: Files List */}
                      <div className="md:col-span-1 border border-slate-800 rounded-lg bg-slate-950/70 p-2 space-y-1 max-h-72 overflow-y-auto">
                        <span className="text-[10px] font-mono uppercase text-slate-500 px-2 py-1 block">
                          Spreadsheets ({sheetsList.length})
                        </span>
                        {sheetsList.map((file) => (
                          <button
                            key={file.id}
                            onClick={() => setSelectedSheetId(file.id)}
                            className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between gap-2 ${
                              selectedSheetId === file.id
                                ? 'bg-emerald-950/60 border border-emerald-600/60 text-emerald-200'
                                : 'hover:bg-slate-800/60 text-slate-300'
                            }`}
                          >
                            <span className="truncate">{file.name}</span>
                            <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 opacity-60" />
                          </button>
                        ))}
                      </div>

                      {/* Right: Selected Sheet Viewer */}
                      <div className="md:col-span-2 border border-slate-800 rounded-lg bg-slate-950/70 p-4 space-y-3">
                        {isLoadingDetails ? (
                          <div className="text-center py-8 text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                            Fetching spreadsheet metadata...
                          </div>
                        ) : sheetDetails ? (
                          <>
                            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                              <div>
                                <h4 className="text-sm font-semibold text-white">{sheetDetails.title}</h4>
                                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                  Tabs: {sheetDetails.sheets.map((s) => s.title).join(', ')}
                                </div>
                              </div>
                              <a
                                href={sheetDetails.spreadsheetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded transition-colors"
                              >
                                <span>Open in Sheets</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>

                            {/* Tab selector */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                              <span className="text-[10px] font-mono text-slate-500 uppercase">Tab:</span>
                              {sheetDetails.sheets.map((tab) => (
                                <button
                                  key={tab.sheetId}
                                  onClick={() => {
                                    setSelectedTabName(tab.title);
                                    if (selectedSheetId) loadRangeData(selectedSheetId, tab.title);
                                  }}
                                  className={`px-2.5 py-1 text-xs rounded font-mono transition-colors whitespace-nowrap ${
                                    selectedTabName === tab.title
                                      ? 'bg-emerald-600 text-white font-medium'
                                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                  }`}
                                >
                                  {tab.title}
                                </button>
                              ))}
                            </div>

                            {/* Cells Preview Table */}
                            <div className="mt-2 border border-slate-800 rounded overflow-x-auto max-h-52 bg-slate-900/40">
                              {isLoadingPreview ? (
                                <div className="text-center py-6 text-xs text-slate-400 font-mono">
                                  Loading cell values...
                                </div>
                              ) : previewValues.length === 0 ? (
                                <div className="text-center py-6 text-xs text-slate-400 font-mono">
                                  No data found in range A1:H15
                                </div>
                              ) : (
                                <table className="w-full text-left text-xs font-mono border-collapse">
                                  <tbody>
                                    {previewValues.map((row, rIdx) => (
                                      <tr
                                        key={rIdx}
                                        className={
                                          rIdx === 0
                                            ? 'bg-slate-950 font-bold text-emerald-400 border-b border-slate-800'
                                            : 'border-b border-slate-800/50 hover:bg-slate-800/30'
                                        }
                                      >
                                        {row.map((cell, cIdx) => (
                                          <td
                                            key={cIdx}
                                            className="px-2.5 py-1.5 truncate max-w-[140px] border-r border-slate-800/40"
                                          >
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8 text-xs text-slate-500">
                            Select a spreadsheet from the left to view contents.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: APPEND CUSTOM SKILL */}
              {activeTab === 'append' && (
                <div className="space-y-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <PlusCircle className="w-4 h-4 text-emerald-400" />
                        Append Custom Skill to Google Sheet
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Add a new historical or emergent technological skill directly to your chosen Google Sheet.
                      </p>
                    </div>

                    {/* Target Sheet and Tab Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Target Google Sheet
                        </label>
                        <select
                          value={selectedSheetId || ''}
                          onChange={(e) => setSelectedSheetId(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                        >
                          {sheetsList.length === 0 && <option value="">No sheets found</option>}
                          {sheetsList.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Target Tab
                        </label>
                        <select
                          value={selectedTabName}
                          onChange={(e) => setSelectedTabName(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                        >
                          {sheetDetails?.sheets.map((s) => (
                            <option key={s.sheetId} value={s.title}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Skill Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Skill Name
                        </label>
                        <input
                          type="text"
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          placeholder="e.g., Quantum Algorithm Auditor"
                          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Industrial Era
                        </label>
                        <select
                          value={newSkillEra}
                          onChange={(e) => setNewSkillEra(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="era-1">Era 1 (1760-1840: Steam & Mechanization)</option>
                          <option value="era-2">Era 2 (1870-1914: Electricity & Assembly)</option>
                          <option value="era-3">Era 3 (1969-2016: Computing & Digital)</option>
                          <option value="era-4">Era 4 (2017-Present: AI & Cognitive Inversion)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Category / Classification
                        </label>
                        <input
                          type="text"
                          value={newSkillCategory}
                          onChange={(e) => setNewSkillCategory(e.target.value)}
                          placeholder="e.g., Cognitive Synthesis"
                          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Automation Status
                        </label>
                        <select
                          value={newSkillStatus}
                          onChange={(e) => setNewSkillStatus(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="emergent">Emergent (Low Machine Replacement)</option>
                          <option value="transformed">Transformed (Augmented by Machine)</option>
                          <option value="obsolescent">Obsolescent (Displaced by Machine)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Displacement Driver / Catalytic Tech
                        </label>
                        <input
                          type="text"
                          value={newSkillDriver}
                          onChange={(e) => setNewSkillDriver(e.target.value)}
                          placeholder="e.g., Foundation models, automated symbolic verification, multi-agent frameworks"
                          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Cognitive vs Physical Load Shift
                        </label>
                        <input
                          type="text"
                          value={newSkillShift}
                          onChange={(e) => setNewSkillShift(e.target.value)}
                          placeholder="e.g., Shifts from routine coding to strategic goal specification and verification"
                          className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-slate-800">
                      <span className="text-xs text-slate-400">
                        Target tab: <span className="font-mono text-emerald-400">{selectedTabName || 'None'}</span>
                      </span>
                      <button
                        onClick={() => setShowAppendConfirm(true)}
                        disabled={isAppending || !newSkillName.trim() || !selectedSheetId}
                        className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isAppending ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Appending Row...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" />
                            Append Skill to Google Sheet
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {appendSuccess && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-600/60 rounded-lg flex items-center gap-2 text-xs text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{appendSuccess}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* User Confirmation Dialog for Destructive / Mutating Operation (Export) */}
        {showExportConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-[#0d1524] border border-slate-700 rounded-xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Create Google Sheet?</h4>
                  <p className="text-xs text-slate-400">Confirmation required</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                This will create a new Google Sheet named <strong className="text-emerald-400">"{exportTitle}"</strong> in your Google Drive and populate it with 3 tabs containing full skills dossiers and country trajectories.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowExportConfirm(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeExport}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors shadow"
                >
                  Confirm & Create Sheet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Confirmation Dialog for Mutating Operation (Append) */}
        {showAppendConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-[#0d1524] border border-slate-700 rounded-xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Append Row to Google Sheet?</h4>
                  <p className="text-xs text-slate-400">Confirmation required</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to append skill <strong className="text-emerald-400">"{newSkillName}"</strong> to sheet tab <strong className="text-white">"{selectedTabName}"</strong>? This will insert a new row into your Google Sheet.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowAppendConfirm(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeAppendSkill}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors shadow"
                >
                  Confirm & Append Row
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#080d17] flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Google Drive & Sheets API · Scopes Authorized</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
