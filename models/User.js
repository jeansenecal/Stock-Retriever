const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const EmailFrquencyOptions = Object.freeze({
  Daily: 'Daily',
  Weekly: 'Weekly',
  BiWeekly: 'Bi-Weekly',
  Monthly: 'Monthly'
})

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  isReceivingEmails: { type: Boolean},
  emailFrequncy : {
    type: String,
    enum: Object.values(EmailFrquencyOptions)
  },
  emailProfitabilityLimit: {type: Number},
  password: String,
  name: String,
});
Object.assign(UserSchema.statics, {
  EmailFrquencyOptions,
});

// Password hash middleware.

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
