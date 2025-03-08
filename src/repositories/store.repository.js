const db = require("../database/pg.database.js");

exports.getAllStores = async () => {
    try {
    const res = await db.query("SELECT * FROM stores");
    return res.rows;
    } catch (error) {
        console.error("Error Executing query", error);
    }
};

exports.createStore = async (store) => {
    try {
    const res = await db.query(
        "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
        [store.name, store.address]
    );
    return res.rows[0];    
    } catch (error) {
    console.error("Error Executing query", error);
    }
};