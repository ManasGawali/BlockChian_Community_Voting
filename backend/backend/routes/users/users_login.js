const router=require('express').Router();
const {mapCollection,User}=require("../../models/schema");
const UserVerification=require("../../middlewares/login_middleware");
const secret=require("../../middlewares/secret");
const  bcrypt = require("bcrypt");
const salt = 7;
// const app=express();
const jwt=require('jsonwebtoken');


router.post("/login",async(req,res)=>{
    const {email,password}  = req.body;
    const newUser = await User.findOne({ email });
    try {
        if (!newUser) {
            return res.status(404).json({ msg: "User not found" });
        }
    
        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, newUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid password" });
        }
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, name: newUser.username },
            secret,
            { expiresIn: 7200 }
        );
        return res.status(200).json({ msg: "Login successful", token });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ msg: "Server error" });       
    }
})


router.post("/register",async(req,res)=>{
    const {username,password,email} = req.body;
    
    const salted = await bcrypt.genSalt(salt);
    const hashed = await bcrypt.hash(password, salted);
    const newUser = new User({ username, password: hashed, email });


    await newUser.save();
    const token = jwt.sign(
        { id: newUser._id, email: newUser.email, name: newUser.username },
        secret,
        { expiresIn: 7200 }
    );
    
    return res.json({msg:"user Registered SuccessFully",token});
});



module.exports=router;

