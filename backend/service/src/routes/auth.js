//LA ROUTE AUTH è quella che si occupa di gestire il post del login

const express = require("express");
const router = express.Router();
const paths = require("../../config/paths");
//const { loginController } = require("../controllers/authController"); //importo il file auth controller che sviluppa la logica del login
const { loginController } = require(paths.CONTROLLERS + "/authController");
router.post("/login", loginController);

module.exports = router;