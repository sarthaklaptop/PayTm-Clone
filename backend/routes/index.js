// backend/user/index.js
const express = require('express');
const userRouter = require("./user");
const accountRouter = require("./account");

const router = express.Router();

router.use("/user", userRouter);
// console.log("Befort Hitting account Router")
router.use("/account", accountRouter);
// console.log("After Hitting account Router")

module.exports = router;