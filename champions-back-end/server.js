const express = require("express");
const logger = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
var session = require("express-session");
const champion = require("./app/routes/champion");
const leads = require("./app/routes/leads");
const location = require("./app/routes/location");
const department = require("./app/routes/department");
const users = require("./app/routes/user");
var passport = require("passport");
const vote = require("./app/routes/vote");
const championOfWeek = require("./app/routes/championOfTheWeek");
const cronJob = require("./app/api/cron/nominateChampion");
var cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("./app/config/database"); //database configuration
var jwt = require("jsonwebtoken");
const app = express();
const path = require("path");
var multer = require("multer");
var multerupload = multer({ dest: "fileprint/" });

dotenv.config();
// dotenv.config({
//   path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
// });
app.use(cors());
app.set("secretKey", "nodeRestApi"); // jwt secret token
app.use(session({ secret: "session secret key" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb" }));
// connection to mongodb

mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// app.use(express.static('public'));

// viewed at http://localhost:3000

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname + '/index.html'));
// });

// public route
app.use("/api/users", users);
// private route
app.use("/api/champion", validateUser, champion);
app.use("/api/leads", validateUser, leads);
app.use("/api/vote", validateUser, vote);
app.use("/api/location", validateUser, location);
app.use("/api/department", validateUser, department);

app.use("/api/championOfWeek", validateUser, championOfWeek);
// app.get('/favicon.ico', function(req, res) {
//     res.sendStatus(204);
// });
// app.get('*', (request, response) => {
// 	response.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
cronJob.nominateChampionCron("59 23 * * 4");
// cronJob.nominateChampionCron("01 18 * * *");
console.log(process.env)
cronJob.resetVoteCountAndAddChapionOfWeek();
function validateUser(req, res, next) {
  jwt.verify(
    req.headers["x-access-token"],
    req.app.get("secretKey"),
    function (err, decoded) {
      if (err) {
        res.json({ status: "error", message: err.message, data: null });
      } else {
        // add user id to request
        req.body.userId = decoded.id;
        next();
      }
    }
  );
}
// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
// app.use(function(req, res, next) {
//  let err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
// handle errors
app.use(function (err, req, res, next) {
  console.log(err);

  if (err.status === 404) res.status(404).json({ message: "Not found" });
  else res.status(500).json({ message: "Something looks wrong :( !!!" });
});
app.listen(process.env.PORT || 3026, function () {
  console.log("Node server listening on port " + (process.env.PORT || "3026"));
});
