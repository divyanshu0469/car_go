import mongoose from "mongoose";

const publishSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    passengers : {
        type: Number,
        required: true
    },
    source: {
        type: Object,
        required: true
    },
    dest: {
        type: Object,
        required: true
    },
    vehicle: {
        type: String,
        default: null,
    }
});

publishSchema.index({userId: 1, date: 1}, { unique: true });


const Publish = mongoose.model("Publish", publishSchema);

export default Publish;