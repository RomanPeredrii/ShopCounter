"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const morgan_1 = __importDefault(require("morgan"));
app.use(morgan_1.default('dev'));
const passport_1 = __importDefault(require("passport"));
app.use(passport_1.default.initialize());
// ?????????????????????????????????????????
const passport_2 = __importDefault(require("./middleware/passport"));
passport_2.default(passport_1.default);
// ?????????????????????????????????????????
const mongoose_1 = __importDefault(require("mongoose"));
const keys_1 = require("./config/keys");
mongoose_1.default.connect(keys_1.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err.message));
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
const cors_1 = __importDefault(require("cors"));
app.use(cors_1.default());
const auth_1 = __importDefault(require("./routes/auth"));
app.use('/api/auth', auth_1.default);
const analitics_1 = __importDefault(require("./routes/analitics"));
app.use('/api/analitics', analitics_1.default);
module.exports = app;
