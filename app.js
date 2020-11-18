const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

//MODELS
const Users = require("./models/Users");
const Entertainment = require("./models/Entertainment");

//ADMIN CREDENTIALS
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
const entertainmentRouter = require("./routes/entertainment");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/entertainment", entertainmentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// MAKE REQUEST TO API
const request = require("request");

const todayDate = new Date().toISOString().slice(0, 10);

const options = {
  url: `https://newsapi.org/v2/everything?q=entertainment&from=${todayDate}&to=${todayDate}&sortBy=relevancy&apiKey=${process.env.NEWS_API_KEY}`,
  method: "GET",
  headers: {
    Accept: "application/json",
    "Accept-Charset": "utf-8",
  },
};

const makeRequest = () =>
  request(options, async (err, res, body) => {
    if (err) {
      console.log(err);
    }
    let json = JSON.parse(body);
    await mongoose.connection.dropCollection("entertainments", async (err) => {
      if (err) {
        console.log(err);
      }
      await Entertainment.create({ news: json });
      console.log(`News added to DB - ${todayDate}`);
    });
  });

makeRequest();
// GET NEWS IN DB ONCE PER
var dayInMilliseconds = 1000 * 60 * 60 * 24;
setInterval(() => {
  makeRequest();
}, dayInMilliseconds);

// CONNECT TO DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async () => {
    await mongoose.connection.dropCollection("users", async (err) => {
      if (err) {
        console.log(err);
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
