import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, { email, roles: user.roles });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile._json.email;
      try {
        if (!(await User.findOne({ email }))) {
          const newUser = new User({ email });
          if (process.env.ADMIN_EMAIL === newUser.email) {
            newUser.roles.push("admin");
          }
          await newUser.save();
        }
        const user = await User.findOne({ email });
        done(null, { email, roles: user.roles });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (payload, done) => {
      return done(null, payload.user);
    }
  )
);

export default passport;
