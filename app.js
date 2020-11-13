const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const Users = require("./models/Users");
const admin = require("./seed/admin");


require("dotenv/config");


if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// CONNECT TO DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async () => {
    await mongoose.connection.dropCollection('users', async(err, item) => {
      if(err) {
        console.log(err)
      }
      await Users.create(admin);
      console.log("Connected to DB");
    });
  }
);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
