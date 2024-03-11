const express = require('express');
const zod = require('zod');
const {User, Account} = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {JWT_SECRET} = require("../config");
const {authMiddleware} = require('../middleware/middleware')
const router = express.Router();

const signupBody = zod.object({
    username : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string().min(6)
});
 
router.post('/signup', async (req, res) => {
    // Middleware to check inputs.
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Salt rounds = 10

        // Creating user in DB with hashed password
        const user = await User.create({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        const userId = user._id;
        // Giving random balance to user when signup
        const userAccount = await Account.create({
            userId
        });

        // Sending Jwt token.
        const token = jwt.sign({ userId }, JWT_SECRET);
        res.status(200).json({
            message: "User created successfully",
            token: token
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6)
});

router.post('/signin', async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(411).json({
                message: "Error while logging in"
            });
        }

        // Matching hashed password.
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(411).json({
                message: "Incorrect password"
            });
        }


        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        // Debugging: Print the generated token
        
        res.status(200).json({
            token: token
        });
    } catch (error) {
        console.error("Error Login user:", error);
        res.status(411).json({
            message: "Error while logging in"
        });
    }
});

const updateBody = zod.object({
    password: zod.string().min(6).optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

router.put('/', authMiddleware, async (req,res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Error while updating information"
        })
    } else{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
    }
    const updatedUser = await User.findOneAndUpdate({_id: req.userId}, req.body);
    res.status(200).json({
        message: "Updated successfully"
    })
});

router.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    try {
        // Use projection to limit the fields returned by the query
        const users = await User.find({
            $or: [{
                firstName: {
                    "$regex": filter,
                    "$options": 'i'
                }
            }, {
                lastName: {
                    "$regex": filter,
                    "$options": 'i'
                }
            }]
        }, {
            username: 1,
            firstName: 1,
            lastName: 1,
            _id: 1
        }).limit(10); // Limit the number of results

        // If you need to exclude the current user from the results, you can do it here
        const filteredUsers = users.filter(user => user._id.toString() !== req.userId);

        res.json({
            user: filteredUsers.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/me", authMiddleware, async (req,res) => {
    try{
        const id = req.userId;
        if(!id){
            return res.status(403).json({
                message : "Not logged in"
            });
        }
        const user = await User.findOne({_id: req.userId});
        if(!user){
            return res.status(400).json({
                message : "User details not found"
            });
        }
        res.status(200).json({
            firstName : user.firstName,
            lastName: user.lastName,
            username: user.username
        });
    } catch(err){
        console.error('Error fetching user detail:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;