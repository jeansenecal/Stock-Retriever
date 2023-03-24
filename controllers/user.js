const User = require("../models/User");
const { EmailFrquencyOptions } = require('../models/User');
const BoughtStock = require("../models/BoughtStock");
const SoldStock = require("../models/SoldStock");

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
    markStockSold: async (req, res) => {
        let stockToSell = await BoughtStock.findById(req.body._id).lean();
        
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);

        const returnDollars = req.body.currentPrice - stockToSell.boughtPrice;
        const returnPercentage = (returnDollars /  stockToSell.boughtPrice) * 100;

        const soldStock = new SoldStock({
            symbol: stockToSell.symbol,
            returnPercentage: Number.parseFloat(returnPercentage).toFixed(2),
            return: Number.parseFloat(returnDollars).toFixed(2),
            hype: stockToSell.hype,
            soldPrice: req.body.currentPrice,
            dateBought: stockToSell.dateBought,
            dateSold: today.toISOString(),
            boughtPrice: stockToSell.boughtPrice,
            user: stockToSell.user
        });
        soldStock.save();
        await BoughtStock.deleteOne({ _id: req.body._id });
        res.send("success");
    },
    deleteBoughtStock: async (req, res) => {
        let stockToRemove = await BoughtStock.findById(req.body._id).lean();
        await BoughtStock.deleteOne({ _id: req.body._id });
        res.send("success");
    }
};