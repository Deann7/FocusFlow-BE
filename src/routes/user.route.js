const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.delete('/:id', userController.deleteUser);
router.get('/:id', userController.getUserById);


module.exports = router;
