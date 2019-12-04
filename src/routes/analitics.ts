import express from "express";
import passport from "passport";
import { getData, getPoints } from "../controllers/analitics";
const router = express.Router();

router.get(
  "/points",
  passport.authenticate('jwt', { session: false }),
  getPoints
);
router.get("/data", getData);

export default router;
