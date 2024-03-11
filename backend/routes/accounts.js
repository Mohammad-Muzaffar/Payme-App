const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const zod = require('zod');
const {Account} = require('../db/db');
const { authMiddleware } = require('../middleware/middleware');

router.get('/balance', authMiddleware, async (req,res)=>{
    const userAccount = await Account.findOne({userId: req.userId});
    res.status(200).json({
        balance : userAccount.balance
    });
});

const trasferBody = zod.object({
    to: zod.string(),
    amount: zod.number()
});

// routing for money transfer logic:
router.post('/transfer', authMiddleware, async (req,res)=>{
    // Starting the session
    const session = await mongoose.startSession();
    const {success} = trasferBody.safeParse(req.body);
    if(!success){
        session.endSession();
        return res.status(400).json({
            message: "Wrong Inputs"
        })
    }

    session.startTransaction();
    try{
        const {to, amount} = req.body;

        const account = await Account.findOne({userId: req.userId}).session(session);
        if(!account || account.balance < amount){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({userId: to}).session(session);
        if(!toAccount){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        // Transfering amount:
        await Account.updateOne({userId: req.userId}, {$inc : {balance: -amount}}).session(session);
        await Account.updateOne({userId: to}, {$inc : {balance: amount}}).session(session);

        // Commiting Transaction:
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({
            message: "Transfer successful"
        });
    } catch(err){
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
            message: "Transaction Aborted due to error" + err
        });
    }
});
module.exports = router;    