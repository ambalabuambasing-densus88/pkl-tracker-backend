const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function run() {
  // Ambil URL database dari file .env secara manual
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error("Error: DATABASE_URL tidak ditemukan di .env!");
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Terhubung ke database Railway...");

    const hashedPassword = await bcrypt.hash('guru123', 10);
    const email = 'guru@pkltracker.com';
    const name = 'Guru Pembimbing';
    const role = 'GURU';

    // Query SQL yang sudah disesuaikan dengan tipe Integer Autoincrement
    const query = `
      INSERT INTO "User" (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE 
      SET name = EXCLUDED.name, password = EXCLUDED.password, role = EXCLUDED.role
      RETURNING email;
    `;

    const res = await client.query(query, [name, email, hashedPassword, role]);
    console.log('Akun Guru Berhasil Dibuat:', res.rows[0].email);

  } catch (err) {
    console.error('Gagal memasukkan data:', err.message);
  } finally {
    await client.end();
  }
}

run();