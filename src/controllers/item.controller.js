const baseResponse = require("../utils/baseResponse.utill.js");  
const itemRepository = require("../repositories/item.repository.js");
const cloudinary = require("../utils/cloudinary.js");
const storeRepository = require("../repositories/store.repository.js");

exports.createItem = async (req, res) => {
    const { name, price, store_id, stock } = req.body;

    if (!name || !price || !store_id || !stock) {
        return baseResponse(res, false, 400, "Missing item information", null);
    }
    const matchedStore = await storeRepository.getStoreById(store_id);
    if (!matchedStore) {
        return baseResponse(res, false, 404, "Store not found", null);
    }

    try {
        let image_url = null;

        if (req.file) {
            image_url = await cloudinary.uploadFile(
                req.file, 
                "items"
            );
        }

        const parsedItem = {
            name,
            price: parseInt(price),
            store_id,
            image_url,
            stock: parseInt(stock)
        };

        const newItem = await itemRepository.createItem(parsedItem);
        baseResponse(res, true, 201, "Item created", newItem);

    } catch (error) {
        console.error("Controller Error:", error);
        baseResponse(res, false, 500, error.message || "Failed to create item", null);
    }
};

exports.updateItem = async (req, res) => {
    const { id, name, price, store_id, stock } = req.body;

    if (!id || !name || !price || !store_id || !stock) {
        return baseResponse(res, false, 400, "Missing item information", null);
    }
    const matchedStore = await storeRepository.getStoreById(store_id);
    if (!matchedStore) {
        return baseResponse(res, false, 404, "Store not found", null);
    }
    const matchedId = await itemRepository.getItemById(id);
    if (!matchedId) {
        return baseResponse(res, false, 404, "Item not found", null);
    }

    try {
        let image_url = null;

        if (req.file) {
            console.log("File received:", req.file); 
            image_url = await cloudinary.uploadFile(
                req.file, 
                "items"
            );
      }

        const parsedItem = {
            id,
            name,
            price: parseInt(price),
            store_id,
            image_url,
            stock: parseInt(stock)
        };

        const updatedItem = await itemRepository.updateItem(parsedItem);
        baseResponse(res, true, 200, "Item updated", updatedItem);

    } catch (error) {
        console.error("Controller Error:", error);
        baseResponse(res, false, 500, error.message || "Failed to update item", null);
    }
}

exports.getAllItems = async (req, res) => {
    try {
        const allItems = await itemRepository.getAllItems();
        baseResponse(res, true, 200, "All items", allItems);

    } catch (error) {
        console.error("Controller Error:", error);
        baseResponse(res, false, 500, error.message || "Failed to get items", null);
    }
}

exports.getItemById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return baseResponse(res, false, 400, "Missing item ID", null);
    }

    try {
        const matchedItem = await itemRepository.getItemById(id);
        if (!matchedItem) {
            return baseResponse(res, false, 404, "Item not found", null);
        }

        baseResponse(res, true, 200, "Item found", matchedItem);

    } catch (error) {
        console.error("Controller Error:", error);
        baseResponse(res, false, 500, error.message || "Failed to get item", null);
    }
}

exports.getItemByStoreId = async (req, res) => {
    const { store_id } = req.params;

    if (!store_id) {
        return baseResponse(res, false, 400, "Missing store ID", null);
    }

    try {
        const matchedItems = await itemRepository.getItemByStoreId(store_id);
        if (matchedItems.length === 0) {
            return baseResponse(res, false, 404, "Items not found", null);
        }

        baseResponse(res, true, 200, "Items found", matchedItems);

    } catch (error) {
        console.error("Controller Error:", error);
        baseResponse(res, false, 500, error.message || "Failed to get items", null);
    }
}

exports.deleteItem = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return baseResponse(res, false, 400, "Missing item ID", null);
    }

    try {
        const matchedItem = await itemRepository.getItemById(id);
        if (!matchedItem) {
            return baseResponse(res, false, 404, "Item not found", null);
        }

        const deletedItem = await itemRepository.deleteItem(id);
        baseResponse(res, true, 200, "Item deleted", deletedItem);

    } catch (error) {
        console.error("Controller Error:", error);
        baseResponse(res, false, 500, error.message || "Failed to delete item", null);
    }
}