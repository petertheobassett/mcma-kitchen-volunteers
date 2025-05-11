import { google } from 'googleapis';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const range = '2025 Schedule of Events!A2:T1000';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    return new Response(JSON.stringify(response.data.values), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Sheet fetch error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}