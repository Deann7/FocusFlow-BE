const express = require('express');
require('dotenv').config();
const db = require('./src/database/pg.database'); // Import koneksi database

const app = express();
const PORT = process.env.PORT || 3000; // Menggunakan PORT dari .env

app.use(express.json());
app.use('/store', require('./src/routes/store.route'));
app.use('/user', require('./src/routes/user.route'));


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
