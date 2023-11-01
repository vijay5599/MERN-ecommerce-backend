const { json } = require("express");
const { User } = require("../model/User");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json({ id: doc.id, role: doc.role });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      res.status(401).json({ message: "User not found" });
    } else if (user.password === req.body.password) {
      // TODO: We will make addresses independent of login
      let jwtSecretKey = "JWT_SECRET_KEY";
      let data = {
        name: req.body.email,
      };

      const token = jwt.sign(data, jwtSecretKey);
      console.log({ token: token });

      if (token) {
        res
          .status(200)
          .json({ id: user.id, userName: user.email, role: user.role, token });
      } else {
        res.status(400).json({ message: "Token generation error" });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(400).json({ message: "Error", error: err });
  }
};

// exports.loginUser = passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/login",
//   failureFlash: true,
// });
