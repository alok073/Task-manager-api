const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
    try {
        console.log("Auth verification middleware");
        const token = req.header("Authorization").replace("Bearer ", "");
        console.log(token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify() returns {_id, timestamp}
        console.log(decoded);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token});
        if(!user) {
            throw new Error();
        }
        console.log("User authenticated!!");

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).send("Error : Please authenticate!!")
    }
}

module.exports = auth;