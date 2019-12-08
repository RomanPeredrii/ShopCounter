"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getData(req, res) {
    res.json({
        login: "getData from controller analitics"
    });
}
exports.getData = getData;
function getPoints(req, res) {
    res.json({
        overview: "getPoints from controller analitics"
    });
}
exports.getPoints = getPoints;
