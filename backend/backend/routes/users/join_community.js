const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const router = require("express").Router();
const { MapCollection ,User} = require("../../models/schema");
const userVerification = require("../../middlewares/login_middleware");



router.post("/test",userVerification, async (req, res) => {
    try {
        const { CollectionId, password} = req.body;
        const getCollection = await MapCollection.findOne({ key: CollectionId });
        if (!getCollection) {
            return res.status(404).json({ msg: "Community not found" });
        }

        const isMatch = await bcrypt.compare(password, getCollection.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Incorrect password" });
        }

        return res.json({ isVerified:true });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ isVerified:false });
    }
});

router.post("/",userVerification,async(req,res)=>{
        const {CollectionId,data} = req.body;

        console.log(CollectionId);
        const getCollection = await MapCollection.findOne({ key: CollectionId });
        
        console.log(getCollection.field);
        const sampleData={user_id:req.user.id};
        const field = getCollection.field;
        for(let i=0;i<field.length;i++) {
            sampleData[field[i].data]=data[i];
        }
        console.log(sampleData);
        const admin_id=req.user.id;
        const s=getCollection.collectionName.toLowerCase()+"s";

        console.log("collection name:",s);
        await mongoose.connection.collection(s).insertOne(sampleData);

        await User.updateOne(
            { _id: admin_id },
            {
              $push: {
                "communities.user": {
                  community_key: CollectionId
                }
              }
            }
          );
          
        

        return res.json({ msg: "Joined community successfully"});
})

module.exports = router;
