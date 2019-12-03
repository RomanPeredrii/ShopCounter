import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
    },
    host: {
        type: String,
        // required: true
    },
    database: {
        type: String,
        // required: true
    },
    port: {
        type: String,
        // required: true
    },
    departments: {
        type: Object,
        // required: true
    }
});

export default mongoose.model('users', User);