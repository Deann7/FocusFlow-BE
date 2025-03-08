require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Menggunakan URL dari .env
    ssl: {
        rejectUnauthorized: false, // Untuk koneksi ke Neon Database
    },
});

// Fungsi untuk menghubungkan ke database
const connect = async () => {
    try {
        await pool.connect();
        console.log("✅ Connected to PostgreSQL (Neon Database)");
    } catch (error) {
        console.error("❌ Error connecting to PostgreSQL:", error.message);
    }
};

connect();

// Fungsi untuk menjalankan query
const query = async (text, params) => {
    try {
        const res = await pool.query(text, params);
        return res;
    } catch (error) {
        console.error("❌ Error executing query:", error.message);
    }
};

module.exports = {
    query,
};
