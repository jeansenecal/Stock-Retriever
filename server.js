const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("express-flash");
const methodOverride = require("method-override");
const mainRoutes = require("./routes/main");
const userRoutes = require("./routes/user");
const connectDB = require("./config/database");
const user = require('./controllers/user');
const schedule = require('node-schedule');
const scrapeDayminer = require('./scheduledEvents/scrapeStocks');

//Use .env file in config folder
require('dotenv').config({ path: ".env" });

// Passport config
require("./config/passport")(passport);

app.use(cors());

//Connect To Database
connectDB();

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Using EJS for views
app.set('view engine', 'ejs');

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ client: mongoose.connection.getClient() }),
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Scrape job that occurs everyday  0 0 11 ? * MON,TUE,WED,THU,FRI *
const job = schedule.scheduleJob('0 0 * ? * *', scrapeDayminer);

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/user", userRoutes);

app.listen(process.env.PORT , () => {
    console.log("Server is running, you better catch it!");
});

