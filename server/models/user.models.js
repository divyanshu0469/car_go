import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        default: false
    },
    statusCode: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 10,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
    },
    profilePic: {
        type: String,
        default: "",
    },
    miniBio: {
        type: String,
        default: "",
    },
    aadharPic: {
        type: String,
        default: "",
    },
    aadharNumber: {
        type: Number,
        required: true,
        minlength: 12,
        maxlength: 12,
        unique: true,
    },
    licensePic: {
        type: String,
        default: "",
    },
    licenseNumber: {
        default: null,
        type: String,
        minlength: 15,
        maxlength: 15,
    },
    vehicle: {
        type: String,
        default: null,
    }
});

const User = mongoose.model("User", userSchema);

export default User;