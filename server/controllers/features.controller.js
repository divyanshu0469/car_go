import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import bcrypt from "bcryptjs";
import Publish from '../models/transaction.model.js';


export const setProfile = async (req, res) => {    
    const { token, name, miniBio, mobile, profilePic } = req.body;
    
    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
    const user = await User.findById(user_id);

    try {
        const response = await User.findByIdAndUpdate({_id: user_id},
            {
                name: name,
                miniBio: miniBio,
                mobile: mobile,
                profilePic: profilePic !== '' ? profilePic : user.profilePic,
            },
            { new : true },
        )
        res.status(201).json({message: "User profile updated"});

    } catch (error) {
        console.log("Error in setUser controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const getProfile = async (req, res) => {
    const { token } = req.body;
    
    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;

    try {
        const user = await User.findOne({_id: user_id});
        if(user) {
            res.status(201).json({ name: user.name, gender: user.gender, profilePic: user.profilePic, miniBio: user.miniBio, mobile: user.mobile, email: user.email });
        } else {
            res.status(400).json({error: "User not found"});
        }
    } catch(error) {
        console.log("Error in getUser controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const setAadhar = async (req, res) => {
    const { token, aadharNumber, aadharPic } = req.body;

    
    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
    const user = await User.findById(user_id);

    try {
        const response = await User.findOneAndUpdate(
            { _id: user_id },
            { 
                aadharNumber: aadharNumber,
                aadharPic: aadharPic !== '' ? aadharPic : user.aadharPic,
            },
            { new: true }
        );
        res.status(201).json({message: 'Aadhar details updated successfully'});
    } catch (err) {
        console.log("Error in setAadhar controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }

};

export const setLicense = async (req, res) => {
    const { token, licenseNumber, licensePic, vehicle } = req.body;

    
    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
    const user = await User.findById(user_id);

    try {
        const response = await User.findOneAndUpdate(
            { _id: user_id },
            { 
                licenseNumber: licenseNumber,
                licensePic: licensePic !== '' ? licensePic : user.licensePic,
                vehicle: vehicle !== '' ? vehicle : null,
            },
            { new: true }
        );
        res.status(201).json({message: 'License details updated successfully'});
    } catch (err) {
        console.log("Error in setLicense controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }

};

export const getDetails = async (req, res) => {
    const { token } = req.body;
    
    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;

    try {
        const user = await User.findOne({_id: user_id});
        if(user) {
            res.status(201).json({ user });
        } else {
            res.status(400).json({error: "User not found"});
        }
    } catch(error) {
        console.log("Error in getUser controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const changePass = async (req, res) => {
    const { token, old, newPassword } = req.body;
    
    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;

    try {
        const user = await User.findOne({_id: user_id});
        if(user) {
            const isMatch = await bcrypt.compare(old, user.password);
            
            if(!isMatch) return res.status(400).json({error:"Current Password Incorrect"});
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await User.updateOne({_id: user_id}, {$set: { password: hashedPassword }});
            res.status(201).json({success: "password updated successfully"});
        } else {
            res.status(400).json({error: "User not found"});
        }
    } catch(error) {
        console.log("Error in changePass controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const publish = async (req, res) => {
    const { token, source, dest, date, passengers } = req.body;

    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
    try {
        const user = await User.findOne({_id: user_id});

        const publish = new Publish( {
            userId: user_id,
            name: user.name,
            date,
            passengers,
            source,
            dest,
            vehicle: user.vehicle
        })

        if(publish) {
            const response = await publish.save();

            res.status(201).json({message: "Published successfully"});
        } else {
            res.status(400).json({error:"error during publish"});
        }
        
    } catch (error) {
        if(error.code === 11000) {
            res.status(400).json({error: "Ride already exists"});
            return;
        }
        console.log("Error in publish controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const search = async (req, res) => {
    const { token, source, dest, date, passengers } = req.body;

    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
    try {
        const response = await Publish.find({source: source, dest: dest, date: date, passengers: { $gte: passengers }, userId: { $ne: user_id }});

        if(response.length > 0) {
            res.status(201).json({results: response});
        } else {
            res.status(400).json({error:"No rides Found"});
        }
        
    } catch (error) {
        console.log("Error in search controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const activeRides = async (req, res) => {
    const { token } = req.body;

    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
    try {
        const response = await Publish.find({date: {$gte : new Date().toISOString().split('T')[0]}, userId: { $ne: user_id }});

        if(response.length > 0) {
            res.status(201).json({results: response});
        } else {
            res.status(400).json({error:"No rides Found"});
        }
    } catch (error) {
        console.log("Error in active Rides controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};


export const myRides = async (req, res) => {
    const { token } = req.body;

    const user_id = jwt.verify(token, process.env.JWT_SECRET).userId;
    try {
        const response = await Publish.find({date: {$gte : new Date().toISOString().split('T')[0]}, userId: user_id });

        if(response.length > 0) {
            res.status(201).json({results: response});
        } else {
            res.status(400).json({error:"No rides Found"});
        }
        
    } catch (error) {
        console.log("Error in rides controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const deleteRide = async (req, res) => {
    const id = req.params.id;
    try {
        const response = await Publish.findOneAndDelete({ _id: id });
        console.log(response);

        if(response) {
            res.status(201).json({message: "Ride deleted successfully"});
        } else {
            res.status(400).json({error:"No rides Found"});
        }
        
    } catch (error) {
        console.log("Error in delete controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};



export const getPublicProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({_id: userId});
        if(user) {
            res.status(201).json({ name: user.name, gender: user.gender, profilePic: user.profilePic, miniBio: user.miniBio, mobile: user.mobile, email: user.email });
        } else {
            res.status(400).json({error: "User not found"});
        }
    } catch(error) {
        console.log("Error in getUser controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};