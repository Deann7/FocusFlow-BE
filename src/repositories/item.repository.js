const db = require('../database/pg.database');

exports.createItem = async (item) => {
    try {
        const res = await db.query(
            "INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [item.name, item.price, item.store_id, item.image_url, item.stock]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error Executing query", error);
        throw error; 
    }
};

exports.updateItem = async (item) => {
    try {
        const res = await db.query(
            "UPDATE items SET name = $1, price = $2, store_id = $3, image_url = $4, stock = $5 WHERE id = $6 RETURNING *",
            [item.name, item.price, item.store_id, item.image_url, item.stock, item.id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error Executing query", error);
        throw error; 
    }
}

exports.getAllItems = async () => {
    try {
        const res = await db.query("SELECT * FROM items");
        return res.rows;
    } catch (error) {
        console.error("Error Executing query", error);
        throw error; 
    }
}

exports.getItemById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error Executing query", error);
        throw error; 
    }
}

exports.getItemByStoreId = async (store_id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE store_id = $1", [store_id]);
        return res.rows;
    } catch (error) {
        console.error("Error Executing query", error);
        throw error; 
    }
}

exports.deleteItem = async (id) => {
    try {
        const res = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error Executing query", error);
        throw error; 
    }
}