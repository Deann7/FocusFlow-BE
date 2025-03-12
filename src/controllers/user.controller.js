const baseResponse = require("../utils/baseResponse.utill.js");  
const userRepository = require("../repositories/user.repository.js");

exports.userRegister = async (req, res) => {
    const { name, email, password } = req.query; 
    if (!name || !email || !password) {
        return baseResponse(res, false, 400, "Missing user information", null);
    }
    try {
        const user = await userRepository.userRegister({ name, email, password, balance: 0 });
        baseResponse(res, true, 201, "User created", user);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while registering user", null);
    }
};

exports.userLogin = async (req, res) => {
    const { email, password } = req.query; 
    if (!email || !password) {
        return baseResponse(res, false, 400, "Missing email or password", null);
    }
    try {
        const user = await userRepository.userLogin(email, password);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        const passwordMatch = user.password === password;
        if (!passwordMatch) {
            return baseResponse(res, false, 401, "Password incorrect", null);
        }
        
        baseResponse(res, true, 200, "Login success", user);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while logging in", null);
    }
};

exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User retrieved successfully", user);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving user", null);
    }
};

exports.updateUser = async (req, res) => {
    const { id, name, email, password, balance } = req.body;
    if (!id){
        return baseResponse(res, false, 400, "Missing user ID", null);
    }
    if (!name || !email || !password || balance === undefined) {
        return baseResponse(res, false, 400, "Missing user information", null);
    }
    try {
        const user = await userRepository.updateUser(id, { name, email, password, balance });
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User updated successfully", user);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while updating user", null);
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userRepository.deleteUser(id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User deleted successfully", user);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while deleting user", null);
    }
};