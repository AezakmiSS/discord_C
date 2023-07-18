const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postRegister = async (req, res) => {
  try {
    const { username, mail, password } = req.body;

    // check if user exists
    const userExist = await User.exists({ mail: mail });

    if (userExist) {
      return res.status(409).send(`Email already in use`);
    }

    // if user doesn't exits encrypt the password

    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user document and save it to DB
    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    });

    // create a JWT token and provide to browser
    const token = jwt.sign(
      {
        userId: user._id,
        mail,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      userDetail: {
        mail: user.mail,
        token: token,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(500).send(`Error occured, please retry`);
  }
};

module.exports = postRegister;
