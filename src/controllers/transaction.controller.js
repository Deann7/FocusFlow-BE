const baseResponse = require("../utils/baseResponse.utill.js");  
const transactionRepository = require("../repositories/transaction.repository.js");
const itemRepository = require("../repositories/item.repository.js");
const userRepository = require("../repositories/user.repository.js");


exports.createTransaction = async (req, res) => {
    const {item_id, user_id, quantity} = req.body;
    if (!item_id || !user_id || !quantity) {
        return baseResponse(res, false, 400, "Missing transaction information", null);
    }
    if(quantity <= 0) {
        return baseResponse(res, false, 400, "You need more than one quantity", null);
    }
    const matchedItem = await itemRepository.getItemById(item_id);
    if (!matchedItem) {
        return baseResponse(res, false, 404, "Item not found", null);
    }
    const matchedUser = await userRepository.getUserById(user_id);
    if (!matchedUser) {
        return baseResponse(res, false, 404, "User not found", null);
    }

    try {
        const transaction = await transactionRepository.createTransaction({
            item_id,
            user_id,
            quantity,
            status: "pending" 
        });
        baseResponse(res, true, 201, "Transaction created", transaction);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while creating transaction", null);
    }
}

exports.payTransaction = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return baseResponse(res, false, 400, "Missing transaction ID", null);
    }

    try {
        const transactionData = await transactionRepository.getTransactionWithData(id);
        if (!transactionData) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }

        if (transactionData.status === "paid") {
            return baseResponse(res, false, 400, "Transaction already paid", null);
        }

        if (transactionData.quantity > transactionData.item_stock) {
            return baseResponse(res, false, 400, "Not enough stock", null);
        }

        if (transactionData.total > transactionData.user_balance) {
            return baseResponse(res, false, 400, "Not enough balance", null);
        }
        const updatedItemStock = transactionData.item_stock - transactionData.quantity;
        const updatedItem = await itemRepository.updateItem(transactionData.item_id, { stock: updatedItemStock });

        if (!updatedItem) {
            return baseResponse(res, false, 500, "Failed to update item stock", null);
        }
        const updatedTransaction = await transactionRepository.payTransaction(id);

        baseResponse(res, true, 200, "Transaction paid", {
            transaction: updatedTransaction,
            updatedItem,
        });
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while paying transaction", null);
    }
};


exports.deleteTransaction = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return baseResponse(res, false, 400, "Missing transaction ID", null);
    }
    try {
        const transaction = await transactionRepository.deleteTransaction(id);
        const matchedTransactionID = await transactionRepository.getTransactionWithData(id);
        if (!matchedTransactionID) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        baseResponse(res, true, 200, "Transaction deleted", transaction);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while deleting transaction", null);
    }
}