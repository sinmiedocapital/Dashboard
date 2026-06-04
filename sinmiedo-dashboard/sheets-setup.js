/**
 * Sin Miedo Capital — P/L Tracker Setup
 * Paste this into Extensions > Apps Script, then click Run
 */

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  ss.rename('Sin Miedo Capital · P/L Tracker')

  // Reset and create sheets
  ;['📊 Dashboard', '📝 Log', '👥 Beta Users', '🤝 Community'].forEach(n => {
    const s = ss.getSheetByName(n)
    if (s) ss.deleteSheet(s)
  })
  const dash  = ss.insertSheet('📊 Dashboard', 0)
  const log   = ss.insertSheet('📝 Log', 1)
  const beta  = ss.insertSheet('👥 Beta Users', 2)
  const comm  = ss.insertSheet('🤝 Community', 3)

  try { ss.deleteSheet(ss.getSheetByName('Sheet1')) } catch(e) {}

  buildLog(log)
  buildDashboard(dash)
  buildBeta(beta)
  buildCommunity(comm)

  dash.activate()
  SpreadsheetApp.getUi().alert(
    '✅ Sin Miedo Capital tracker is ready!\n\n' +
    'Go to 📝 Log → enter today\'s session.\n' +
    'Dashboard updates automatically.'
  )
}

/* ─── LOG SHEET ────────────────────────────────────────────── */
function buildLog(sh) {
  sh.clearContents()

  const headers = [
    'Date', 'Lucid P/L ($)', 'Tradeify P/L ($)', 'Combined P/L',
    'Total Trades', 'Winning Trades', 'Win Rate', 'Hit $2,381 Target?', 'Notes'
  ]

  // Header row
  sh.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setBackground('#0f1117')
    .setFontColor('#00e5a0')
    .setFontWeight('bold')
    .setFontSize(10)

  // Auto-calculated formulas for 200 rows
  for (let r = 2; r <= 201; r++) {
    // Combined P/L = Lucid + Tradeify
    sh.getRange(r, 4).setFormula(
      `=IF(OR(B${r}="",C${r}=""),"",B${r}+C${r})`
    )
    // Win Rate = Winning / Total
    sh.getRange(r, 7).setFormula(
      `=IFERROR(IF(OR(E${r}="",E${r}=0),"",F${r}/E${r}),"")`
    )
    // Target hit
    sh.getRange(r, 8).setFormula(
      `=IF(D${r}="","",IF(D${r}>=2381,"✅ HIT","❌ MISS"))`
    )
  }

  // Number formats
  sh.getRange('A2:A201').setNumberFormat('mm/dd/yyyy')
  sh.getRange('B2:D201').setNumberFormat('"$"#,##0;[Red]"-$"#,##0')
  sh.getRange('G2:G201').setNumberFormat('0%')

  // Conditional formatting on Combined P/L column
  const plRange = sh.getRange('D2:D201')
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(0)
      .setBackground('#162d1e').setFontColor('#00e5a0')
      .setRanges([plRange]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0)
      .setBackground('#2d1620').setFontColor('#ff3d6e')
      .setRanges([plRange]).build()
  ])

  // Column widths
  sh.setColumnWidth(1, 110)  // Date
  sh.setColumnWidth(2, 130)  // Lucid
  sh.setColumnWidth(3, 130)  // Tradeify
  sh.setColumnWidth(4, 130)  // Combined
  sh.setColumnWidth(5, 110)  // Total trades
  sh.setColumnWidth(6, 120)  // Winning trades
  sh.setColumnWidth(7, 100)  // Win rate
  sh.setColumnWidth(8, 150)  // Target
  sh.setColumnWidth(9, 300)  // Notes

  sh.setFrozenRows(1)
}

/* ─── DASHBOARD SHEET ──────────────────────────────────────── */
function buildDashboard(sh) {
  sh.clearContents()
  sh.setColumnWidth(1, 240)
  sh.setColumnWidth(2, 200)

  const L = "'📝 Log'"  // reference to Log sheet

  // ── Title ──
  row(sh, 1, 'SIN MIEDO CAPITAL  ·  P/L DASHBOARD', null,
    { bg: '#080c14', fg: '#00e5a0', bold: true, size: 14, merge: true, align: 'center' })
  rowFormula(sh, 2,
    `=TEXT(TODAY(),"MMMM YYYY")&"  ·  Daily target: $2,381  ·  Goal: $50,000"`, null,
    { bg: '#080c14', fg: '#4a5a7a', size: 10, merge: true, align: 'center' })

  // ── This Month ──
  spacer(sh, 3)
  sectionHeader(sh, 4, 'THIS MONTH')
  metricRow(sh, 5,  'Month Total P/L',
    `=SUMPRODUCT((TEXT(${L}!A2:A201,"YYYY-MM")=TEXT(TODAY(),"YYYY-MM"))*IFERROR(${L}!D2:D201,0))`,
    '"$"#,##0;[Red]"-$"#,##0')
  metricRow(sh, 6,  'Progress to $50k',
    `=IFERROR(SUMPRODUCT((TEXT(${L}!A2:A201,"YYYY-MM")=TEXT(TODAY(),"YYYY-MM"))*IFERROR(${L}!D2:D201,0))/50000,0)`,
    '0.0%')
  metricRow(sh, 7,  'Remaining to Goal',
    `=MAX(0,50000-SUMPRODUCT((TEXT(${L}!A2:A201,"YYYY-MM")=TEXT(TODAY(),"YYYY-MM"))*IFERROR(${L}!D2:D201,0)))`,
    '"$"#,##0')
  metricRow(sh, 8,  'Sessions This Month',
    `=COUNTIFS(${L}!A2:A201,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),${L}!A2:A201,"<="&EOMONTH(TODAY(),0),${L}!D2:D201,"<>")`,
    '0')
  metricRow(sh, 9,  'Days Hit Target',
    `=COUNTIFS(${L}!A2:A201,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),${L}!A2:A201,"<="&EOMONTH(TODAY(),0),${L}!D2:D201,">="&2381)`,
    '0')
  metricRow(sh, 10, 'Days Left in Month',
    '=EOMONTH(TODAY(),0)-TODAY()',
    '0')

  // ── This Week ──
  spacer(sh, 11)
  sectionHeader(sh, 12, 'THIS WEEK  (rolling 7 days)')
  metricRow(sh, 13, '7-Day P/L',
    `=SUMPRODUCT((${L}!A2:A201>=(TODAY()-6))*IFERROR(${L}!D2:D201,0))`,
    '"$"#,##0;[Red]"-$"#,##0')
  metricRow(sh, 14, 'Avg Daily P/L',
    `=IFERROR(SUMPRODUCT((${L}!A2:A201>=(TODAY()-6))*IFERROR(${L}!D2:D201,0))/COUNTIFS(${L}!A2:A201,">="&(TODAY()-6),${L}!D2:D201,"<>"),0)`,
    '"$"#,##0;[Red]"-$"#,##0')
  metricRow(sh, 15, 'Win Rate (7 days)',
    `=IFERROR(SUMPRODUCT((${L}!A2:A201>=(TODAY()-6))*IFERROR(${L}!F2:F201,0))/SUMPRODUCT((${L}!A2:A201>=(TODAY()-6))*IFERROR(${L}!E2:E201,0)),0)`,
    '0%')
  metricRow(sh, 16, 'Days Hit Target',
    `=COUNTIFS(${L}!A2:A201,">="&(TODAY()-6),${L}!D2:D201,">="&2381)`,
    '0 "of 7"')

  // ── All Time ──
  spacer(sh, 17)
  sectionHeader(sh, 18, 'ALL TIME')
  metricRow(sh, 19, 'Total P/L',
    `=IFERROR(SUM(${L}!D2:D201),0)`,
    '"$"#,##0;[Red]"-$"#,##0')
  metricRow(sh, 20, 'Overall Win Rate',
    `=IFERROR(SUM(${L}!F2:F201)/SUM(${L}!E2:E201),0)`,
    '0%')
  metricRow(sh, 21, 'Best Day',
    `=IFERROR(MAX(${L}!D2:D201),"—")`,
    '"$"#,##0')
  metricRow(sh, 22, 'Worst Day',
    `=IFERROR(MIN(${L}!D2:D201),"—")`,
    '"$"#,##0;[Red]"-$"#,##0')
  metricRow(sh, 23, 'Total Sessions',
    `=COUNTA(${L}!A2:A201)`,
    '0')

  sh.setFrozenRows(2)
}

/* ─── BETA USERS SHEET ─────────────────────────────────────── */
function buildBeta(sh) {
  sh.clearContents()
  const headers = ['Date', 'User Name', 'P/L ($)', 'Feedback']
  sh.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setBackground('#0f1117').setFontColor('#00e5a0')
    .setFontWeight('bold').setFontSize(10)
  sh.getRange('C2:C200').setNumberFormat('"$"#,##0;[Red]"-$"#,##0')
  sh.getRange('A2:A200').setNumberFormat('mm/dd/yyyy')
  sh.setColumnWidths(1, 4, 160)
  sh.setColumnWidth(4, 300)
  sh.setFrozenRows(1)
}

/* ─── COMMUNITY SHEET ──────────────────────────────────────── */
function buildCommunity(sh) {
  sh.clearContents()
  const headers = ['Date', 'Attendance', 'Session Notes']
  sh.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setBackground('#0f1117').setFontColor('#00e5a0')
    .setFontWeight('bold').setFontSize(10)
  sh.getRange('A2:A200').setNumberFormat('mm/dd/yyyy')
  sh.setColumnWidth(1, 110)
  sh.setColumnWidth(2, 110)
  sh.setColumnWidth(3, 400)
  sh.setFrozenRows(1)
}

/* ─── Helpers ──────────────────────────────────────────────── */
function row(sh, r, val, fmt, opts) {
  const range = opts.merge
    ? sh.getRange(r, 1, 1, 2).merge()
    : sh.getRange(r, 1)
  range.setValue(val)
  if (opts.bg)    range.setBackground(opts.bg)
  if (opts.fg)    range.setFontColor(opts.fg)
  if (opts.bold)  range.setFontWeight('bold')
  if (opts.size)  range.setFontSize(opts.size)
  if (opts.align) range.setHorizontalAlignment(opts.align)
  if (fmt) range.setNumberFormat(fmt)
}

function rowFormula(sh, r, formula, fmt, opts) {
  const range = opts.merge
    ? sh.getRange(r, 1, 1, 2).merge()
    : sh.getRange(r, 1)
  range.setFormula(formula)
  if (opts.bg)    range.setBackground(opts.bg)
  if (opts.fg)    range.setFontColor(opts.fg)
  if (opts.size)  range.setFontSize(opts.size)
  if (opts.align) range.setHorizontalAlignment(opts.align)
  if (fmt) range.setNumberFormat(fmt)
}

function sectionHeader(sh, r, label) {
  sh.getRange(r, 1, 1, 2).merge()
    .setValue(label)
    .setBackground('#1a1d2e').setFontColor('#4a5a7a')
    .setFontWeight('bold').setFontSize(9)
}

function spacer(sh, r) {
  sh.getRange(r, 1, 1, 2).merge().setBackground('#080c14')
}

function metricRow(sh, r, label, formula, fmt) {
  sh.getRange(r, 1).setValue(label)
    .setBackground('#0d1520').setFontColor('#6b7280').setFontSize(10)
  const val = sh.getRange(r, 2).setFormula(formula)
    .setBackground('#0d1520').setFontColor('#ccd6f6')
    .setFontWeight('bold').setFontSize(11)
  if (fmt) val.setNumberFormat(fmt)
}
