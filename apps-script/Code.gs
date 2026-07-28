const SHEET_NAME = '評量紀錄';

/**
 * 將網頁送來的單次評量成果寫入目前綁定的 Google 試算表。
 * 部署前請先在 Apps Script 專案中建立或綁定一份試算表。
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const sheet = getSheet_();
    ensureHeader_(sheet);

    sheet.appendRow([
      new Date(),
      data.code || '',
      Number(data.score || 0),
      Number(data.correct || 0),
      Number(data.wrong || 0),
      Number(data.total || 0),
      data.startedAt || '',
      data.completedAt || '',
      JSON.stringify(data.records || [])
    ]);

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function doGet() {
  return json_({ ok: true, message: '水陸小高手評量紀錄服務正常' });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '接收時間',
      '班級座號代碼',
      '總分',
      '答對題數',
      '答錯題數',
      '總題數',
      '開始時間',
      '完成時間',
      '每題明細（JSON）'
    ]);
    sheet.setFrozenRows(1);
  }
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
