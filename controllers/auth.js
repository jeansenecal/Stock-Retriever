const passport = require("passport");
const User = require("../models/User");
const validator = require("validator");

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
exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if(!validator.isEmail(req.body.email)){
    validationErrors.push({emailError: "Please enter a valid email address."});
  }
  if(!validator.isStrongPassword(req.body.password, {minLength: 8, minUppercase: 1, minNumbers: 1})){
    validationErrors.push({passwordError: "Please enter a password with at least 8 characters, one uppercase, one number"});
  }
  if( req.body.password !== req.body.confirmPassword){
    validationErrors.push({confirmPasswordError: "Passwords do not match."});
  }
  if(validationErrors.length){
    
  }

};
  