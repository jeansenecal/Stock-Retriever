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
    validationErrors.push({msg: "Please enter a valid email address."});
  }

  if(!validator.isStrongPassword(req.body.password, {minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 0})){
    console.log('jer')
    validationErrors.push({msg: "Please enter a password with at least 8 characters, one uppercase, one number"});
  }
  if( req.body.password !== req.body.confirmPassword){
    validationErrors.push({msg: "Passwords do not match."});
  }
  if(validationErrors.length){
    console.log(validationErrors)
    req.flash("errors", validationErrors);
    return res.redirect("/signup");
  }

  req.body.email = validator.normalizeEmail(req.body.email, {gmail_remove_dots: false});

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({email: req.body.email}, (err, existingUser) => {
    if(err){
      return next(err);
    }
    if(existingUser){
      req.flash("errors", {msg: "An account with that email address already exists."});
      return res.redirect("../signup");
    }
    user.save( err => {
      if(err){
        return next(err);
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/home");
      });
    });
  });

};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/home");
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    console.log('User has logged out.');
  });
  res.redirect("/");
};
  