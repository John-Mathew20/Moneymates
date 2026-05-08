const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const userController = require("../controller/UserController");

router.get("/home", userController.home);

module.exports = router;
