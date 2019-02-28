"use strict";

var bodyParser = require("body-parser");
const chalk = require("chalk");
var cors = require("cors");
var expect = require("chai").expect;
var express = require("express");
const helmet = require("helmet");
const internalIp = require("internal-ip");
const mongoose = require("mongoose");

var apiRoutes = require("./routes/api.js");
var fccTestingRoutes = require("./routes/fcctesting.js");
var runner = require("./test-runner");

var app = express();

// story 1: Only allow your site to be loading in an iFrame on your own pages.
// prevent being used in external iframes
app.use(helmet.frameguard({ action: "sameorigin" }));

// story 2: Do not allow DNS prefetching.

// story 3: Only allow your site to send the referrer for your own pages.
// Sets "Referrer-Policy: same-origin".
app.use(helmet.referrerPolicy({ policy: "same-origin" }));

app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route("/b/:board/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/board.html");
});
app.route("/b/:board/:threadid").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/thread.html");
});

//For api routes go to the `routes` folder!

//Index page (static HTML)
app.route("/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//Sample Front-end

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type("text")
    .send("Not Found");
});

// connect to our database
// get rid of the single-quote wrapper (for heroku)
const connectionString = process.env.MONGO_ATLAS_CONNECTION_STRING.replace(
  "'",
  ""
);

const db = mongoose.connect(connectionString, {
  useNewUrlParser: true,
  dbName: "test"
});

db.then(
  database => {
    console.log("we're connected to mongoDB!");
  },
  err => {
    console.error(err);
  }
).catch(err => {
  console.error(err);
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port " + process.env.PORT);
  console.log("localhost:");
  console.log("http://localhost:" + process.env.PORT);
  console.log("LAN:");
  console.log("http://" + internalIp.v4.sync() + ":" + process.env.PORT);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function() {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log("Tests are not valid:");
        console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for testing

// MONGO_ATLAS_CONNECTION_STRING
