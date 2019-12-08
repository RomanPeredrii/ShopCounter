"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("../models/Users"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../config/keys");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const candidate = yield Users_1.default.findOne({ username: req.body.username });
        if (candidate) {
            // @ts-ignore
            const paswordOk = bcryptjs_1.default.compareSync(req.body.password, candidate.password);
            if (paswordOk) {
                const token = jsonwebtoken_1.default.sign({
                    // @ts-ignore
                    username: candidate.username,
                    userId: candidate._id
                }, keys_1.jwtString, { expiresIn: 3600 });
                res.status(200).json({ token: `Bearer ${token}` });
            }
            else {
                res.status(401).json({ message: `password incorrect, try again` });
            }
            ;
        }
        else {
            res
                .status(404)
                .json({ message: `user with name ${req.body.username} not exists` });
        }
        ;
    });
}
exports.login = login;
;
function registration(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const candidate = yield Users_1.default.findOne({ username: req.body.username });
        if (candidate) {
            res
                .status(409)
                .json({ message: `user with name ${req.body.username} exists` });
        }
        else {
            const salt = bcryptjs_1.default.genSaltSync(10);
            const user = new Users_1.default({
                username: req.body.username,
                password: bcryptjs_1.default.hashSync(req.body.password, salt)
            });
            try {
                yield user.save();
                res.status(201).json({ message: user });
            }
            catch (error) {
                res.status(500).json({ message: `internal server error` });
            }
            ;
        }
        ;
    });
}
exports.registration = registration;
;
function remove(req, res) {
    res.status(200).json({
        remove: "remove from controller auth"
    });
}
exports.remove = remove;
