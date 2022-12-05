const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const mainRoutes = require("./routes/main");
const connectDB = require("./config/database");


//Use .env file in config folder
require('dotenv').config({ path: "./config/.env" });

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

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);

app.listen(process.env.PORT , () => {
    console.log("Server is running, you better catch it!");
});

