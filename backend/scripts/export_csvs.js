const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
const CSV_DIR = path.join(__dirname, '../data/csv');

async function exportRemainingCsvs() {
  const host = process.env.MYSQL_HOST || 'localhost';
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'campusbuzz_db';
  const port = parseInt(process.env.MYSQL_PORT || '3306', 10);

  const conn = await mysql.createConnection({ host, user, password, database, port });

  // Export Campaigns CSV
  const [cRows] = await conn.query('SELECT * FROM campaigns');
  if (cRows.length > 0) {
    const headers = Object.keys(cRows[0]).join(',');
    const lines = cRows.map(r => Object.values(r).map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','));
    fs.writeFileSync(path.join(CSV_DIR, 'campaigns.csv'), [headers, ...lines].join('\n'), 'utf8');
    console.log('✅ Exported campaigns.csv');
  }

  // Export Events CSV
  const [eRows] = await conn.query('SELECT * FROM events');
  if (eRows.length > 0) {
    const headers = Object.keys(eRows[0]).join(',');
    const lines = eRows.map(r => Object.values(r).map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(','));
    fs.writeFileSync(path.join(CSV_DIR, 'events.csv'), [headers, ...lines].join('\n'), 'utf8');
    console.log('✅ Exported events.csv');
  }

  await conn.end();
}

exportRemainingCsvs();
