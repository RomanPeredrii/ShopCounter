"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = process.env.PORT || 3000;
const app = express_1.default();
app.get('/', (param) => 
//@ts-ignore
param.res.status(200).
    json({
    message: 'Running'
}));
app.listen(PORT, () => console.log(`Using ${PORT} port`));
