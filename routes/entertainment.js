const express = require("express");
const Entertainment = require("../models/Entertainment");
const router = express.Router();
const authenticateUser = require("./middleware/authentication");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const find = await Entertainment.find();
    res.status(200).json({
      message: "This is the response to the entertainment route",
      news: find,
    });
  } catch (error) {
    res.json({ err });
  }
});

module.exports = router;
