const express = require("express");
const Entertainment = require("../models/Entertainment");
const router = express.Router();
const authenticateUser = require("./middleware/authentication");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const find = await Entertainment.find();

  res.json({
    message: "This is the response to the entertainment route",
    news: find,
  });
});

module.exports = router;
