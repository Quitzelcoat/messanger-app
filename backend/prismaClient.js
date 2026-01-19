import pg from 'pg';
const { Client } = pg;

// 1. Disable SSL check globally for this test
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const client = new Client({
  user: 'messanger-app',
  password: 'npg_K4ybOrwUog6d',
  host: 'ep-hidden-feather-ahzd8tag.c-3.us-east-1.pg.koyeb.app',
  database: 'koyebdb',
  port: 5432,
  ssl: true, // Keep SSL on, but we've disabled the verification above
  // 2. THIS IS THE KEY: Manually passing the endpoint to the proxy
  connectionTimeoutMillis: 10000,
  options: `--endpoint=ep-hidden-feather-ahzd8tag`,
});

async function ultimateTest() {
  try {
    console.log('🛠️ Attempting manual routing connection...');
    await client.connect();
    console.log('✅ FINALLY CONNECTED!');
    const res = await client.query('SELECT current_database();');
    console.log('You are connected to:', res.rows[0].current_database);
    await client.end();
  } catch (err) {
    console.error('❌ STILL BLOCKED.');
    console.error('Error Detail:', err.message);
    console.log(
      "\nIf it says 'database does not exist', change 'koyebdb' to 'postgres' in the script.",
    );
  }
}

ultimateTest();
