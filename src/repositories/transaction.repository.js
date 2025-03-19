const db = require("../database/pg.database.js");

exports.createTransaction = async (transaction) => {
    try {
        const res = await db.query(
            `INSERT INTO transactions (user_id, item_id, quantity, total, status) 
            SELECT $1, $2, $3, (SELECT price FROM items WHERE id = $2) * $3, $4 
            RETURNING *`,
            [transaction.user_id, transaction.item_id, transaction.quantity, transaction.status]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error Executing query", error);
    }
}

exports.payTransaction = async (id) => {
    try {
        const res = await db.query("UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error Executing query", error);
    }
}

exports.deleteTransaction = async (id) => {
    try {
        const res = await db.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error Executing query", error);
    }
}

exports.getTransactionWithData = async (id) => {
    try {
        const res = await db.query(
            `SELECT transactions.id, transactions.user_id, transactions.item_id, transactions.quantity, transactions.total, transactions.status, transactions.created_at,
            users.name as user_name, items.name as item_name, items.price as item_price
            FROM transactions
            INNER JOIN users ON transactions.user_id = users.id
            INNER JOIN items ON transactions.item_id = items.id
            WHERE transactions.id = $1`,
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error Executing query", error);
    }
}
