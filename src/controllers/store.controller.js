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
            succes: false,
            message: "Missing store name or address",
            payload: null
        });
    }
    try {
        const store = await storeRepository.createStore(req.body);
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