import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { jwtString } from "../config/keys";
import User from "../models/Users";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtString
};
//@ts-ignore
export default passport => {
  passport.use(
    //@ts-ignore
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await User.findById(payload.userId).select("username _id");
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        console.log(error);
      }
    })
  );
};
