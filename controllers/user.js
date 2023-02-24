const User = require("../models/User");
const { EmailFrquencyOptions } = require('../models/User');

module.exports = {
    updateEmailSettings: async (req, res) => {
        try {
            console.log(req.body);
            const isReceivingEmails = req.body.isReceivingEmails ? true : false;
            await User.findOneAndUpdate(
                {id: req.user.id}, 
                {
                    isReceivingEmails: isReceivingEmails, 
                    emailFrequncy: req.body.emailFrequncy, 
                    emailProfitabilityLimit: req.body.emailProfitabilityLimit
                }
            );
            res.render('Account.ejs', {title: "Account Settings", frequencyOptions: EmailFrquencyOptions});
        } catch (err) {
            console.log(err);
          }
    },
};