import User from "../models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtString } from '../config/keys';

export async function login(req: any, res: any) {
  const candidate = await User.findOne({ username: req.body.username });
  if (candidate) {
    // @ts-ignore
    const paswordOk = bcrypt.compareSync(req.body.password, candidate.password);
    if (paswordOk) {     
      const token: string = jwt.sign({
        // @ts-ignore
        username: candidate.username,
        userId: candidate._id
      }, 
      jwtString, 
      {expiresIn: 3600});
      res.status(200).json({token: `Bearer ${token}`});
    } else {
      res.status(401).json({ message: `password incorrect, try again` });
    };
  } else {
    res
      .status(404)
      .json({ message: `user with name ${req.body.username} not exists` });
  };
};

export async function registration(req: any, res: any) {
  const candidate = await User.findOne({ username: req.body.username });
  if (candidate) {
    res
      .status(409)
      .json({ message: `user with name ${req.body.username} exists` });
  } else {
    const salt = bcrypt.genSaltSync(10);
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, salt)
    });
    try {
      await user.save();
      res.status(201).json({ message: user });
    } catch (error) {
      res.status(500).json({ message: `internal server error` });
    };
  };
};

export function remove(req: any, res: any) {
  res.status(200).json({
    remove: "remove from controller auth"
  });
}
