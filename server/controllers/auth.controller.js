import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import jwtGenerator from "../utils/jwtgenerator.js";
import sendEmail from "./mail.controller.js";
export const signup = async (req, res) => {
    try {
        const { name, email, mobile, password, aadharNumber, gender } = req.body;
        
        const user = await User.findOne({email});
        
        const aadharExists = await User.findOne({aadharNumber});
        const mobileExists = await User.findOne({mobile});

        if(user) return res.status(400).json({error:"User already exists"});
        else if(mobileExists) return res.status(400).json({error:"Mobile Number already exists"});
        else if(aadharExists) return res.status(400).json({error:"Aadhar Number already exists"});

        // Hash password here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${name}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${name}`;
        const statusCode = Math.floor(100000 + Math.random() * 900000);

        const newUser = new User({
            statusCode,
            name,
            email,
            mobile,
            password: hashedPassword,
            aadharNumber,
            gender,
            profilePic: gender === 'Male' ? boyProfilePic :girlProfilePic,
        })

        sendEmail(email, statusCode);
        
        if(newUser) {
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                status: newUser.status,
                name: newUser.name,
                email: newUser.email,
                aadharNumber: newUser.aadharNumber,
                gender: newUser.gender,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({error:"Invalid User Data"});
        }

    } catch(error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});
        const isMatch = await bcrypt.compare(password, user?.password || "");
        if(!user || !isMatch) return res.status(400).json({error:"Invalid Email or Password"});
        if(user.status === false) return res.status(400).json({error:"Please verify your email"});
        const token = jwtGenerator(user._id, res);
        res.status(201).json({ token: token });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error:"Internal Server Error"});        
    }
};

export const verify = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findOne({statusCode: code});
        if(!user) return res.status(400).json({error:"Invalid Code"});
        else {
            user.status = true;
            await user.save();
            res.status(201).json({message: "User verified"});
        }
    } catch (error) {
        console.log("Error in verify controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}