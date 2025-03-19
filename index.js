const express = require('express');
require('dotenv').config();
const db = require('./src/database/pg.database'); 
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 3000; 

const corsOptions = {
    origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    try {
    const parsedOrigin = new URL(origin);
    if (parsedOrigin.hostname === 'os.netlabdte.com') {
    callback(null, true);
    } else {
    callback(new Error('Blocked by CORS: Domain tidak diizinkan'));
    }
    } catch (err) {
    callback(new Error('Invalid origin'));
    }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE']
   };
   app.use(cors(corsOptions));


app.use(express.json());
app.use('/store', require('./src/routes/store.route'));
app.use('/user', require('./src/routes/user.route'));
app.use('/item', require('./src/routes/item.route'));
app.use('/transaction', require('./src/routes/transaction.route'));


app.post('/validate-password', (req, res) => {
    const {password} = req.body;
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:";'<>,.?/~\\-]).{8,}$/;
    if (passwordRegex.test(password)){
        return res.status(200).json({message: "Valid password"});
    } else {
        return res.status(400).json({message: "Invalid password"});
    }
}
);


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
