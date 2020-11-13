var express = require('express');
var router = express.Router();
const authenticateUser = require("./middleware/authentication");

/* GET users listing. */
router.get('/', authenticateUser, async(req, res, next) => {
  res.status(200).json({message: "Sign in Successfull"});
});

module.exports = router;
