/* ─── Constants ─────────────────────────────────────────────── */
export const STORAGE_KEY    = 'smcPLv2';
export const MONTHLY_TARGET = 50000;
export const DAILY_TARGET   = Math.round(50000 / 21); // ~$2,381

/* ─── Profile ────────────────────────────────────────────────── */
export const PROFILE_KEY = 'smcUser'

export function safeName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '_')
}

export function loadProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) } catch { return null }
}

export function saveProfile(profile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)) } catch {}
}

export function clearProfile() {
  try { localStorage.removeItem(PROFILE_KEY) } catch {}
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ─── Date ──────────────────────────────────────────────────── */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function currentYM() {
  return todayISO().slice(0, 7);
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatShortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function daysUntilMonthEnd() {
  const now  = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return Math.max(0, last.getDate() - now.getDate());
}

export function daysInMonth(yearMonth) {
  const [y, m] = yearMonth.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

export function monthName(yearMonth) {
  const [y, m] = yearMonth.split('-').map(Number);
  const names = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];
  return `${names[m - 1]} ${y}`;
}

/* ─── Formatting ────────────────────────────────────────────── */
export function fmt(n) {
  if (n === null || n === undefined) return '—';
  const abs = Math.abs(n);
  const str = abs >= 1000
    ? abs.toLocaleString('en-US', { maximumFractionDigits: 0 })
    : abs.toFixed(0);
  return n < 0 ? `-$${str}` : `$${str}`;
}

export function fmtSign(n) {
  if (n === null || n === undefined) return '—';
  const abs = Math.abs(n);
  const str = abs.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (n > 0) return `+$${str}`;
  if (n < 0) return `-$${str}`;
  return `$0`;
}

export function plColor(n) {
  if (n > 0) return '#00e5a0';
  if (n < 0) return '#ff3d6e';
  return '#4a5a7a';
}

/* ─── Storage ───────────────────────────────────────────────── */
function entriesKey(name) {
  return name ? `smcPLv2_${safeName(name)}` : STORAGE_KEY
}

export function loadEntries(name) {
  try { return JSON.parse(localStorage.getItem(entriesKey(name)) || '[]'); }
  catch { return []; }
}

export function saveEntries(entries, name) {
  try { localStorage.setItem(entriesKey(name), JSON.stringify(entries)); }
  catch {}
}

export function clearEntries(name) {
  try { localStorage.removeItem(entriesKey(name)) } catch {}
}

/* ─── Accounts (prop firms + own capital) ────────────────────── */
function accountsKey(name) { return `smcAccounts_${safeName(name)}` }

export function loadAccounts(name) {
  try { return JSON.parse(localStorage.getItem(accountsKey(name)) || '[]') } catch { return [] }
}

export function saveAccounts(accounts, name) {
  try { localStorage.setItem(accountsKey(name), JSON.stringify(accounts)) } catch {}
}

export function clearAccounts(name) {
  try { localStorage.removeItem(accountsKey(name)) } catch {}
}

export function upsertEntry(entries, newEntry) {
  const idx     = entries.findIndex(e => e.date === newEntry.date);
  const stamped = { ...newEntry, savedAt: new Date().toISOString() };
  if (idx >= 0) {
    const next = [...entries];
    next[idx] = stamped;
    return next;
  }
  return [...entries, stamped];
}

export function makeEmpty(date) {
  return {
    date,
    lucidPL:             '',
    tradeifyPL:          '',
    totalTrades:         '',
    winningTrades:       '',
    mindset:             3,
    notes:               '',
    betaUsers:           [],
    communityAttendance: '',
    communityNotes:      '',
  };
}

/* ─── Calculations ──────────────────────────────────────────── */
export function combinedPL(e) {
  return (Number(e.lucidPL) || 0) + (Number(e.tradeifyPL) || 0);
}

export function winRate(e) {
  const t = Number(e.totalTrades)   || 0;
  const w = Number(e.winningTrades) || 0;
  if (!t) return null;
  return (w / t) * 100;
}

export function monthlyTotal(entries) {
  return entries.reduce((s, e) => s + combinedPL(e), 0);
}

export function avgDailyPL(entries) {
  if (!entries.length) return 0;
  return monthlyTotal(entries) / entries.length;
}

export function overallWinRate(entries) {
  const t = entries.reduce((s, e) => s + (Number(e.totalTrades)   || 0), 0);
  const w = entries.reduce((s, e) => s + (Number(e.winningTrades) || 0), 0);
  if (!t) return null;
  return (w / t) * 100;
}

export function getMonthEntries(entries, ym) {
  return entries.filter(e => e.date && e.date.startsWith(ym));
}

export function getWeekEntries(entries) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 6);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return entries.filter(e => e.date >= cutoffStr);
}

export function bestDay(entries) {
  if (!entries.length) return null;
  return entries.reduce((b, e) => combinedPL(e) > combinedPL(b) ? e : b);
}

export function worstDay(entries) {
  if (!entries.length) return null;
  return entries.reduce((w, e) => combinedPL(e) < combinedPL(w) ? e : w);
}

export function projectedMonthly(entries) {
  if (!entries.length) return null;
  const avg      = avgDailyPL(entries);
  const daysLeft = daysUntilMonthEnd();
  return monthlyTotal(entries) + avg * daysLeft;
}

export function currentStreak(entries) {
  if (!entries.length) return 0;
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const e of sorted) {
    if (combinedPL(e) >= DAILY_TARGET) streak++;
    else break;
  }
  return streak;
}
