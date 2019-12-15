<<<<<<< HEAD
import User from "../models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtString } from "../config/keys";
import ErrorHandler from '../utils/errors';


export async function login(req: any, res: any) {
  try {
    const candidate = await User.findOne({ username: req.body.username });
    if (candidate) {
      // @ts-ignore
      const paswordOk = bcrypt.compareSync(req.body.password, candidate.password);
      if (paswordOk) {
        const token: string = jwt.sign(
          {
            // @ts-ignore
            username: candidate.username,
            userId: candidate._id
          },
          jwtString,
          { expiresIn: 3600 }
        );
        res.status(200).json({ token: `Bearer ${token}` });
      } else new ErrorHandler(res, { message: `password incorrect`, status: 401 });
    } else new ErrorHandler(res, { message: `user with name ${req.body.username} doesn't exist`, status: 404 });
  } catch (e) { new ErrorHandler(res, { error: e }) };
};

export async function registration(req: any, res: any) {
  const candidate = await User.findOne({ username: req.body.username });
  try {
    if (candidate) new ErrorHandler(res, { message: `user with name ${req.body.username} exists`, status: 409 })
    else {
      const salt = bcrypt.genSaltSync(10);
      const user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, salt)
      });
      await user.save();
      //@ts-ignore
      const added = await User.exists({ username: user.username });
      if (added) res.status(201).json({ message: user })
      else { new ErrorHandler(res, {}) };
    }
  } catch (e) { new ErrorHandler(res, { error: e }) };
};

export async function remove(req: any, res: any) {
  try {
    const candidate = await User.findOne({ username: req.params.username });
    if (!candidate) new ErrorHandler(res, { message: `user with name ${req.params.username} not exists`, status: 409 })
    else {
      //@ts-ignore
      await User.deleteOne({ username: candidate.username });
      //@ts-ignore
      const deleted = await User.exists({ username: candidate.username });
      if (!deleted)
        //@ts-ignore
        res.status(201).json({ message: `user ${candidate.username} deleted` })
      else { new ErrorHandler(res, {}) };
    };
  } catch (e) { new ErrorHandler(res, { error: e }) };
};
=======
import User from "../models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtString } from "../config/keys";

export async function login(req: any, res: any) {
  // console.log(`login`, req.body);
  try {
    const candidate: any = await User.findOne({ username: req.body.username });
    if (candidate) {
      const paswordOk = bcrypt.compareSync(
        req.body.password,
        candidate.password
      );
      if (paswordOk) {
        const token: string = jwt.sign(
          {
            username: candidate.username,
            userId: candidate._id
          },
          jwtString,
          { expiresIn: 3600 }
        );
        res.status(200).json({ token: `Bearer ${token}` });
      } else {
        res.status(401).json({ message: `password incorrect, try again` });
      }
    } else {
      res
        .status(404)
        .json({ message: `user with name ${req.body.username} doesn't exist` });
    }
  } catch (error) {
    res.status(500).json({ message: `internal server error` });
  }
}

export async function registration(req: any, res: any) {
  console.log(`registration`, req.body);
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
    }
  }
}

export async function remove(req: any, res: any) {
  console.log(`remove`, req.params);
  const candidate: any = await User.findOne({ username: req.params.username });

  if (!candidate) {
    res
      .status(409)
      .json({ message: `user with name ${req.params.username} not exists` });
  } else {
    try {
      // await User.remove({ username: candidate.username });
      await User.deleteOne({ username: candidate.username });
      const deleted = await User.exists({ username: candidate.username });
      console.log("deletedUser", deleted);
      if (!deleted)
        res.status(201).json({ message: `user ${candidate.username} deleted` });
      else console.log("HUYNIA TUT");
    } catch (error) {
      res.status(500).json({ message: `internal server error` });
    }
  }
}
>>>>>>> a94b38af48f81a22ff4c7b7c1e964a8a2a5e0d82
