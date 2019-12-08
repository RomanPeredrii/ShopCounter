"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
    },
    database: {
        type: String,
    },
    port: {
        type: String,
    },
    departments: {
        type: Object,
    }
});
exports.default = mongoose_1.default.model('users', User);
