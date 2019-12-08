"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const analitics_1 = require("../controllers/analitics");
const router = express_1.default.Router();
router.get("/points", passport_1.default.authenticate('jwt', { session: false }), analitics_1.getPoints);
router.get("/data", analitics_1.getData);
exports.default = router;
