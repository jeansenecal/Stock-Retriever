const passport = require("passport");
const User = require("../models/User");

exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect("/home");
    }
    res.render("Login", {title: "Login",});
};
exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect("/home");
    }
    res.render("Signup", {title: "Create Account",});
  };
  