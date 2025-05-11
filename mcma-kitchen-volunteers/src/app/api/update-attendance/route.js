import { google } from 'googleapis';

export async function POST(req) {
  try {
    const body = await req.json();
    const { row, index, checked } = body;

    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = '2025 Schedule of Events';
    const column = 15 + index;
    const cell = `${sheetName}!${columnToLetter(column)}${row}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: cell,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[checked]],
      },
    });

    return new Response(JSON.stringify({ status: 'OK', cell }), { status: 200 });
  } catch (err) {
    console.error('❌ Google Sheets error:', err);
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
      status: 500,
    });
  }
}

function columnToLetter(col) {
  let letter = '';
  while (col > 0) {
    const mod = (col - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    col = Math.floor((col - mod) / 26);
  }
  return letter;
}