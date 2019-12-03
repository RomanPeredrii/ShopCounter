import User from "../models/Users";

export function login(req: any, res: any) {
  res.status(200).json({
    login: {
      username: req.body.username,
      password: req.body.password
    }
  });
}

export async function registration(req: any, res: any) {
  const candidate = await User.findOne({ username: req.body.username });
  if (candidate) {
    res
      .status(409)
      .json({ message: `user with name ${req.body.username} exist` });
  } else {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    try { 
        await user.save();
        res
      .status(201)
      .json({ message: user });
  } catch (error) {
    res
    .status(500)
    .json({ message: `internal server error` });
  }};
};

export function remove(req: any, res: any) {
  res.status(200).json({
    remove: "remove from controller auth"
  });
}
