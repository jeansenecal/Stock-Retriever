const User = require("../models/User");
const { EmailFrquencyOptions } = require('../models/User');

module.exports = {
    updateEmailSettings: async (req, res) => {
        try {
            const isReceivingEmails = req.body.isReceivingEmails ? true : false;
            let user = await User.findOneAndUpdate(
                {id: req.user.id}, 
                {
                    isReceivingEmails: isReceivingEmails, 
                    emailFrequncy: req.body.emailFrequncy, 
                    emailProfitabilityLimit: req.body.emailProfitabilityLimit
                },
                {returnOriginal:false}
            );
            req.user = user;
            res.redirect('/account');
        } catch (err) {
            console.log(err);
          }
    },
    updateEmail: async (req,res) =>{
        try {
            await User.findOneAndUpdate(
                {id: req.user.id}, 
                {
                    email: req.body.emailAddress
                }
            );
            res.render('Account.ejs', {title: "Account Settings", frequencyOptions: EmailFrquencyOptions});
        } catch (err) {
            console.log(err);
          }
    },
    updatePassword: async (req,res) =>{
        const passwordsMatch = req.body.password === req.body.secondPassword ? true : false;
        if(passwordsMatch){
            try {
                await User.findOneAndUpdate(
                    {id: req.user.id}, 
                    {
                        email: req.body.password
                    }
                );
                res.render('Account.ejs', {title: "Account Settings", frequencyOptions: EmailFrquencyOptions});
            } catch (err) {
                console.log(err);
              }
        }
    },
};