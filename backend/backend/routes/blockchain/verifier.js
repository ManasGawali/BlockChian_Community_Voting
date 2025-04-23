const jwt = require('jsonwebtoken');
const secret = require("../../middlewares/secret"); // Ensure this path is correct
const router=require("express").Router();

router.post("/",(req,res)=>{
    // Get the token from the request header
    const {token} = req.body;

    // Check if the token is provided
    if (!token) {
        return res.status(403).json({ msg: "Access denied. No token provided." });
    }

    try {

        const decoded = jwt.verify(token, secret);
        res.status(200).json({verified:decoded}); // Attach the decoded user information to the request object
       
    } catch (error) {
        // Handle token verification errors
        console.error("Token verification error:", error);
        return res.status(401).json({ msg: "Token is not valid." });
    }
});

module.exports = router;