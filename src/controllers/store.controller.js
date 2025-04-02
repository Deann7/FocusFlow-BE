const baseResponse = require("../utils/baseResponse.utill.js");  
const storeRepository = require("../repositories/store.repository.js");

exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        baseResponse(res, true, 200, "Stores retrieved successfully", stores);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving stores", null);
    }
};

exports.createStore = async (req, res) => {
    const { name, address } = req.body;
    if (!name || !address) {
        return res.status(400).json({
            success: false,
            message: "Missing store name or address",
            payload: null
        });
    }
    try {
        const store = await storeRepository.createStore(req.body);
        const ifStoreNameExist = await storeRepository.getStoreByName(name);
        if (ifStoreNameExist) {
            return res.status(400).json({
                success: false,
                message: "Store name already exist, please use another name",
                payload: null
            });
        }
        baseResponse(res, true, 201, "Store created successfully", store);
    } catch (error) {
        console.error("❌ Error executing query:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            payload: null
        });
    }
};

exports.getStoreById = async (req, res) => {
    const { id } = req.params;
    try {
        const store = await storeRepository.getStoreById(id);
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store retrieved successfully", store);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving store", null);
    }
}

exports.updateStore = async (req, res) => {
    const { id, name, address } = req.body; 

    if (!id) {
        return baseResponse(res, false, 400, "Missing store ID", null);
    }
    if (!name || !address) {
        return baseResponse(res, false, 400, "Missing store name or address", null);
    }

    try {
        const store = await storeRepository.updateStore(id, { name, address });
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store updated successfully", store);
    } catch (error) {
        console.error("Error updating store:", error);
        baseResponse(res, false, 500, "An error occurred while updating store", null);
    }
};

exports.deleteStore = async (req, res) => {
    const { id } = req.params;
    try {
        const store = await storeRepository.deleteStore(id);
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store deleted successfully", store);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while deleting store", null);
    }
};


